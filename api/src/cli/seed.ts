import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { AppModule } from '../app.module.js';
import type { Env } from '../config/env.js';
import { parseCaption } from '../common/utils/caption.js';
import { postSlug } from '../common/utils/slug.js';
import type { IgMedia } from '../modules/instagram/instagram.types.js';
import { PostsRepository } from '../modules/posts/posts.repository.js';

/**
 * `npm run seed [arquivo.json]`: grava uma publicação de exemplo no banco sem
 * precisar de token do Instagram. O JSON tem o formato da Graph API (ver
 * seed/sample-post.json); `media_url` pode ser um arquivo local, que é copiado
 * para MEDIA_DIR. Só para desenvolvimento e demonstração.
 */
const file = resolve(process.argv[2] ?? 'seed/sample-post.json');
const media = JSON.parse(await readFile(file, 'utf8')) as IgMedia;

const app = await NestFactory.createApplicationContext(AppModule, { logger: ['warn', 'error'] });
try {
  const mediaDir = resolve(app.get(ConfigService<Env, true>).get('MEDIA_DIR', { infer: true }));
  const parsed = parseCaption(media.caption);

  let coverPath: string | null = null;
  if (media.media_url && !/^https?:/.test(media.media_url)) {
    const source = resolve(dirname(file), media.media_url);
    coverPath = `${media.id}/${media.id}${extname(source) || '.jpg'}`;
    await mkdir(join(mediaDir, media.id), { recursive: true });
    await copyFile(source, join(mediaDir, coverPath));
  }

  const now = new Date().toISOString();
  app.get(PostsRepository).upsert(
    {
      id: media.id,
      slug: postSlug(parsed.title, media.id),
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      caption: media.caption ?? '',
      hashtags: parsed.hashtags,
      mediaType: media.media_type,
      permalink: media.permalink,
      coverPath,
      likeCount: media.like_count ?? null,
      commentsCount: media.comments_count ?? null,
      publishedAt: new Date(media.timestamp).toISOString(),
      syncedAt: now,
      removedAt: null,
    },
    [
      {
        id: media.id,
        postId: media.id,
        position: 0,
        mediaType: media.media_type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
        path: coverPath,
        videoPath: null,
      },
    ],
  );
  console.log(`Publicação de exemplo gravada: ${basename(file)} → /api/posts/${postSlug(parsed.title, media.id)}`);
} finally {
  await app.close();
}
