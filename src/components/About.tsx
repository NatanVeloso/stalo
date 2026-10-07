import { useRef } from 'react'
import { gsap, useGSAP, heavy } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { values, stats, images } from '../data/content'
import { t } from '../i18n'

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      // foto: abre de cima pra baixo e a imagem "assenta"
      gsap
        .timeline({ scrollTrigger: { trigger: q('.img-wrap'), start: 'top 80%', once: true } })
        .fromTo(
          q('.img-wrap'),
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' },
        )
        .from(q('.img'), { scale: 1.25, duration: 1.6, ease: 'power3.out' }, 0)

      gsap.from(q('.text-card'), {
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        scrollTrigger: { trigger: q('.text-card'), start: 'top 85%', once: true },
      })
      gsap.from([...q('.eyebrow'), ...q('.lead')], {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.text-card'), start: 'top 80%', once: true },
      })
      gsap.from(q('.value'), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.values'), start: 'top 88%', once: true },
      })

      // números: entram em stagger e contam de 0 até o valor
      gsap.from(q('.stat'), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        scrollTrigger: { trigger: q('.stats'), start: 'top 85%', once: true },
      })
      q('.stat-num').forEach((el) => {
        gsap.from(el, {
          textContent: 0,
          snap: { textContent: 1 },
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })

      heavy(() => {
        // linha de crescimento desenhada no scroll
        gsap.from(q('.growth'), {
          drawSVG: '0%',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 95%', scrub: 1 },
        })
        gsap.fromTo(
          q('.img'),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: q('.img-wrap'), start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    // tom um pouco mais escuro que o de "Serviços": é o que dá forma ao corte diagonal (SectionDivider)
    <section id="sobre" ref={root} className="relative flex flex-col justify-center bg-paper-2 px-6 pb-28 pt-16 md:pb-36 md:pt-20">
        <svg
          viewBox="0 0 1200 500"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 right-0 top-[12%] h-[70%] w-full"
        >
          <path
            className="growth"
            d="M0,460 L120,420 L220,440 L340,360 L460,380 L580,280 L700,300 L820,190 L940,210 L1060,90 L1200,40"
            stroke="#2f5bd6"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.28"
          />
          <path d="M0,480 L1200,480" stroke="#0b1220" strokeOpacity="0.08" />
        </svg>

        <div className="container-site relative grid items-stretch gap-6 md:grid-cols-2">
          <div className="img-wrap relative min-h-[420px] overflow-hidden rounded-4xl bg-[#2f2d2e] md:min-h-[520px]">
            <div
              className="img absolute -inset-[10%] bg-cover will-change-transform"
              style={{ backgroundImage: `url(${images.about})`, backgroundPosition: '20% center' }}
            />
          </div>

          <div className="text-card card-photo flex flex-col justify-between gap-8 rounded-4xl p-8 text-[#f4f0ea] md:p-10">
            <div>
              <p className="eyebrow m-0 mb-5 text-[13px] uppercase tracking-[0.12em] text-[#a8a08f]">{t.about.eyebrow}</p>
              <h2 className="title m-0 mb-5 text-[clamp(32px,3.6vw,46px)] font-medium leading-[1.05] tracking-[-0.03em]">
                {t.about.title} <span className="serif-italic">{t.about.accent}</span>
              </h2>
              <p className="lead m-0 text-pretty text-[17px] leading-[1.6] text-[#cfc8bd]">
                {t.about.lead}
              </p>
            </div>

            <div className="values grid gap-3 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="value rounded-[18px] border border-white/10 bg-white/[0.06] p-[18px]">
                  <div className="mb-1.5 text-base font-semibold">{v.title}</div>
                  <div className="text-sm leading-[1.45] text-[#b5ada0]">{v.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* números */}
        <div className="stats container-site relative mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="stat glass-light flex flex-col justify-between gap-6 rounded-4xl p-8 md:p-9">
              <div className="flex items-baseline gap-1 text-[clamp(44px,5vw,68px)] font-medium leading-none tracking-[-0.04em]">
                {s.prefix && <span className="serif-italic text-[0.8em] text-blue">{s.prefix}</span>}
                <span className="stat-num tabular-nums" data-value={s.value}>
                  {s.value}
                </span>
                {s.suffix && <span className="serif-italic text-[0.7em] text-blue">{s.suffix}</span>}
              </div>
              <div>
                <div className="text-base font-semibold">{s.label}</div>
                {s.sub && <div className="mt-1 text-sm leading-[1.45] text-slate">{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>
    </section>
  )
}
