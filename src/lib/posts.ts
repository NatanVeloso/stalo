/**
 * Cliente da API do blog (api/, NestJS). As publicações vêm do Instagram da
 * Stalo, sincronizadas pelo backend; aqui só lemos. Caminhos relativos: em dev
 * o Vite faz proxy de /api e /media para o Nest, em produção é o nginx.
 */
export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  mediaType: MediaType
  coverUrl: string | null
  permalink: string
  /** ISO 8601 */
  publishedAt: string
  likeCount: number | null
  commentsCount: number | null
}

export interface PostMedia {
  id: string
  mediaType: 'IMAGE' | 'VIDEO'
  /** imagem (thumbnail, se vídeo) */
  url: string | null
  /** mp4 servido pelo site; null = o vídeo toca no Instagram */
  videoUrl: string | null
}

export interface PostDetail extends PostSummary {
  body: string
  caption: string
  hashtags: string[]
  media: PostMedia[]
}

export interface PostList {
  items: PostSummary[]
  nextCursor: string | null
}

const API = '/api'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function get<T>(path: string, timeoutMs = 10_000): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new ApiError(res.status, `${res.status} em ${path}`)
  return (await res.json()) as T
}

export function fetchPosts(opts: { limit?: number; before?: string } = {}): Promise<PostList> {
  const params = new URLSearchParams()
  if (opts.limit) params.set('limit', String(opts.limit))
  if (opts.before) params.set('before', opts.before)
  const qs = params.toString()
  return get<PostList>(`/posts${qs ? `?${qs}` : ''}`)
}

export function fetchPost(slug: string): Promise<PostDetail> {
  return get<PostDetail>(`/posts/${encodeURIComponent(slug)}`)
}

/**
 * Últimas publicações para a home. Roda antes do primeiro render, então tem
 * teto curto e nunca falha: sem API (ou lenta), a home sobe sem a seção.
 */
export async function fetchHomePosts(limit = 3, timeoutMs = 1500): Promise<PostSummary[]> {
  try {
    const list = await Promise.race([
      fetchPosts({ limit }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ])
    return list.items
  } catch {
    return []
  }
}

/** "28 de setembro de 2026" no idioma do site. */
export function formatPostDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

/** Corpo da legenda em parágrafos: linha em branco separa; quebra simples vira <br>. */
export function paragraphs(body: string): string[][] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((p) => p.length)
}
