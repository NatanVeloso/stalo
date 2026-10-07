import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, heavy } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { results, videos, type Testimonial } from '../data/content'
import { t } from '../i18n'
import { useDragScroll } from '../hooks/useDragScroll'
import { BackgroundVideo } from './BackgroundVideo'

function Stars() {
  return (
    <div className="stars mb-5 flex gap-1 text-[#f5a524]" aria-label={t.results.starsLabel}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </div>
  )
}

/** Foto do cliente ou, sem foto, as iniciais num círculo. */
function Avatar({ author, avatar }: Pick<Testimonial, 'author' | 'avatar'>) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
      />
    )
  }
  const initials = author
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-sm font-semibold text-fog ring-1 ring-white/20">
      {initials}
    </span>
  )
}

/**
 * "Resultados": carrossel de depoimentos sobre a foto (ou vídeo) do
 * escritório. A rolagem é nativa com scroll-snap (arrasta no toque, roda no
 * trackpad), com arraste pelo mouse (useDragScroll) e setas que rolam um card
 * por vez.
 */
export function Testimonials() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  useDragScroll(track, { snapTo: '.cell' })

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.from([...q('.lead'), ...q('.arrows')], {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.title'), start: 'top 80%', once: true },
      })
      // cartões sobem em cascata; os pseudo "vidro" só aparecem quando o carrossel entra
      gsap.from(q('.cell'), {
        y: 50,
        autoAlpha: 0,
        scale: 0.96,
        stagger: { each: 0.08, from: 'start' },
        duration: 1.1,
        scrollTrigger: { trigger: q('.carousel'), start: 'top 85%', once: true },
      })
      gsap.from(q('.stars svg'), {
        scale: 0,
        autoAlpha: 0,
        stagger: 0.03,
        ease: 'back.out(2.5)',
        duration: 0.6,
        delay: 0.4,
        scrollTrigger: { trigger: q('.carousel'), start: 'top 85%', once: true },
      })

      heavy(() => {
        // fundo com parallax leve
        gsap.fromTo(
          q('.bg'),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  // setas desligam nas pontas
  useEffect(() => {
    const el = track.current
    if (!el) return
    const update = () =>
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  const step = (dir: 1 | -1) => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('.cell')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' })
  }

  return (
    <div ref={root} id="resultados" className="relative overflow-hidden pb-24 pt-24 md:pb-32 md:pt-28">
      {/* fundo: foto do escritório já desfocada no arquivo (blur ao vivo era caro), escurecida para o texto ler bem */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="bg absolute -inset-[8%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${results.background})` }}
        >
          <BackgroundVideo src={videos.results} poster={results.background} />
        </div>
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,transparent_28%,transparent_72%,var(--color-ink)_100%)]" />
      </div>

      <div className="container-site relative mb-10 flex flex-wrap items-end justify-between gap-6 px-6 md:mb-12">
        <div className="max-w-[760px]">
          <h2 className="title m-0 mb-4 text-balance text-[clamp(36px,4.6vw,60px)] font-medium leading-[1.02] tracking-[-0.03em]">
            {results.title} <span className="serif-italic">{results.accent}</span>
          </h2>
          <p className="lead m-0 text-[17px] text-fog/80">{results.lead}</p>
        </div>
        <div className="arrows flex gap-2">
          <ArrowButton dir={-1} disabled={edges.start} label={t.results.prev} onClick={() => step(-1)} />
          <ArrowButton dir={1} disabled={edges.end} label={t.results.next} onClick={() => step(1)} />
        </div>
      </div>

      {/* sangra até as bordas da tela; o padding alinha o primeiro card com o container */}
      <div
        ref={track}
        className="carousel flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-[max(24px,calc((100%-1180px)/2))] pr-6 select-none [scroll-padding-left:max(24px,calc((100%-1180px)/2))] [scrollbar-width:none] data-dragging:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {results.testimonials.map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="cell glass m-0 flex w-[min(84vw,380px)] shrink-0 snap-start flex-col justify-between rounded-[22px] p-7 md:p-8"
          >
            <div>
              <Stars />
              <blockquote className="m-0 text-pretty text-[clamp(16px,1.2vw,18px)] leading-[1.5] text-fog">
                “{item.text}”
              </blockquote>
            </div>
            <figcaption className="mt-7 flex items-center gap-3">
              <Avatar author={item.author} avatar={item.avatar} />
              <div className="leading-tight">
                <div className="text-[15px] font-semibold">{item.author}</div>
                <div className="text-sm text-fog/70">{item.company}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

function ArrowButton({
  dir,
  disabled,
  label,
  onClick,
}: {
  dir: 1 | -1
  disabled: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/[0.16] bg-white/[0.08] text-fog transition-colors hover:bg-white/[0.16] disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white/[0.08]"
    >
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
        {dir === 1 ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
      </svg>
    </button>
  )
}
