import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { company } from '../data/company'
import { blogHref, t } from '../i18n'
import type { PostSummary } from '../lib/posts'
import { StackSection } from './StackSection'
import { PostCard } from './PostCard'
import { CursorGlow } from './CursorGlow'

type Props = {
  /** Já carregadas antes do primeiro render (main.tsx): a section não muda de altura depois de montada. */
  posts: PostSummary[]
}

/** "Blog": as últimas publicações do Instagram, entre "Como funciona" e o bloco final. */
export function Blog({ posts }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])
      gsap.from([...q('.eyebrow'), ...q('.lead')], {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.title'), start: 'top 85%', once: true },
      })
      // fromTo com o destino explícito: com from() o cartão podia terminar parado em y: 60
      // (o valor inicial virava o final) e invadir os botões logo abaixo
      gsap.fromTo(
        q('.post-card'),
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 1.1,
          clearProps: 'transform',
          scrollTrigger: { trigger: q('.cards'), start: 'top 82%', once: true },
        },
      )
      gsap.fromTo(
        q('.actions'),
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, scrollTrigger: { trigger: q('.actions'), start: 'top 92%', once: true } },
      )
    },
    { scope: root },
  )

  return (
    <StackSection id="blog" z={5} innerClassName="bg-paper text-navy">
      <div ref={root} className="relative flex flex-1 flex-col justify-center px-6 pb-28 pt-24 md:pb-36 md:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_circle_at_85%_20%,rgba(47,91,214,0.12),transparent_70%)]" />

        <div className="container-site relative">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <p className="eyebrow m-0 mb-5 text-[13px] uppercase tracking-[0.12em] text-slate">{t.blog.eyebrow}</p>
              <h2 className="title m-0 text-[clamp(36px,4.5vw,56px)] font-medium leading-[1.02] tracking-[-0.03em]">
                {t.blog.title} <span className="serif-italic">{t.blog.accent}</span>
              </h2>
            </div>
            <p className="lead m-0 max-w-[360px] text-base leading-[1.55] text-slate-2">{t.blog.lead}</p>
          </div>

          <div className="cards grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>

          <div className="actions mt-10 flex flex-wrap items-center gap-3">
            <a
              href={blogHref()}
              className="relative inline-flex items-center gap-3 rounded-full bg-navy py-3 pl-6 pr-2 text-[15px] font-semibold text-fog shadow-[0_8px_24px_rgba(11,18,32,0.18)] transition-[background-color,box-shadow] duration-300 hover:bg-blue hover:shadow-[0_12px_32px_rgba(47,91,214,0.35)]"
            >
              {t.blog.viewAll}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <CursorGlow />
            </a>
            <a
              href={company.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/60 px-5 py-3 text-[15px] font-medium text-navy transition-colors hover:bg-white"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                <circle cx="12" cy="12" r="4.3" />
                <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
              </svg>
              {t.blog.follow}
            </a>
          </div>
        </div>
      </div>
    </StackSection>
  )
}
