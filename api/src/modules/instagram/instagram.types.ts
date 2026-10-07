/** Formas das respostas da Graph API do Instagram (só os campos que usamos). */

export type IgMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface IgChild {
  id: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url?: string;
  thumbnail_url?: string;
}

export interface IgMedia {
  id: string;
  caption?: string;
  media_type: IgMediaType;
  media_url?: string;
  /** só em vídeos */
  thumbnail_url?: string;
  permalink: string;
  /** ISO 8601 */
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  children?: { data: IgChild[] };
}

export interface IgPage<T> {
  data: T[];
  paging?: { cursors?: { before?: string; after?: string }; next?: string };
}

export interface IgRefreshResponse {
  access_token: string;
  token_type: string;
  /** segundos */
  expires_in: number;
}

export interface IgErrorBody {
  error?: { message?: string; type?: string; code?: number; error_subcode?: number };
}
