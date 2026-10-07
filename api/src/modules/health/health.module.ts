import { Module } from '@nestjs/common';
import { InstagramModule } from '../instagram/instagram.module.js';
import { PostsModule } from '../posts/posts.module.js';
import { SyncModule } from '../sync/sync.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [PostsModule, SyncModule, InstagramModule],
  controllers: [HealthController],
})
export class HealthModule {}
