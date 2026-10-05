import { useRef } from 'react'
import { gsap, useGSAP, heavy } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { results } from '../data/content'
import { t } from '../i18n'

function Stars() {
  return (
    <div className="stars mb-5 flex gap-1 text-[#f5a524]" aria-label={t.results.starsLabel}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * "Resultados": bento de logos de clientes e depoimentos sobre a foto do
 * escritório. Substitui o antigo bloco de contato; o formulário saiu e o
 * contato segue no rodapé.
 */
export function Testimonials() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.from(q('.lead'), {
        y: 20,
        autoAlpha: 0,
        scrollTrigger: { trigger: q('.title'), start: 'top 80%', once: true },
      })
      // cartões sobem em cascata; os pseudo "vidro" só aparecem quando o grid entra
      gsap.from(q('.cell'), {
        y: 50,
        autoAlpha: 0,
        scale: 0.96,
        stagger: { each: 0.09, from: 'start' },
        duration: 1.1,
        scrollTrigger: { trigger: q('.grid-bento'), start: 'top 82%', once: true },
      })
      gsap.from(q('.stars svg'), {
        scale: 0,
        autoAlpha: 0,
        stagger: 0.06,
        ease: 'back.out(2.5)',
        duration: 0.6,
        delay: 0.4,
        scrollTrigger: { trigger: q('.grid-bento'), start: 'top 82%', once: true },
      })

      heavy(() => {
        // foto de fundo com parallax leve
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

  return (
    <div ref={root} id="resultados" className="relative overflow-hidden px-6 pb-24 pt-24 md:pb-32 md:pt-28">
      {/* fundo: foto do escritório já desfocada no arquivo (blur ao vivo era caro), escurecida para o texto ler bem */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="bg absolute -inset-[8%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${results.background})` }}
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink)_0%,transparent_28%,transparent_72%,var(--color-ink)_100%)]" />
      </div>

      <div className="container-site relative">
        <div className="mx-auto mb-12 max-w-[760px] text-center md:mb-16">
          <h2 className="title m-0 mb-4 text-balance text-[clamp(36px,4.6vw,60px)] font-medium leading-[1.02] tracking-[-0.03em]">
            {results.title} <span className="serif-italic">{results.accent}</span>
          </h2>
          <p className="lead m-0 text-[17px] text-fog/80">{results.lead}</p>
        </div>

        <div className="grid-bento grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {results.items.map((item) =>
            item.kind === 'logo' ? (
              <div
                key={item.name}
                className="cell glass flex min-h-[200px] items-center justify-center rounded-[22px] p-8 transition-colors duration-300 hover:bg-white/[0.12] lg:min-h-[250px]"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[84px] w-auto max-w-[150px] object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ) : (
              <figure
                key={item.author}
                className={`cell glass m-0 flex flex-col justify-between rounded-[22px] p-7 md:p-8 ${
                  item.span === 2 ? 'sm:col-span-2' : ''
                }`}
              >
                <div>
                  <Stars />
                  <blockquote className="m-0 text-pretty text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-fog">
                    “{item.text}”
                  </blockquote>
                </div>
                <figcaption className="mt-7 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div className="leading-tight">
                    <div className="text-[15px] font-semibold">{item.author}</div>
                    <div className="text-sm text-fog/70">{item.company}</div>
                  </div>
                </figcaption>
              </figure>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
