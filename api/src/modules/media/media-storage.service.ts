import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, existsSync } from 'node:fs';
import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import type { Env } from '../../config/env.js';

/** Só baixamos do CDN da Meta; qualquer outra origem é recusada. */
const ALLOWED_HOSTS = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;
const IMAGE_MAX_BYTES = 25 * 1024 * 1024;
const IMAGE_TIMEOUT_MS = 20_000;
const VIDEO_TIMEOUT_MS = 180_000;
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const VIDEO_EXTENSIONS: Record<string, string> = { 'video/mp4': 'mp4' };
/** sufixo do arquivo de vídeo, para não confundir com a thumbnail do mesmo id */
const VIDEO_SUFFIX = '-video';

/**
 * Baixa as mídias das publicações para MEDIA_DIR, porque as URLs que a Meta
 * devolve expiram em poucos dias. Arquivos: `<postId>/<mediaId>.<ext>` para
 * imagens e `<postId>/<mediaId>-video.mp4` para vídeos; os nomes vêm de ids do
 * Instagram, nunca de entrada do usuário. Escrita atômica (.part → rename).
 */
@Injectable()
export class MediaStorageService {
  private readonly logger = new Logger(MediaStorageService.name);
  private readonly root: string;
  private readonly videoMaxBytes: number;

  constructor(config: ConfigService<Env, true>) {
    this.root = resolve(config.get('MEDIA_DIR', { infer: true }));
    this.videoMaxBytes = config.get('SYNC_VIDEO_MAX_MB', { infer: true }) * 1024 * 1024;
  }

  /** Garante a imagem no disco e devolve o caminho relativo (ou null se não deu). */
  async ensureImage(url: string | undefined, postId: string, mediaId: string): Promise<string | null> {
    const existing = await this.find(postId, mediaId, IMAGE_EXTENSIONS);
    if (existing) return existing;
    const parsed = this.allowed(url);
    if (!parsed) return null;

    try {
      const res = await fetch(parsed, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
      const ext = this.checkResponse(res, IMAGE_EXTENSIONS, IMAGE_MAX_BYTES);
      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length > IMAGE_MAX_BYTES) throw new Error(`arquivo grande demais (${bytes.length} bytes)`);
      return await this.commit(postId, `${mediaId}.${ext}`, async (tmp) => writeFile(tmp, bytes));
    } catch (err) {
      this.logger.warn(`Download da imagem ${mediaId} falhou: ${message(err)}`);
      return null;
    }
  }

  /** Garante o vídeo (mp4) no disco, em streaming, respeitando SYNC_VIDEO_MAX_MB. */
  async ensureVideo(url: string | undefined, postId: string, mediaId: string): Promise<string | null> {
    const existing = await this.find(postId, `${mediaId}${VIDEO_SUFFIX}`, VIDEO_EXTENSIONS);
    if (existing) return existing;
    const parsed = this.allowed(url);
    if (!parsed) return null;

    try {
      const res = await fetch(parsed, { signal: AbortSignal.timeout(VIDEO_TIMEOUT_MS) });
      const ext = this.checkResponse(res, VIDEO_EXTENSIONS, this.videoMaxBytes);
      if (!res.body) throw new Error('resposta sem corpo');
      const body = res.body;
      const max = this.videoMaxBytes;
      return await this.commit(postId, `${mediaId}${VIDEO_SUFFIX}.${ext}`, async (tmp) => {
        let total = 0;
        const limiter = new Transform({
          transform(chunk: Buffer, _enc, cb) {
            total += chunk.length;
            if (total > max) cb(new Error(`arquivo grande demais (> ${max} bytes)`));
            else cb(null, chunk);
          },
        });
        await pipeline(Readable.fromWeb(body as ReadableStream), limiter, createWriteStream(tmp));
      });
    } catch (err) {
      this.logger.warn(`Download do vídeo ${mediaId} falhou: ${message(err)}`);
      return null;
    }
  }

  /** Apaga as mídias de uma publicação que saiu do Instagram. */
  async removePost(postId: string): Promise<void> {
    await rm(join(this.root, postId), { recursive: true, force: true });
  }

  private allowed(url: string | undefined): URL | null {
    if (!url) return null;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return null;
    }
    if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.test(parsed.hostname)) {
      this.logger.warn(`URL de mídia fora do CDN da Meta ignorada (${parsed.hostname})`);
      return null;
    }
    return parsed;
  }

  /** Valida status, content-type e tamanho declarado; devolve a extensão. */
  private checkResponse(res: Response, extensions: Record<string, string>, maxBytes: number): string {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
    const ext = extensions[type];
    if (!ext) throw new Error(`content-type inesperado: ${type || 'vazio'}`);
    const declared = Number(res.headers.get('content-length') ?? 0);
    if (declared > maxBytes) throw new Error(`arquivo grande demais (${declared} bytes)`);
    return ext;
  }

  /** Escreve em `<name>.part` e renomeia no fim: nunca servimos arquivo pela metade. */
  private async commit(postId: string, name: string, write: (tmp: string) => Promise<void>): Promise<string> {
    const rel = `${postId}/${name}`;
    const final = join(this.root, rel);
    const tmp = `${final}.part`;
    await mkdir(dirname(final), { recursive: true });
    try {
      await write(tmp);
      await rename(tmp, final);
    } catch (err) {
      await rm(tmp, { force: true });
      throw err;
    }
    return rel;
  }

  private async find(postId: string, stem: string, extensions: Record<string, string>): Promise<string | null> {
    const dir = join(this.root, postId);
    if (!existsSync(dir)) return null;
    const names = new Set(Object.values(extensions).map((ext) => `${stem}.${ext}`));
    const hit = (await readdir(dir)).find((f) => names.has(f));
    return hit ? `${postId}/${hit}` : null;
  }
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
