import { Module } from '@nestjs/common';
import { InstagramModule } from '../instagram/instagram.module.js';
import { MediaModule } from '../media/media.module.js';
import { PostsModule } from '../posts/posts.module.js';
import { SyncController } from './sync.controller.js';
import { SyncService } from './sync.service.js';

@Module({
  imports: [InstagramModule, MediaModule, PostsModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
