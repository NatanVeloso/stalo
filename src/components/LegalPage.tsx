import { useEffect } from 'react'
import { company } from '../data/company'
import { t, legal, legalHref, homeHref } from '../i18n'
import type { LegalKey } from '../i18n/types'
import { hideBoot } from '../lib/boot'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CookieConsent, CookiePreferences } from './CookieConsent'

type Props = { docKey: LegalKey }

/**
 * Página estática de texto legal (Política de Privacidade / Termos de Uso).
 * Renderizada no lugar do App quando o caminho é o slug de um texto legal no
 * idioma atual (ex.: /privacidade, /en/terms). Sem GSAP nem ScrollSmoother:
 * é só leitura.
 */
export function LegalPage({ docKey }: Props) {
  const doc = legal[docKey]
  const otherKey: LegalKey = docKey === 'privacy' ? 'terms' : 'privacy'
  const other = legal[otherKey]

  useEffect(() => {
    const prev = document.title
    document.title = `${doc.title} — ${company.name}`
    window.scrollTo(0, 0)
    hideBoot()
    return () => {
      document.title = prev
    }
  }, [doc.title])

  return (
    <div className="min-h-screen bg-ink text-fog">
      <header className="px-6 pt-6">
        <div className="glass container-site flex items-center justify-between gap-4 rounded-full px-5 py-3">
          <a href={homeHref()} className="flex items-center text-fog" aria-label={t.common.home}>
            <Logo className="h-[26px] w-auto" />
          </a>
          <nav className="flex items-center gap-3 text-sm sm:gap-5">
            <a href={legalHref(otherKey)} className="hidden text-fog/75 transition-colors hover:text-sky md:block">
              {other.title}
            </a>
            <LanguageSwitcher variant="menu" />
            <a
              href={homeHref()}
              className="whitespace-nowrap rounded-full bg-fog px-4 py-2 font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
            >
              {t.legal.back}
            </a>
          </nav>
        </div>
      </header>

      <main className="px-6 pb-24 pt-16 md:pt-24">
        <article className="mx-auto max-w-[760px]">
          <p className="m-0 mb-4 text-[13px] uppercase tracking-[0.12em] text-fog/60">
            {t.legal.updated} {doc.updated}
          </p>
          <h1 className="m-0 mb-6 text-balance text-[clamp(36px,5vw,56px)] font-medium leading-[1.02] tracking-[-0.03em]">
            {doc.title}
          </h1>
          <p className="m-0 text-pretty text-[18px] leading-[1.6] text-fog/85">{doc.intro}</p>
          {doc.notice && (
            <p className="m-0 mt-5 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-4 text-[15px] leading-[1.55] text-fog/70">
              {doc.notice}
            </p>
          )}

          <div className="mt-12 flex flex-col gap-10">
            {doc.sections.map((s) => (
              <section key={s.title}>
                <h2 className="m-0 mb-3 text-[22px] font-medium tracking-[-0.02em]">{s.title}</h2>
                <div className="flex flex-col gap-3 text-[16px] leading-[1.65] text-fog/80">
                  {s.body.map((block, i) =>
                    Array.isArray(block) ? (
                      <ul key={i} className="m-0 flex list-disc flex-col gap-2 pl-5 marker:text-mint">
                        {block.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i} className="m-0 text-pretty">
                        {block}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.14] pt-6 text-sm text-fog/70">
            <span>
              © {new Date().getFullYear()} {company.name}. {t.common.rights}
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={legalHref(otherKey)} className="underline underline-offset-[3px] transition-colors hover:text-sky">
                {other.title}
              </a>
              <CookiePreferences className="underline underline-offset-[3px] transition-colors hover:text-sky" />
            </div>
          </div>
        </article>
      </main>
      <CookieConsent />
    </div>
  )
}
