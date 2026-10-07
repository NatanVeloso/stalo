import type { PostMediaRow, PostRow } from '../../database/schema.js';
import type { PostDetailResponse, PostSummaryResponse } from './dto/post.response.js';

export const MEDIA_PUBLIC_PATH = '/media';

const mediaUrl = (path: string | null) => (path ? `${MEDIA_PUBLIC_PATH}/${path}` : null);

export function toSummary(row: PostRow): PostSummaryResponse {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    mediaType: row.mediaType,
    coverUrl: mediaUrl(row.coverPath),
    permalink: row.permalink,
    publishedAt: row.publishedAt,
    likeCount: row.likeCount,
    commentsCount: row.commentsCount,
  };
}

export function toDetail(row: PostRow & { media: PostMediaRow[] }): PostDetailResponse {
  return {
    ...toSummary(row),
    body: row.body,
    caption: row.caption,
    hashtags: row.hashtags,
    media: [...row.media]
      .sort((a, b) => a.position - b.position)
      .map((m) => ({ id: m.id, mediaType: m.mediaType, url: mediaUrl(m.path), videoUrl: mediaUrl(m.videoPath) })),
  };
}
