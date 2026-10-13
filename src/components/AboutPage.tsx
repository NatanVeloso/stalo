import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { hideBoot } from '../lib/boot'
import { company } from '../data/company'
import { contact, images, stats, videos } from '../data/content'
import { equipeHref, t } from '../i18n'
import { BackgroundVideo } from './BackgroundVideo'
import { CookieConsent } from './CookieConsent'
import { CursorGlow } from './CursorGlow'
import { PageFooter } from './PageFooter'
import { Header } from './Header'

/** Anos completos desde a fundação (data do CNPJ), calculados no dia da visita. */
function anosDesde(iso: string): number {
  const [a, m, d] = iso.split('-').map(Number)
  const hoje = new Date()
  let anos = hoje.getFullYear() - a
  if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos--
  return anos
}

const anoFundacao = company.founded.slice(0, 4)
const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address}, ${company.city}`)}`

/**
 * /sobre: "Sobre nós" (12/10/2026). Página estática como o blog e os textos
 * legais: sem ScrollSmoother nem cartões empilhados, rolagem nativa. As
 * revelações de scroll ficam atrás de MOTION_OK; com "reduzir movimento" a
 * página aparece pronta.
 *
 * Seções, cada uma com um desenho diferente: abertura (texto + vídeo da
 * marca), fundação e números, história (foto + texto), missão e visão (duas
 * declarações), valores (bento) e onde estamos + conversa.
 */
export function AboutPage() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.title
    document.title = `${t.aboutPage.pageTitle} | ${company.name}`
    window.scrollTo(0, 0)
    hideBoot()
    return () => {
      document.title = prev
    }
  }, [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.matchMedia().add(MOTION_OK, () => {
        q('.title').forEach((el) => revealLines(el))

        // abertura: o texto sobe e o quadro do vídeo abre de baixo para cima
        gsap
          .timeline({ delay: 0.15 })
          .from(q('.hero-copy > *:not(.title)'), { y: 24, autoAlpha: 0, stagger: 0.1, duration: 1 }, 0.25)
          .fromTo(
            q('.hero-frame'),
            { clipPath: 'inset(100% 0% 0% 0% round 32px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4, ease: 'power4.inOut' },
            0,
          )

        // o ano de fundação sobe de dentro da máscara
        gsap.from(q('.ano'), {
          yPercent: 100,
          duration: 1.3,
          scrollTrigger: { trigger: q('.fundacao'), start: 'top 80%', once: true },
        })

        q('[data-fade]').forEach((el) => {
          gsap.from(el, { y: 32, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        })
        gsap.from(q('.valor'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1.1,
          scrollTrigger: { trigger: q('.valores'), start: 'top 82%', once: true },
        })
        q('.stat-num').forEach((el) => {
          gsap.from(el, {
            textContent: 0,
            snap: { textContent: 1 },
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
      })
    },
    { scope: root },
  )

  const [v1, v2, ...demais] = t.aboutPage.values

  return (
    <div className="min-h-screen bg-ink text-fog">
      <Header show />

      <main ref={root} className="overflow-x-clip">
        {/* ── abertura ─────────────────────────────────────────────────── */}
        <section className="px-6 pb-20 pt-28 md:pb-28 md:pt-36">
          <div className="container-site grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
            <div className="hero-copy">
              <h1 className="title m-0 mb-6 text-balance text-[clamp(40px,5.6vw,72px)] font-medium leading-[1.02] tracking-[-0.035em]">
                {t.aboutPage.title} <span className="serif-italic">{t.aboutPage.accent}</span>
              </h1>
              <p className="m-0 mb-9 max-w-[52ch] text-pretty text-[18px] leading-[1.6] text-fog/80">{t.aboutPage.lead}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={equipeHref()}
                  className="relative rounded-full bg-fog px-6 py-3.5 text-[15px] font-semibold text-[#0a0a0a] transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.98]"
                >
                  {t.aboutPage.primaryCta}
                  <CursorGlow />
                </a>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-[15px] font-medium transition-colors duration-300 hover:bg-white/[0.12] active:scale-[0.98]"
                >
                  {t.common.talkToConsultant}
                  <CursorGlow />
                </a>
              </div>
            </div>

            {/* o mesmo vídeo da marca da home, num quadro: o poster cobre a espera e o modo leve */}
            <div className="hero-frame relative aspect-[4/3] overflow-hidden rounded-[32px] bg-navy shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:aspect-[4/5]">
              <img src={images.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <BackgroundVideo src={videos.hero} liteSrc={videos.heroLite} poster={images.hero} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,9,12,0.55)_100%)]" />
            </div>
          </div>
        </section>

        {/* ── fundação e números ──────────────────────────────────────── */}
        <section className="fundacao px-6 pb-24 md:pb-32">
          <div className="container-site grid items-end gap-10 border-t border-white/10 pt-14 lg:grid-cols-[auto_1fr] lg:gap-20">
            <div className="overflow-hidden">
              <span className="ano block text-[clamp(110px,17vw,230px)] font-medium leading-[0.85] tracking-[-0.06em] text-fog">
                {anoFundacao}
              </span>
            </div>
            <div data-fade className="pb-2">
              <p className="m-0 text-[clamp(20px,2vw,26px)] font-medium leading-[1.3] tracking-[-0.01em]">
                {t.aboutPage.founded}
              </p>
              <p className="m-0 mt-2 text-[17px] leading-[1.5] text-fog/65">
                {t.aboutPage.years.replace('{anos}', String(anosDesde(company.founded)))}
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10">
                {stats.map((s, i) => (
                  <div key={s.label} className={i ? 'sm:pl-8' : 'sm:pr-8'}>
                    <div className="flex items-baseline gap-1 text-[clamp(40px,4.2vw,56px)] font-medium leading-none tracking-[-0.04em]">
                      {s.prefix && <span className="serif-italic text-[0.8em] text-mint">{s.prefix}</span>}
                      <span className="stat-num tabular-nums">{s.value}</span>
                      {s.suffix && <span className="serif-italic text-[0.7em] text-mint">{s.suffix}</span>}
                    </div>
                    <div className="mt-3 text-[15px] leading-[1.4] text-fog/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── história ─────────────────────────────────────────────────── */}
        <section className="px-6 pb-24 md:pb-32">
          <div className="container-site grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div data-fade className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#2f2d2e]">
              <img
                src={images.about}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[20%_center]"
              />
            </div>
            <div>
              <h2 className="title m-0 mb-8 text-balance text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">
                {t.aboutPage.storyTitle} <span className="serif-italic">{t.aboutPage.storyAccent}</span>
              </h2>
              <div className="flex max-w-[60ch] flex-col gap-5">
                {t.aboutPage.story.map((p) => (
                  <p key={p} data-fade className="m-0 text-pretty text-[17px] leading-[1.7] text-fog/75">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── missão e visão: duas declarações, sem caixa ──────────────── */}
        <section className="bg-navy px-6 py-24 md:py-32">
          <div className="container-site grid gap-14 md:grid-cols-2 md:gap-0 md:divide-x md:divide-white/10">
            {[
              { label: t.aboutPage.missionLabel, texto: t.aboutPage.mission },
              { label: t.aboutPage.visionLabel, texto: t.aboutPage.vision },
            ].map((d, i) => (
              <div key={d.label} data-fade className={i ? 'md:pl-14' : 'md:pr-14'}>
                <h2 className="serif-italic m-0 mb-5 text-[clamp(26px,2.4vw,32px)] leading-[1.1] text-mint">{d.label}</h2>
                <p className="m-0 text-pretty text-[clamp(22px,2.3vw,30px)] font-medium leading-[1.3] tracking-[-0.015em]">
                  {d.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── valores: bento de 5 (2 largos em cima, 3 embaixo) ────────── */}
        <section className="px-6 py-24 md:py-32">
          <div className="container-site">
            <h2 className="title m-0 mb-12 max-w-[720px] text-balance text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">
              {t.aboutPage.valuesTitle} <span className="serif-italic">{t.aboutPage.valuesAccent}</span>
            </h2>
            <div className="valores grid gap-4 md:grid-cols-6">
              {/* largo, sobre a foto do escritório */}
              <div className="valor relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl p-8 md:col-span-3 md:min-h-[340px]">
                <img
                  src="/clientes/escritorio-blur.webp"
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,9,12,0.15)_0%,rgba(7,9,12,0.85)_100%)]" />
                <Valor {...v1} grande />
              </div>
              {/* largo, no degradê da marca */}
              <div className="valor flex min-h-[280px] flex-col justify-end rounded-3xl bg-[linear-gradient(140deg,#0d2622_0%,#0b1220_70%)] p-8 ring-1 ring-white/10 md:col-span-3 md:min-h-[340px]">
                <Valor {...v2} grande />
              </div>
              {demais.map((v) => (
                <div key={v.title} className="valor glass flex min-h-[220px] flex-col justify-end rounded-3xl p-7 md:col-span-2">
                  <Valor {...v} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── onde estamos + conversa ──────────────────────────────────── */}
        <section className="px-6 pb-20">
          <div className="container-site grid gap-4 md:grid-cols-[1fr_1.2fr]">
            <div data-fade className="flex flex-col justify-between gap-10 rounded-3xl border border-white/10 p-8 md:p-10">
              <div>
                <h2 className="m-0 mb-4 text-[22px] font-medium tracking-[-0.01em]">{t.aboutPage.placeTitle}</h2>
                <address className="text-[16px] not-italic leading-[1.6] text-fog/75">
                  {company.address}
                  <br />
                  {company.city}
                </address>
              </div>
              <a
                href={mapa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-sky transition-colors hover:text-white"
              >
                {t.aboutPage.placeMap}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>

            <div
              data-fade
              className="relative overflow-hidden rounded-3xl bg-[radial-gradient(120%_120%_at_100%_0%,rgba(47,91,214,0.35),transparent_60%),linear-gradient(160deg,#0b1220,#07090c)] p-8 ring-1 ring-white/10 md:p-12"
            >
              <h2 className="m-0 mb-4 max-w-[18ch] text-balance text-[clamp(28px,3vw,40px)] font-medium leading-[1.08] tracking-[-0.03em]">
                {t.aboutPage.ctaTitle}
              </h2>
              <p className="m-0 mb-8 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-fog/75">{t.aboutPage.ctaText}</p>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 rounded-full bg-fog py-3 pl-6 pr-2 text-[15px] font-semibold text-[#0a0a0a] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.98]"
              >
                {t.common.talkToConsultant}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <CursorGlow />
              </a>
            </div>
          </div>
        </section>

        <div className="px-6 pb-12">
          <div className="container-site">
            <PageFooter />
          </div>
        </div>
      </main>
      <CookieConsent />
    </div>
  )
}

function Valor({ title, text, grande = false }: { title: string; text: string; grande?: boolean }) {
  return (
    <>
      <h3 className={`m-0 mb-2.5 font-medium tracking-[-0.02em] ${grande ? 'text-[clamp(26px,2.6vw,34px)]' : 'text-[22px]'}`}>
        {title}
      </h3>
      <p className={`m-0 max-w-[44ch] text-pretty leading-[1.55] text-fog/75 ${grande ? 'text-[17px]' : 'text-[15px]'}`}>{text}</p>
    </>
  )
}
