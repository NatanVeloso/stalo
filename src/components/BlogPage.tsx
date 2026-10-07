import { useEffect, useState } from 'react'
import { company } from '../data/company'
import { homeHref, t } from '../i18n'
import { hideBoot } from '../lib/boot'
import { fetchPosts, type PostSummary } from '../lib/posts'
import { CookieConsent } from './CookieConsent'
import { PageFooter } from './PageFooter'
import { PageHeader } from './PageHeader'
import { PostCard } from './PostCard'

const PAGE_SIZE = 12

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: PostSummary[]; nextCursor: string | null; loadingMore: boolean }

/** /blog: todas as publicações, paginadas por "carregar mais". Página estática, sem GSAP. */
export function BlogPage() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    document.title = `${t.blog.pageTitle} — ${company.name}`
    hideBoot()
    fetchPosts({ limit: PAGE_SIZE })
      .then((list) => setState({ status: 'ready', items: list.items, nextCursor: list.nextCursor, loadingMore: false }))
      .catch(() => setState({ status: 'error' }))
  }, [])

  const loadMore = async () => {
    if (state.status !== 'ready' || !state.nextCursor || state.loadingMore) return
    setState({ ...state, loadingMore: true })
    try {
      const list = await fetchPosts({ limit: PAGE_SIZE, before: state.nextCursor })
      setState({ status: 'ready', items: [...state.items, ...list.items], nextCursor: list.nextCursor, loadingMore: false })
    } catch {
      setState({ ...state, loadingMore: false })
    }
  }

  return (
    <div className="min-h-screen bg-ink text-fog">
      <PageHeader />

      <main className="px-6 pb-16 pt-16 md:pt-24">
        <div className="container-site">
          <div className="mb-12 max-w-[760px]">
            <a href={homeHref()} className="mb-8 inline-flex items-center gap-2 text-sm text-fog/70 transition-colors hover:text-sky">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              {t.legal.back}
            </a>
            <p className="m-0 mb-4 text-[13px] uppercase tracking-[0.12em] text-fog/60">{t.blog.eyebrow}</p>
            <h1 className="m-0 mb-5 text-balance text-[clamp(36px,5vw,60px)] font-medium leading-[1.02] tracking-[-0.03em]">
              {t.blog.title} <span className="serif-italic">{t.blog.accent}</span>
            </h1>
            <p className="m-0 max-w-[560px] text-pretty text-[17px] leading-[1.6] text-fog/80">{t.blog.lead}</p>
          </div>

          {state.status === 'loading' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04]">
                  <div className="aspect-[4/5] bg-white/[0.06]" />
                  <div className="flex flex-col gap-3 p-6">
                    <div className="h-3 w-24 rounded bg-white/10" />
                    <div className="h-5 w-3/4 rounded bg-white/10" />
                    <div className="h-4 w-full rounded bg-white/[0.07]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {state.status === 'error' && <Notice>{t.blog.error}</Notice>}

          {state.status === 'ready' && state.items.length === 0 && <Notice>{t.blog.empty}</Notice>}

          {state.status === 'ready' && state.items.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.items.map((p) => (
                  <PostCard key={p.id} post={p} tone="dark" />
                ))}
              </div>
              {state.nextCursor && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={state.loadingMore}
                    className="cursor-pointer rounded-full border border-white/20 bg-white/[0.08] px-6 py-3 text-[15px] font-semibold text-fog transition-colors hover:bg-white/[0.14] disabled:cursor-wait disabled:opacity-60"
                  >
                    {t.blog.loadMore}
                  </button>
                </div>
              )}
            </>
          )}

          <PageFooter />
        </div>
      </main>
      <CookieConsent />
    </div>
  )
}

function Notice({ children }: { children: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.04] px-7 py-10 text-center">
      <p className="m-0 text-[17px] text-fog/80">{children}</p>
      <a
        href={company.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex rounded-full bg-fog px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
      >
        {t.blog.follow}
      </a>
    </div>
  )
}
