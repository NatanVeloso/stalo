import { useRef, type MouseEvent } from 'react'
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/gsap'
import { images } from '../data/content'
import { StackSection } from './StackSection'
import { CursorGlow } from './CursorGlow'
import { scrollToAnchor } from './Header'

type Props = { play: boolean }

export function Hero({ play }: Props) {
  const root = useRef<HTMLDivElement>(null)

  // intro — roda quando o preloader libera
  useGSAP(
    () => {
      if (!play || !root.current) return
      const q = gsap.utils.selector(root)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(q('[data-intro]'), { autoAlpha: 1 })
        return
      }

      const split = SplitText.create(q('.hero-title'), { type: 'lines,words', mask: 'lines', linesClass: 'split-line' })
      const tl = gsap.timeline({ onComplete: () => split.revert() })

      tl.set(q('[data-intro]'), { autoAlpha: 1 })
        .fromTo(q('.hero-bg'), { scale: 1.3 }, { scale: 1.08, duration: 2.4, ease: 'power3.out' }, 0)
        .from(q('.hero-badge'), { y: 20, autoAlpha: 0, duration: 0.8 }, 0.15)
        .from(split.words, { yPercent: 130, stagger: 0.06, duration: 1.3 }, 0.25)
        .from(q('.hero-card'), { y: 60, autoAlpha: 0, duration: 1.3 }, 0.7)
    },
    { dependencies: [play], scope: root },
  )

  // parallax de saída
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.to('.hero-bg', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToAnchor(href)
  }

  return (
    <StackSection id="top" z={1} rounded={false} innerClassName="bg-navy">
      <div ref={root} className="relative flex min-h-screen items-end overflow-hidden px-6 pb-[120px] pt-[140px]">
        <div
          className="hero-bg absolute inset-0 bg-[#1a2230] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${images.hero})` }}
        />
        {/* no mobile o texto sobe para cima do céu claro da foto, então o véu é mais forte */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.3)_0%,rgba(11,18,32,0.15)_40%,rgba(11,18,32,0.95)_92%,#0b1220_100%)] max-md:bg-[linear-gradient(180deg,rgba(11,18,32,0.55)_0%,rgba(11,18,32,0.55)_30%,rgba(11,18,32,0.97)_80%,#0b1220_100%)]" />

        <div
          data-intro
          className="container-site relative grid items-end gap-6 md:grid-cols-[1.2fr_minmax(0,460px)]"
        >
          <div>
            <div className="hero-badge glass mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px]">
              <span className="h-[7px] w-[7px] rounded-full bg-mint shadow-[0_0_12px_#7ee0b0]" />
              Consultoria contábil
            </div>
            <h1 className="hero-title m-0 text-balance text-[clamp(44px,7vw,92px)] font-medium leading-[0.98] tracking-[-0.035em]">
              Contabilidade clara para empresas que <span className="serif-italic">querem crescer.</span>
            </h1>
          </div>

          <div className="hero-card glass-strong w-full max-w-[460px] justify-self-end rounded-[28px] p-7">
            <p className="m-0 mb-6 text-pretty text-lg leading-[1.5] text-fog/90">
              Cuidamos da contabilidade, dos impostos e da folha da sua empresa, com atendimento próximo e relatórios
              que você entende.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="#contato"
                onClick={(e) => go(e, '#contato')}
                className="relative block whitespace-nowrap rounded-full bg-fog px-[22px] py-3.5 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
              >
                Solicitar proposta
                <CursorGlow />
              </a>
              <a
                href="#servicos"
                onClick={(e) => go(e, '#servicos')}
                className="relative block whitespace-nowrap rounded-full border border-white/25 bg-white/[0.12] px-[22px] py-3.5 text-[15px] font-medium transition-colors hover:bg-white/20"
              >
                Ver serviços
                <CursorGlow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </StackSection>
  )
}
