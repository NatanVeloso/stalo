import type { ReactNode } from 'react'
import { homeHref, t } from '../i18n'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'

type Props = {
  /** Links extras antes do seletor de idioma (ex.: o outro texto legal). */
  children?: ReactNode
}

/**
 * Cabeçalho das páginas estáticas (blog, textos legais): pílula de vidro com
 * logo, links, idioma e "Voltar ao site". Sem GSAP nem estado de scroll.
 */
export function PageHeader({ children }: Props) {
  return (
    // fixo no topo: numa lista longa o "Voltar ao site" tem que estar sempre à mão
    <header className="sticky top-0 z-50 px-6 pb-2 pt-4">
      <div className="glass container-site flex items-center justify-between gap-4 rounded-full px-5 py-3">
        <a href={homeHref()} className="flex items-center text-fog" aria-label={t.common.home}>
          <Logo className="h-[26px] w-auto" />
        </a>
        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          {children}
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
  )
}
