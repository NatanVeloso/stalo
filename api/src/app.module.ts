import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { resolve } from 'node:path';
import { validateEnv, type Env } from './config/env.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { InstagramModule } from './modules/instagram/instagram.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { MEDIA_PUBLIC_PATH } from './modules/posts/post.mapper.js';
import { PostsModule } from './modules/posts/posts.module.js';
import { SyncModule } from './modules/sync/sync.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv, envFilePath: ['.env.local', '.env'] }),
    // 60 requisições por minuto por IP em tudo; o /sync aperta mais no próprio controller
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    ScheduleModule.forRoot(),
    // imagens baixadas, com cache longo: o nome do arquivo é o id da mídia, não muda
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => [
        {
          rootPath: resolve(config.get('MEDIA_DIR', { infer: true })),
          serveRoot: MEDIA_PUBLIC_PATH,
          serveStaticOptions: { index: false, immutable: true, maxAge: '30d', fallthrough: false },
        },
      ],
    }),
    DatabaseModule,
    InstagramModule,
    MediaModule,
    PostsModule,
    SyncModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
