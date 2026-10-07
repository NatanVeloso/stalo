import { locale, postHref, t } from '../i18n'
import { formatPostDate, type PostSummary } from '../lib/posts'
import { Logo } from './Logo'

type Props = {
  post: PostSummary
  /** `light`: sobre section clara (home). `dark`: sobre fundo escuro (página do blog). */
  tone?: 'light' | 'dark'
  className?: string
}

/** Card de uma publicação: capa, data, título e resumo; o card inteiro é o link. */
export function PostCard({ post, tone = 'light', className = '' }: Props) {
  const dark = tone === 'dark'
  return (
    <a
      href={postHref(post.slug)}
      className={`post-card group flex flex-col overflow-hidden rounded-3xl border transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-1 ${
        dark
          ? 'border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.09] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]'
          : 'border-navy/[0.08] bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_rgba(11,18,32,0.05)] hover:bg-white hover:shadow-[0_24px_60px_rgba(11,18,32,0.1)]'
      } ${className}`}
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${dark ? 'bg-white/[0.06]' : 'bg-[#c9d2de]'}`}>
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // sem imagem (download falhou ou vídeo sem thumbnail): fundo de marca com o asterisco
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#0b1220,#13213a_60%,#0d2622)] text-fog/80">
            <Logo markOnly className="h-16 w-auto transition-transform duration-700 group-hover:scale-110" />
          </div>
        )}
        {post.mediaType !== 'IMAGE' && (
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
            <MediaIcon type={post.mediaType} />
            <span className="sr-only">{post.mediaType === 'VIDEO' ? t.blog.video : t.blog.carousel}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <time dateTime={post.publishedAt} className={`text-[13px] ${dark ? 'text-fog/55' : 'text-slate'}`}>
          {formatPostDate(post.publishedAt, locale)}
        </time>
        <h3 className="m-0 text-balance text-[20px] font-medium leading-[1.2] tracking-[-0.01em]">{post.title}</h3>
        {post.excerpt && (
          <p className={`m-0 line-clamp-3 text-pretty text-[15px] leading-[1.55] ${dark ? 'text-fog/70' : 'text-slate-2'}`}>
            {post.excerpt}
          </p>
        )}
        <span className={`mt-auto inline-flex items-center gap-2 pt-2 text-[14px] font-semibold ${dark ? 'text-sky' : 'text-blue'}`}>
          {t.blog.readMore}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </a>
  )
}

function MediaIcon({ type }: { type: PostSummary['mediaType'] }) {
  return type === 'VIDEO' ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="7" width="14" height="14" rx="2" />
      <path d="M7 3h12a2 2 0 0 1 2 2v12" />
    </svg>
  )
}
