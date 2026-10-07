import { Module } from '@nestjs/common';
import { InstagramApiService } from './instagram-api.service.js';
import { InstagramTokenService } from './instagram-token.service.js';

@Module({
  providers: [InstagramTokenService, InstagramApiService],
  exports: [InstagramApiService, InstagramTokenService],
})
export class InstagramModule {}
