import { useRef, type CSSProperties } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { steps, servicesCta } from '../data/content'
import { StackSection } from './StackSection'
import { Logo } from './Logo'
import { CursorGlow } from './CursorGlow'

/**
 * "Como funciona": no desktop a área é pinada e cada passo entra pela direita
 * por cima do anterior. O passo coberto não some — sobra a faixa vertical da
 * esquerda com o nome dele, e as faixas vão acumulando (01, 01+02). No mobile
 * (ou com reduced-motion) os passos ficam empilhados na vertical.
 */
export function Process() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrap = root.current
      if (!wrap) return
      const panels = gsap.utils.toArray<HTMLElement>('.panel', wrap)

      gsap.matchMedia().add({ desktop: '(min-width: 1024px)', motion: MOTION_OK }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean }

        if (!desktop || !motion) {
          // empilhado: cada painel revela o próprio conteúdo ao entrar
          panels.forEach((panel) => {
            gsap.from(panel.querySelectorAll('.panel-copy > *'), {
              y: 30,
              autoAlpha: 0,
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: 'top 75%', once: true },
            })
          })
          return
        }

        wrap.dataset.mode = 'horizontal'

        // primeiro painel revela quando a section chega
        gsap.from(panels[0].querySelectorAll('.panel-copy > *'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: wrap, start: 'top 60%', once: true },
        })

        const segments = panels.length - 1
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => '+=' + segments * window.innerHeight * 1.1,
            pin: true,
            pinSpacing: true, // o pai é flex e o ScrollTrigger desligaria o spacing sozinho
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          const t = i - 1 // cada segmento dura 1; os 0.2 iniciais são pausa para ler
          const prev = panels[i - 1]
          tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, ease: 'power1.inOut', duration: 0.8 }, t + 0.2)
            .fromTo(panel.querySelector('.panel-img'), { scale: 1.2 }, { scale: 1, ease: 'none', duration: 0.8 }, t + 0.2)
            .fromTo(
              panel.querySelector('.panel-copy'),
              { x: 60, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, ease: 'none', duration: 0.5 },
              t + 0.5,
            )
            // o anterior desliza um pouco e escurece enquanto é coberto (a faixa fica)
            .to(prev.querySelector('.panel-main'), { x: -160, autoAlpha: 0.25, ease: 'none', duration: 0.8 }, t + 0.2)
        })

        return () => {
          delete wrap.dataset.mode
        }
      })
    },
    { scope: root },
  )

  return (
    <StackSection id="processo" z={4} innerClassName="bg-navy">
      {/* sem flex-1: o GSAP copia as props flex pro pin-spacer e o espaço do scroll horizontal some */}
      <div ref={root} className="steps relative">
        {steps.map((s, i) => {
          const dark = s.tone === 'dark'
          return (
            <article
              key={s.n}
              className={`panel ${s.bg} ${dark ? 'text-fog' : 'text-navy'}`}
              style={{ '--i': i } as CSSProperties}
            >
              <div className="flex h-full">
                {/* faixa vertical que sobra quando o painel é coberto */}
                <div
                  className={`panel-strip ${s.bg} hidden w-16 shrink-0 items-start justify-center border-r pt-28 ${
                    dark ? 'border-white/10' : 'border-navy/10'
                  }`}
                >
                  <span className="whitespace-nowrap text-[14px] font-medium [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                    <span className={`me-3 font-mono ${dark ? 'text-fog/50' : 'text-navy/50'}`}>{s.n}</span>
                    {s.name}
                  </span>
                </div>

                {/* pt alto: o header fixo ocupa os ~80px de cima */}
                <div className="panel-main flex min-w-0 flex-1 flex-col px-6 pb-10 pt-24 lg:px-[clamp(32px,5vw,80px)] lg:pb-8 lg:pt-28">
                  <div className={`flex items-center justify-between gap-6 text-[15px] ${dark ? 'text-fog/90' : 'text-navy/90'}`}>
                    <span>
                      <span className={`mr-3 font-mono ${dark ? 'text-fog/50' : 'text-navy/50'}`}>{s.n}</span>
                      {s.name}
                    </span>
                    <span className={`hidden whitespace-nowrap sm:inline ${dark ? 'text-fog/50' : 'text-navy/50'}`}>
                      Como funciona · {s.n}/{String(steps.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-16">
                    <div className="panel-copy max-w-[560px]">
                      <div
                        className={`mb-6 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] ${
                          dark ? 'text-fog/80' : 'text-navy/70'
                        }`}
                      >
                        <Logo markOnly className="h-3.5 w-auto" />
                        {s.eyebrow}
                      </div>
                      <h3 className="m-0 mb-5 text-balance text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.06] tracking-[-0.03em]">
                        {s.title} <span className="serif-italic">{s.accent}</span>
                      </h3>
                      <p className={`m-0 mb-8 text-pretty text-[17px] leading-[1.6] ${dark ? 'text-fog/75' : 'text-slate-2'}`}>
                        {s.text}
                      </p>
                      <a
                        href={servicesCta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-2 text-[15px] font-semibold transition-[background-color,box-shadow] duration-300 ${
                          dark
                            ? 'bg-fog text-[#0a0a0a] shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-white'
                            : 'bg-navy text-fog shadow-[0_8px_24px_rgba(11,18,32,0.18)] hover:bg-blue'
                        }`}
                      >
                        {servicesCta.label}
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${dark ? 'bg-navy/10' : 'bg-white/15'}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                        <CursorGlow />
                      </a>
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#1a2230] lg:aspect-auto lg:h-[min(62vh,580px)]">
                      <img
                        src={s.image}
                        alt=""
                        loading="lazy"
                        className="panel-img absolute inset-0 h-full w-full object-cover will-change-transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </StackSection>
  )
}
