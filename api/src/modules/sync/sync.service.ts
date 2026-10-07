import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import type { Env } from '../../config/env.js';
import { parseCaption } from '../../common/utils/caption.js';
import { errorMessage, redact } from '../../common/utils/redact.js';
import { postSlug } from '../../common/utils/slug.js';
import type { NewPostMediaRow, NewPostRow } from '../../database/schema.js';
import { SettingsRepository } from '../../database/settings.repository.js';
import { InstagramApiError } from '../instagram/instagram-api.error.js';
import { InstagramApiService } from '../instagram/instagram-api.service.js';
import { InstagramTokenService } from '../instagram/instagram-token.service.js';
import type { IgMedia } from '../instagram/instagram.types.js';
import { MediaStorageService } from '../media/media-storage.service.js';
import { PostsRepository } from '../posts/posts.repository.js';

export const LAST_SYNC_KEY = 'sync.lastRunAt';

export interface SyncReport {
  status: 'ok' | 'skipped' | 'already-running';
  fetched: number;
  saved: number;
  failed: number;
  removed: number;
  durationMs: number;
  reason?: string;
}

/**
 * Traz as publicações do Instagram para o banco: busca as mais recentes,
 * baixa as imagens, salva e marca o que foi apagado lá. Roda no cron, uma vez
 * ao subir e sob demanda (POST /api/sync). Nunca roda duas ao mesmo tempo.
 */
@Injectable()
export class SyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SyncService.name);
  private running = false;

  constructor(
    private readonly config: ConfigService<Env, true>,
    private readonly scheduler: SchedulerRegistry,
    private readonly api: InstagramApiService,
    private readonly tokens: InstagramTokenService,
    private readonly media: MediaStorageService,
    private readonly posts: PostsRepository,
    private readonly settings: SettingsRepository,
  ) {}

  onApplicationBootstrap() {
    if (this.config.get('NODE_ENV', { infer: true }) === 'test') return;
    if (!this.tokens.isConfigured) {
      this.logger.warn('INSTAGRAM_ACCESS_TOKEN ausente: sincronização desligada, servindo só o que está no banco');
      return;
    }
    const job = new CronJob(this.config.get('SYNC_CRON', { infer: true }), () => void this.safeRun('cron'));
    this.scheduler.addCronJob('instagram-sync', job);
    job.start();
    if (this.config.get('SYNC_ON_BOOT', { infer: true })) setTimeout(() => void this.safeRun('boot'), 0);
  }

  get isRunning(): boolean {
    return this.running;
  }

  get lastRunAt(): string | undefined {
    return this.settings.get(LAST_SYNC_KEY);
  }

  async run(): Promise<SyncReport> {
    const started = Date.now();
    const done = (partial: Omit<SyncReport, 'durationMs'>): SyncReport => ({
      ...partial,
      durationMs: Date.now() - started,
    });
    const empty = { fetched: 0, saved: 0, failed: 0, removed: 0 };

    if (!this.tokens.isConfigured) return done({ status: 'skipped', reason: 'Instagram não configurado', ...empty });
    if (this.running) return done({ status: 'already-running', ...empty });
    this.running = true;

    try {
      await this.tokens.ensureFresh((token) => this.api.refreshToken(token));

      const seen: string[] = [];
      let oldest: string | undefined;
      let saved = 0;
      let failed = 0;

      for await (const media of this.api.iterateMedia(this.config.get('SYNC_MAX_POSTS', { infer: true }))) {
        seen.push(media.id);
        if (!oldest || media.timestamp < oldest) oldest = media.timestamp;
        try {
          await this.ingest(media);
          saved++;
        } catch (err) {
          failed++;
          this.logger.error(`Publicação ${media.id} não salva: ${redact(errorMessage(err))}`);
        }
      }

      // só marca removidos quando a leitura foi completa: uma falha no meio não pode apagar post do site
      let removed = 0;
      if (oldest && failed === 0) {
        const ids = this.posts.markRemovedNotIn(seen, new Date(oldest).toISOString());
        removed = ids.length;
        await Promise.all(ids.map((id) => this.media.removePost(id)));
      }

      this.settings.set(LAST_SYNC_KEY, new Date().toISOString());
      const report = done({ status: 'ok', fetched: seen.length, saved, failed, removed });
      this.logger.log(
        `Sync concluída: ${report.fetched} lidas, ${saved} salvas, ${failed} falhas, ${removed} removidas (${report.durationMs} ms)`,
      );
      return report;
    } catch (err) {
      if (err instanceof InstagramApiError && err.isAuthError) this.tokens.invalidateStored();
      throw err;
    } finally {
      this.running = false;
    }
  }

  /** Uma publicação → linha de post + mídias, com as imagens já no disco. */
  private async ingest(media: IgMedia): Promise<void> {
    const parsed = parseCaption(media.caption);
    const children =
      media.media_type === 'CAROUSEL_ALBUM' && media.children?.data.length ? media.children.data : [media];

    const downloadVideos = this.config.get('SYNC_DOWNLOAD_VIDEOS', { infer: true });
    const rows: NewPostMediaRow[] = [];
    for (const [position, child] of children.entries()) {
      const isVideo = child.media_type === 'VIDEO';
      // vídeo: a thumbnail vira a capa; o mp4 só é baixado se configurado (senão toca no Instagram)
      rows.push({
        id: child.id,
        postId: media.id,
        position,
        mediaType: isVideo ? 'VIDEO' : 'IMAGE',
        path: await this.media.ensureImage(isVideo ? child.thumbnail_url : child.media_url, media.id, child.id),
        videoPath: isVideo && downloadVideos ? await this.media.ensureVideo(child.media_url, media.id, child.id) : null,
      });
    }

    let slug = postSlug(parsed.title, media.id);
    if (this.posts.slugTaken(slug, media.id)) slug = `${slug}-${media.id.slice(-10)}`;

    const post: NewPostRow = {
      id: media.id,
      slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      caption: media.caption ?? '',
      hashtags: parsed.hashtags,
      mediaType: media.media_type,
      permalink: media.permalink,
      coverPath: rows.find((r) => r.path)?.path ?? null,
      likeCount: media.like_count ?? null,
      commentsCount: media.comments_count ?? null,
      publishedAt: new Date(media.timestamp).toISOString(),
      syncedAt: new Date().toISOString(),
      removedAt: null,
    };
    this.posts.upsert(post, rows);
  }

  private async safeRun(trigger: string): Promise<void> {
    try {
      await this.run();
    } catch (err) {
      this.logger.error(`Sync (${trigger}) falhou: ${redact(errorMessage(err))}`);
    }
  }
}
