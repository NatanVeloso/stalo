import type { Locale } from '../i18n'

type Props = { locale: Locale; className?: string }

/**
 * Bandeira redonda do idioma, desenhada em SVG: emoji de bandeira não
 * renderiza no Windows (aparece "BR", "US"...). São versões simplificadas,
 * feitas para ler bem em ~20px.
 */
export function Flag({ locale, className = '' }: Props) {
  return (
    <span aria-hidden="true" className={`block shrink-0 overflow-hidden rounded-full ring-1 ring-white/20 ${className}`}>
      <svg viewBox="0 0 24 24" className="block h-full w-full">
        {flags[locale]}
      </svg>
    </span>
  )
}

const flags: Record<Locale, React.ReactNode> = {
  'pt-BR': (
    <>
      <rect width="24" height="24" fill="#009b3a" />
      <path d="M12 4.5 21 12l-9 7.5L3 12z" fill="#fedf00" />
      <circle cx="12" cy="12" r="4" fill="#002776" />
      <path d="M8.2 11.1c2.7-.6 5.5 0 7.7 1.7" stroke="#fff" strokeWidth="0.9" fill="none" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <path
        fill="#b22234"
        d="M0 0h24v1.85H0zM0 3.69h24v1.85H0zM0 7.38h24v1.85H0zM0 11.08h24v1.85H0zM0 14.77h24v1.85H0zM0 18.46h24v1.85H0zM0 22.15h24V24H0z"
      />
      <rect width="12" height="12.93" fill="#3c3b6e" />
      <path
        fill="#fff"
        d="M4 3.2h1v1H4zM7 3.2h1v1H7zM10 3.2h1v1h-1zM5.5 5.6h1v1h-1zM8.5 5.6h1v1h-1zM4 8h1v1H4zM7 8h1v1H7zM10 8h1v1h-1zM5.5 10.4h1v1h-1zM8.5 10.4h1v1h-1z"
      />
    </>
  ),
  es: (
    <>
      <rect width="24" height="24" fill="#aa151b" />
      <rect y="6" width="24" height="12" fill="#f1bf00" />
      <rect x="6" y="9.5" width="3.2" height="5" rx="0.8" fill="#aa151b" />
    </>
  ),
}
