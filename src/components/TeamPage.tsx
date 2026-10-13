import { useEffect, useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { hideBoot } from '../lib/boot'
import { company } from '../data/company'
import { contact, team } from '../data/content'
import { sobreHref, t } from '../i18n'
import { CookieConsent } from './CookieConsent'
import { CursorGlow } from './CursorGlow'
import { Logo } from './Logo'
import { PageFooter } from './PageFooter'
import { Header } from './Header'

const curriculo = `mailto:${company.email}?subject=${encodeURIComponent(t.team.joinSubject)}`

/**
 * /equipe (12/10/2026). Página estática como "Sobre nós": rolagem nativa,
 * revelações atrás de MOTION_OK.
 *
 * ⚠ Ainda sem nomes nem fotos (`teamPeople` em data/content.ts está vazio):
 * cada card mostra a FUNÇÃO como título e a marca da Stalo no lugar do
 * retrato. Quando os dados chegarem, o card troca sozinho para nome + função.
 */
export function TeamPage() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.title
    document.title = `${t.team.pageTitle} | ${company.name}`
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
        gsap.from(q('.hero-lead'), { y: 24, autoAlpha: 0, duration: 1, delay: 0.35 })
        // a foto larga "assenta": abre de baixo para cima e a imagem desce de leve
        gsap
          .timeline({ delay: 0.2 })
          .fromTo(
            q('.hero-frame'),
            { clipPath: 'inset(100% 0% 0% 0% round 32px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4, ease: 'power4.inOut' },
          )
          .from(q('.hero-img'), { scale: 1.15, duration: 1.8, ease: 'power3.out' }, 0)

        gsap.from(q('.como-item'), {
          y: 28,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: q('.como'), start: 'top 82%', once: true },
        })
        gsap.from(q('.pessoa'), {
          y: 48,
          autoAlpha: 0,
          stagger: { each: 0.08, grid: 'auto', from: 'start' },
          duration: 1.1,
          scrollTrigger: { trigger: q('.pessoas'), start: 'top 85%', once: true },
        })
        q('[data-fade]').forEach((el) => {
          gsap.from(el, { y: 32, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        })
      })
    },
    { scope: root },
  )

  return (
    <div className="min-h-screen bg-ink text-fog">
      <Header show />

      <main ref={root} className="overflow-x-clip">
        {/* ── abertura: título largo, foto panorâmica embaixo ──────────── */}
        <section className="px-6 pb-20 pt-28 md:pb-28 md:pt-36">
          <div className="container-site">
            <div className="mb-10 grid items-end gap-6 md:mb-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              <h1 className="title m-0 text-balance text-[clamp(40px,5.6vw,76px)] font-medium leading-[1.02] tracking-[-0.035em]">
                {t.team.title} <span className="serif-italic">{t.team.accent}</span>
              </h1>
              <p className="hero-lead m-0 max-w-[44ch] text-pretty pb-2 text-[18px] leading-[1.6] text-fog/80">{t.team.lead}</p>
            </div>
            <div className="hero-frame relative aspect-[16/9] overflow-hidden rounded-[32px] bg-navy md:aspect-[21/9]">
              <img
                src="/clientes/escritorio-blur.webp"
                alt=""
                className="hero-img absolute inset-0 h-full w-full object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(7,9,12,0.6)_100%)]" />
            </div>
          </div>
        </section>

        {/* ── como trabalhamos: declaração à esquerda, três pontos à direita ── */}
        <section className="px-6 pb-24 md:pb-32">
          <div className="como container-site grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <h2 className="title m-0 text-balance text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">
              {t.team.howTitle} <span className="serif-italic">{t.team.howAccent}</span>
            </h2>
            <ol className="m-0 flex list-none flex-col p-0">
              {t.team.how.map((p, i) => (
                <li
                  key={p.title}
                  className={`como-item grid grid-cols-[2.5rem_1fr] gap-x-4 py-6 ${i ? 'border-t border-white/10' : 'pt-0'}`}
                >
                  <span className="serif-italic pt-0.5 text-[22px] leading-none text-mint">{i + 1}</span>
                  <div>
                    <h3 className="m-0 mb-1.5 text-[19px] font-medium tracking-[-0.01em]">{p.title}</h3>
                    <p className="m-0 max-w-[52ch] text-pretty text-[16px] leading-[1.6] text-fog/70">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── quem cuida de cada frente ────────────────────────────────── */}
        <section className="bg-navy px-6 py-24 md:py-32">
          <div className="container-site">
            <h2 className="title m-0 mb-12 max-w-[760px] text-balance text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.05] tracking-[-0.03em]">
              {t.team.areasTitle} <span className="serif-italic">{t.team.areasAccent}</span>
            </h2>
            <ul className="pessoas m-0 grid list-none gap-x-5 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((p) => (
                <li key={p.role} className="pessoa group">
                  {/* sem foto, o retrato vazio fica mais baixo no celular: seis caixas 4:5 empilhadas viram rolagem sem conteúdo */}
                  <div
                    className={`relative mb-5 overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#13213a_0%,#0b1220_55%,#0d2622_100%)] ring-1 ring-white/10 ${
                      p.photo ? 'aspect-[4/5]' : 'aspect-[16/9] sm:aspect-[4/5]'
                    }`}
                  >
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt={p.name ?? p.role}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      // sem foto ainda: a marca, grande e discreta, no lugar do retrato
                      <div className="absolute inset-0 flex items-center justify-center text-fog/[0.18]" aria-label={t.team.noPhoto} role="img">
                        <Logo markOnly className="h-24 w-auto transition-transform duration-700 group-hover:rotate-[30deg]" />
                      </div>
                    )}
                  </div>
                  <p className="m-0 mb-1 text-[13px] font-medium text-mint">{p.area}</p>
                  <h3 className="m-0 mb-2 text-[22px] font-medium tracking-[-0.015em]">{p.name || p.role}</h3>
                  {p.name && <p className="m-0 mb-2 text-[15px] text-fog/70">{p.role}</p>}
                  <p className="m-0 max-w-[40ch] text-pretty text-[15px] leading-[1.55] text-fog/65">{p.text}</p>
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[14px] font-semibold text-sky transition-colors hover:text-white"
                    >
                      LinkedIn
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── faça parte + próximos passos ─────────────────────────────── */}
        <section className="px-6 py-24 md:py-28">
          <div className="container-site grid items-center gap-10 border-b border-white/10 pb-20 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div data-fade>
              <h2 className="m-0 mb-4 text-[clamp(30px,3.4vw,46px)] font-medium leading-[1.05] tracking-[-0.03em]">
                {t.team.joinTitle}
              </h2>
              <p className="m-0 max-w-[48ch] text-pretty text-[17px] leading-[1.6] text-fog/75">{t.team.joinText}</p>
            </div>
            <div data-fade className="flex flex-wrap gap-3 md:justify-end">
              <a
                href={curriculo}
                className="relative rounded-full bg-fog px-6 py-3.5 text-[15px] font-semibold text-[#0a0a0a] transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.98]"
              >
                {t.team.joinCta}
                <CursorGlow />
              </a>
              <a
                href={sobreHref()}
                className="relative rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-[15px] font-medium transition-colors duration-300 hover:bg-white/[0.12] active:scale-[0.98]"
              >
                {t.team.aboutCta}
                <CursorGlow />
              </a>
            </div>
          </div>

          <div data-fade className="container-site flex flex-wrap items-center justify-between gap-6 pt-12">
            <p className="m-0 max-w-[40ch] text-balance text-[clamp(22px,2.2vw,28px)] font-medium leading-[1.25] tracking-[-0.015em]">
              {t.aboutPage.ctaTitle}
            </p>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] py-3 pl-6 pr-2 text-[15px] font-semibold transition-colors duration-300 hover:bg-white/[0.12] active:scale-[0.98]"
            >
              {t.common.talkToConsultant}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <CursorGlow />
            </a>
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
