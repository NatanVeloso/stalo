import type { MediaType } from '../../../database/schema.js';

/** Card do blog (lista e home). */
export interface PostSummaryResponse {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  mediaType: MediaType;
  /** URL pública da capa (servida em /media), ou null se o download falhou */
  coverUrl: string | null;
  permalink: string;
  publishedAt: string;
  likeCount: number | null;
  commentsCount: number | null;
}

export interface PostMediaResponse {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  /** imagem (thumbnail, se vídeo) */
  url: string | null;
  /** mp4 servido pelo site; null = o vídeo toca no Instagram (permalink) */
  videoUrl: string | null;
}

/** Página da publicação. */
export interface PostDetailResponse extends PostSummaryResponse {
  body: string;
  caption: string;
  hashtags: string[];
  media: PostMediaResponse[];
}

export interface PostListResponse {
  items: PostSummaryResponse[];
  /** passe em `before` para a próxima página; null quando acabou */
  nextCursor: string | null;
}
