import { Controller, Get } from '@nestjs/common';
import { InstagramTokenService } from '../instagram/instagram-token.service.js';
import { PostsRepository } from '../posts/posts.repository.js';
import { SyncService } from '../sync/sync.service.js';

/** Para monitoramento: a API está de pé, quantos posts tem e quando sincronizou. */
@Controller('health')
export class HealthController {
  constructor(
    private readonly posts: PostsRepository,
    private readonly sync: SyncService,
    private readonly tokens: InstagramTokenService,
  ) {}

  @Get()
  check() {
    return {
      status: 'ok',
      posts: this.posts.countPublished(),
      instagramConfigured: this.tokens.isConfigured,
      syncRunning: this.sync.isRunning,
      lastSyncAt: this.sync.lastRunAt ?? null,
    };
  }
}
