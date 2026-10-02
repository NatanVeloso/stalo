import { useRef } from 'react'
import { gsap, useGSAP, heavy } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { services, servicesCta, marquee } from '../data/content'
import { StackSection } from './StackSection'
import { Marquee } from './Marquee'
import { CursorGlow } from './CursorGlow'

export function Services() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.from(q('.lead'), {
        y: 24,
        autoAlpha: 0,
        scrollTrigger: { trigger: q('.lead'), start: 'top 88%', once: true },
      })
      gsap.from(q('.card'), {
        y: 80,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        scrollTrigger: { trigger: q('.cards'), start: 'top 82%', once: true },
      })

      heavy(() => {
        const scrub = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
        gsap.to(q('.blob-a'), { y: 260, ease: 'none', scrollTrigger: scrub })
        gsap.to(q('.blob-b'), { y: -220, ease: 'none', scrollTrigger: scrub })
        gsap.to(q('.rings'), { rotation: 140, ease: 'none', scrollTrigger: scrub })
      })
    },
    { scope: root },
  )

  return (
    <StackSection id="servicos" z={2} innerClassName="bg-paper text-navy">
      <div ref={root} className="relative flex-1 pb-28 md:pb-36">
        <Marquee items={marquee} tone="light" />

        <div className="blob-a pointer-events-none absolute -left-[120px] top-[80px] h-[520px] w-[520px] rounded-full bg-blue opacity-[0.18] blur-[140px]" />
        <div className="blob-b pointer-events-none absolute -right-[160px] bottom-[80px] h-[560px] w-[560px] rounded-full bg-teal opacity-[0.16] blur-[160px]" />
        <svg
          viewBox="0 0 800 800"
          fill="none"
          className="rings pointer-events-none absolute -right-[260px] -top-[180px] h-[820px] w-[820px]"
        >
          <circle cx="400" cy="400" r="390" stroke="rgba(11,18,32,0.12)" strokeWidth="1" />
          <circle cx="400" cy="400" r="320" stroke="rgba(11,18,32,0.1)" strokeWidth="1" strokeDasharray="2 10" />
          <circle cx="400" cy="400" r="250" stroke="rgba(11,18,32,0.09)" strokeWidth="1" />
          <circle cx="400" cy="400" r="180" stroke="rgba(11,18,32,0.07)" strokeWidth="1" strokeDasharray="40 16" />
          <circle cx="400" cy="10" r="5" fill="#2f5bd6" />
          <circle cx="650" cy="400" r="4" fill="#1f8f78" />
        </svg>

        <div className="container-site relative px-6 pt-20">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="title m-0 max-w-[640px] text-[clamp(36px,4.5vw,56px)] font-medium leading-[1.02] tracking-[-0.03em]">
              Tudo o que sua empresa precisa, <span className="serif-italic">num só lugar.</span>
            </h2>
            <p className="lead m-0 max-w-[360px] text-base leading-[1.55] text-slate-2">
              Do registro do CNPJ ao fechamento do balanço, com uma equipe dedicada ao seu negócio.
            </p>
          </div>

          <div className="cards grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.n} {...s} />
            ))}
          </div>
        </div>
      </div>
    </StackSection>
  )
}

function ServiceCard({ n, title, text }: (typeof services)[number]) {
  const ref = useRef<HTMLDivElement>(null)

  // tilt 3D + holofote que segue o cursor
  useGSAP(
    () => {
      const el = ref.current
      if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

      gsap.set(el, { transformPerspective: 900 })
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
        ry((px - 0.5) * 8)
        rx((0.5 - py) * 8)
      }
      const leave = () => {
        rx(0)
        ry(0)
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      return () => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      className="card spotlight group flex min-h-[300px] flex-col gap-7 rounded-3xl border border-navy/[0.08] bg-white/70 p-7 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_rgba(11,18,32,0.05)] transition-[background-color,box-shadow] duration-300 [--spot:rgba(47,91,214,0.12)] hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_24px_60px_rgba(11,18,32,0.1)]"
    >
      <span className="text-[13px] tabular-nums text-slate">{n}</span>
      <div>
        <h3 className="m-0 mb-2.5 text-[22px] font-medium leading-[1.15] tracking-[-0.01em]">{title}</h3>
        <p className="m-0 text-pretty text-[15px] leading-[1.55] text-slate-2">{text}</p>
      </div>
      <a
        href={servicesCta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-auto flex w-full items-center justify-between gap-3 rounded-full bg-navy py-2 pl-5 pr-2 text-[15px] font-semibold text-fog shadow-[0_8px_24px_rgba(11,18,32,0.18)] transition-[background-color,box-shadow] duration-300 hover:bg-blue hover:shadow-[0_12px_32px_rgba(47,91,214,0.35)]"
      >
        {servicesCta.label}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-white/25">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <CursorGlow />
      </a>
    </div>
  )
}
