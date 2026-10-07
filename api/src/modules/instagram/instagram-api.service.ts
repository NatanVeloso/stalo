import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../config/env.js';
import { redact } from '../../common/utils/redact.js';
import { InstagramApiError } from './instagram-api.error.js';
import { InstagramTokenService } from './instagram-token.service.js';
import type { IgErrorBody, IgMedia, IgPage, IgRefreshResponse } from './instagram.types.js';

const MEDIA_FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
  'like_count',
  'comments_count',
  'children{id,media_type,media_url,thumbnail_url}',
].join(',');

const PAGE_SIZE = 25;
const TIMEOUT_MS = 15_000;

/** Cliente da Graph API do Instagram (fluxo "Instagram API with Instagram Login"). */
@Injectable()
export class InstagramApiService {
  constructor(
    private readonly config: ConfigService<Env, true>,
    private readonly tokens: InstagramTokenService,
  ) {}

  /** Publicações da conta, da mais recente para a mais antiga, até `max`. */
  async *iterateMedia(max: number): AsyncGenerator<IgMedia> {
    let after: string | undefined;
    let count = 0;
    while (count < max) {
      const page = await this.get<IgPage<IgMedia>>('/me/media', {
        fields: MEDIA_FIELDS,
        limit: String(Math.min(PAGE_SIZE, max - count)),
        ...(after ? { after } : {}),
      });
      for (const media of page.data) {
        yield media;
        if (++count >= max) return;
      }
      after = page.paging?.cursors?.after;
      if (!after || page.data.length === 0) return;
    }
  }

  refreshToken(token: string): Promise<IgRefreshResponse> {
    return this.get<IgRefreshResponse>('/refresh_access_token', { grant_type: 'ig_refresh_token' }, token);
  }

  private async get<T>(path: string, params: Record<string, string>, token = this.tokens.current()): Promise<T> {
    const url = new URL(path, this.config.get('INSTAGRAM_GRAPH_URL', { infer: true }));
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set('access_token', token);

    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: 'application/json' } });
    } catch (err) {
      throw new InstagramApiError(`Falha de rede ao chamar ${path}: ${redact(String(err), [token])}`, 0);
    }

    const body = (await res.json().catch(() => ({}))) as T & IgErrorBody;
    if (!res.ok) {
      const detail = body.error?.message ?? res.statusText;
      throw new InstagramApiError(
        `Graph API ${res.status} em ${path}: ${redact(detail, [token])}`,
        res.status,
        body.error?.code,
      );
    }
    return body;
  }
}
