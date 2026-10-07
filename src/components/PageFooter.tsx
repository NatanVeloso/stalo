import { company } from '../data/company'
import { homeHref, legal, legalHref, t } from '../i18n'
import { CookiePreferences } from './CookieConsent'

/** Rodapé curto das páginas estáticas: copyright, textos legais e preferências de cookies. */
export function PageFooter() {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.14] pt-6 text-sm text-fog/70">
      <span>
        © {new Date().getFullYear()} {company.name}. {t.common.rights}
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href={homeHref()} className="font-semibold text-fog transition-colors hover:text-sky">
          {t.legal.back}
        </a>
        <a href={legalHref('privacy')} className="underline underline-offset-[3px] transition-colors hover:text-sky">
          {legal.privacy.title}
        </a>
        <a href={legalHref('terms')} className="underline underline-offset-[3px] transition-colors hover:text-sky">
          {legal.terms.title}
        </a>
        <CookiePreferences className="underline underline-offset-[3px] transition-colors hover:text-sky" />
      </div>
    </div>
  )
}
