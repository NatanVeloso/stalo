import { t, legalHref } from '../i18n'
import { tracking } from '../data/tracking'
import { consent, useConsent } from '../lib/consent'

type Props = { show?: boolean }

/**
 * Banner de consentimento dos cookies de marketing (Meta Pixel).
 * Só existe se houver rastreamento configurado (data/tracking.ts). Fica no
 * canto inferior esquerdo; no celular sobe um pouco para não cobrir o botão do
 * WhatsApp. Aceitar e recusar têm o mesmo peso, e nada carrega antes do aceite.
 * `show` segura o banner até o preloader terminar (no site de página única).
 */
export function CookieConsent({ show = true }: Props) {
  const { open } = useConsent()
  if (!tracking.metaPixelId || !show || !open) return null

  const button =
    'flex-1 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors'

  return (
    <div
      role="dialog"
      aria-label={t.cookies.manage}
      className="fixed bottom-24 left-4 right-4 z-[66] rounded-3xl border border-white/10 bg-[rgba(11,18,32,0.95)] p-5 text-fog shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-[opacity,translate] duration-500 starting:translate-y-4 starting:opacity-0 md:bottom-7 md:left-7 md:right-auto md:max-w-[400px]"
    >
      <p className="m-0 text-pretty text-sm leading-[1.55] text-fog/85">
        {t.cookies.text}{' '}
        <a href={legalHref('privacy')} className="underline underline-offset-[3px] transition-colors hover:text-sky">
          {t.cookies.policy}
        </a>
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => consent.decide('denied')}
          className={`${button} border-white/30 bg-transparent text-fog hover:bg-white/10`}
        >
          {t.cookies.reject}
        </button>
        <button
          type="button"
          onClick={() => consent.decide('granted')}
          className={`${button} border-fog bg-fog text-[#0a0a0a] hover:bg-white`}
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  )
}

/** Link "Preferências de cookies" (rodapé e páginas legais): reabre o banner. */
export function CookiePreferences({ className = '' }: { className?: string }) {
  if (!tracking.metaPixelId) return null
  return (
    <button
      type="button"
      onClick={consent.reopen}
      className={`cursor-pointer border-0 bg-transparent p-0 text-inherit ${className}`}
    >
      {t.cookies.manage}
    </button>
  )
}
