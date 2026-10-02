import { useEffect } from 'react'
import { legalDocs, type LegalSlug } from '../data/legal'
import { Logo } from './Logo'

type Props = { slug: LegalSlug }

/**
 * Página estática de texto legal (Política de Privacidade / Termos de Uso).
 * Renderizada no lugar do App quando o caminho é /privacidade ou /termos.
 * Sem GSAP nem ScrollSmoother: é só leitura.
 */
export function LegalPage({ slug }: Props) {
  const doc = legalDocs[slug]
  const other = slug === 'privacidade' ? legalDocs.termos : legalDocs.privacidade

  useEffect(() => {
    const prev = document.title
    document.title = `${doc.title} — Stalo Consulting`
    window.scrollTo(0, 0)
    return () => {
      document.title = prev
    }
  }, [doc.title])

  return (
    <div className="min-h-screen bg-ink text-fog">
      <header className="px-6 pt-6">
        <div className="glass container-site flex items-center justify-between rounded-full px-5 py-3">
          <a href="/" className="flex items-center text-fog" aria-label="Início">
            <Logo className="h-[26px] w-auto" />
          </a>
          <nav className="flex items-center gap-5 text-sm">
            <a href={`/${other.slug}`} className="hidden text-fog/75 transition-colors hover:text-sky sm:block">
              {other.title}
            </a>
            <a
              href="/"
              className="rounded-full bg-fog px-4 py-2 font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
            >
              Voltar ao site
            </a>
          </nav>
        </div>
      </header>

      <main className="px-6 pb-24 pt-16 md:pt-24">
        <article className="mx-auto max-w-[760px]">
          <p className="m-0 mb-4 text-[13px] uppercase tracking-[0.12em] text-fog/60">
            Última atualização: {doc.updated}
          </p>
          <h1 className="m-0 mb-6 text-balance text-[clamp(36px,5vw,56px)] font-medium leading-[1.02] tracking-[-0.03em]">
            {doc.title}
          </h1>
          <p className="m-0 text-pretty text-[18px] leading-[1.6] text-fog/85">{doc.intro}</p>

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
            <span>© {new Date().getFullYear()} Stalo Consulting. Todos os direitos reservados.</span>
            <a href={`/${other.slug}`} className="underline underline-offset-[3px] transition-colors hover:text-sky">
              {other.title}
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}
