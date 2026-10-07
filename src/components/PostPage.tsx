import { useEffect, useState } from 'react'
import { company } from '../data/company'
import { blogHref, locale, t } from '../i18n'
import { hideBoot } from '../lib/boot'
import { ApiError, fetchPost, formatPostDate, paragraphs, type PostDetail } from '../lib/posts'
import { CookieConsent } from './CookieConsent'
import { PageFooter } from './PageFooter'
import { PageHeader } from './PageHeader'

type Props = { slug: string }

type State = { status: 'loading' } | { status: 'not-found' } | { status: 'error' } | { status: 'ready'; post: PostDetail }

/** /blog/:slug: a publicação inteira, com galeria quando é carrossel. Página estática, sem GSAP. */
export function PostPage({ slug }: Props) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    hideBoot()
    fetchPost(slug)
      .then((post) => {
        document.title = `${post.title} — ${company.name}`
        setState({ status: 'ready', post })
      })
      .catch((err) => setState({ status: err instanceof ApiError && err.status === 404 ? 'not-found' : 'error' }))
  }, [slug])

  return (
    <div className="min-h-screen bg-ink text-fog">
      <PageHeader>
        <a href={blogHref()} className="hidden text-fog/75 transition-colors hover:text-sky md:block">
          {t.blog.pageTitle}
        </a>
      </PageHeader>

      <main className="px-6 pb-16 pt-12 md:pt-20">
        <article className="mx-auto max-w-[760px]">
          <a href={blogHref()} className="mb-8 inline-flex items-center gap-2 text-sm text-fog/70 transition-colors hover:text-sky">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            {t.blog.back}
          </a>

          {state.status === 'loading' && (
            <div className="animate-pulse" aria-busy="true">
              <div className="h-3 w-32 rounded bg-white/10" />
              <div className="mt-5 h-10 w-4/5 rounded bg-white/10" />
              <div className="mt-8 aspect-[4/5] max-h-[560px] rounded-3xl bg-white/[0.06]" />
            </div>
          )}

          {state.status === 'not-found' && <Notice>{t.blog.notFound}</Notice>}
          {state.status === 'error' && <Notice>{t.blog.error}</Notice>}

          {state.status === 'ready' && <Post post={state.post} />}

          <PageFooter />
        </article>
      </main>
      <CookieConsent />
    </div>
  )
}

function Post({ post }: { post: PostDetail }) {
  const media = post.media.filter((m) => m.url || m.videoUrl)
  const body = paragraphs(post.body)

  return (
    <>
      <p className="m-0 mb-4 text-[13px] uppercase tracking-[0.12em] text-fog/60">
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
        {locale !== 'pt-BR' && <span className="normal-case tracking-normal"> · {t.blog.originalLanguage}</span>}
      </p>
      <h1 className="m-0 text-balance text-[clamp(32px,4.6vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">{post.title}</h1>

      {/* vídeo sem thumbnail nem mp4 (ex.: download falhou): só o convite para ver no Instagram */}
      {media.length === 0 && post.mediaType === 'VIDEO' && (
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex aspect-[16/9] items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0b1220,#13213a_60%,#0d2622)] transition-opacity hover:opacity-90"
          aria-label={t.blog.openOnInstagram}
        >
          <span className="flex items-center gap-3 rounded-full bg-white/90 py-3 pl-4 pr-6 text-[15px] font-semibold text-navy shadow-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            {t.blog.watchOnInstagram}
          </span>
        </a>
      )}

      {media.length > 0 && (
        <div
          className={`mt-8 ${media.length > 1 ? 'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]' : ''}`}
          aria-label={media.length > 1 ? t.blog.carousel : undefined}
        >
          {media.map((m) => (
            <figure
              key={m.id}
              className={`relative m-0 overflow-hidden rounded-3xl bg-white/[0.06] ${
                media.length > 1 ? 'aspect-[4/5] w-[min(100%,520px)] shrink-0 snap-center' : ''
              }`}
            >
              {m.videoUrl ? (
                // o mp4 foi baixado pela API: toca aqui mesmo, com a thumbnail de poster
                <video
                  src={m.videoUrl}
                  poster={m.url ?? undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className={media.length > 1 ? 'absolute inset-0 h-full w-full object-cover' : 'block max-h-[720px] w-full'}
                />
              ) : m.url ? (
                <img
                  src={m.url}
                  alt=""
                  decoding="async"
                  className={media.length > 1 ? 'absolute inset-0 h-full w-full object-cover' : 'block max-h-[720px] w-full object-contain'}
                />
              ) : null}
              {m.mediaType === 'VIDEO' && !m.videoUrl && (
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
                  aria-label={t.blog.openOnInstagram}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </a>
              )}
            </figure>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-5 text-[18px] leading-[1.65] text-fog/85">
        {body.map((lines, i) => (
          <p key={i} className="m-0 text-pretty">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>

      {post.hashtags.length > 0 && (
        <ul className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">
          {post.hashtags.map((h) => (
            <li key={h} className="rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1 text-[13px] text-fog/70">
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-fog px-5 py-3 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.3" />
            <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
          </svg>
          {t.blog.openOnInstagram}
        </a>
        {post.likeCount != null && (
          <span className="text-sm text-fog/60">
            {post.likeCount} {t.blog.likes}
            {post.commentsCount != null && ` · ${post.commentsCount} ${t.blog.comments}`}
          </span>
        )}
      </div>
    </>
  )
}

function Notice({ children }: { children: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.04] px-7 py-10 text-center">
      <p className="m-0 text-[17px] text-fog/80">{children}</p>
      <a href={blogHref()} className="mt-5 inline-flex rounded-full bg-fog px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white">
        {t.blog.back}
      </a>
    </div>
  )
}
