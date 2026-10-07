import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const MEDIA_TYPES = ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

/** Publicação do Instagram, já tratada para virar post do blog. Datas em ISO 8601. */
export const posts = sqliteTable(
  'posts',
  {
    /** id da mídia no Instagram */
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    /** corpo sem o título e sem as hashtags do fim (ver utils/caption.ts) */
    body: text('body').notNull(),
    /** legenda original, intacta */
    caption: text('caption').notNull(),
    hashtags: text('hashtags', { mode: 'json' }).$type<string[]>().notNull().default([]),
    mediaType: text('media_type', { enum: MEDIA_TYPES }).notNull(),
    permalink: text('permalink').notNull(),
    /** caminho relativo a MEDIA_DIR da imagem de capa (thumbnail, se vídeo) */
    coverPath: text('cover_path'),
    likeCount: integer('like_count'),
    commentsCount: integer('comments_count'),
    publishedAt: text('published_at').notNull(),
    syncedAt: text('synced_at').notNull(),
    /** sumiu do Instagram: some do site, mas fica no banco */
    removedAt: text('removed_at'),
  },
  (t) => [index('posts_published_idx').on(t.publishedAt)],
);

/** Itens de um carrossel (ou a única mídia de um post simples), na ordem do Instagram. */
export const postMedia = sqliteTable(
  'post_media',
  {
    id: text('id').primaryKey(),
    postId: text('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    mediaType: text('media_type', { enum: ['IMAGE', 'VIDEO'] }).notNull(),
    /** imagem baixada (thumbnail, se vídeo); null se o download falhou */
    path: text('path'),
    /** mp4 baixado (só vídeos, com SYNC_DOWNLOAD_VIDEOS); null = toca no Instagram */
    videoPath: text('video_path'),
  },
  (t) => [index('post_media_post_idx').on(t.postId)],
);

/** Pares chave/valor da aplicação (token cifrado do Instagram, data da última sync). */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const postsRelations = relations(posts, ({ many }) => ({
  media: many(postMedia),
}));

export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(posts, { fields: [postMedia.postId], references: [posts.id] }),
}));

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;
export type PostMediaRow = typeof postMedia.$inferSelect;
export type NewPostMediaRow = typeof postMedia.$inferInsert;
