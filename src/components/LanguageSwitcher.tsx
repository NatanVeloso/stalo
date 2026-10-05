import { useEffect, useId, useRef, useState } from 'react'
import { locale, localeOptions, t } from '../i18n'
import { Flag } from './Flag'

type Props = {
  /** `menu`: botão com a bandeira atual que abre a lista embaixo (header). `inline`: os três lado a lado (rodapé). */
  variant?: 'menu' | 'inline'
  className?: string
}

/**
 * Seletor de idioma. Cada opção é um link comum para a mesma página no outro
 * idioma: a troca recarrega o site, não há estado de idioma em React.
 */
export function LanguageSwitcher({ variant = 'inline', className = '' }: Props) {
  return variant === 'menu' ? <Menu className={className} /> : <Inline className={className} />
}

function Inline({ className }: { className: string }) {
  return (
    <div role="group" aria-label={t.common.language} className={`flex items-center gap-0.5 ${className}`}>
      {localeOptions.map((o) => {
        const active = o.locale === locale
        return (
          <a
            key={o.locale}
            href={o.href}
            hrefLang={o.locale}
            lang={o.locale}
            title={o.name}
            aria-label={o.name}
            aria-current={active ? 'true' : undefined}
            className={`flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 text-[13px] font-medium tracking-[0.04em] transition-colors duration-300 ${
              active ? 'bg-white/[0.14] text-fog' : 'text-fog/60 hover:text-fog'
            }`}
          >
            <Flag locale={o.locale} className="h-4 w-4" />
            {o.short}
          </a>
        )
      })}
    </div>
  )
}

function Menu({ className }: { className: string }) {
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const id = useId()
  const [open, setOpen] = useState(false)
  const current = localeOptions.find((o) => o.locale === locale)!

  // fecha ao clicar fora ou no Esc (o Esc devolve o foco ao botão)
  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    document.addEventListener('pointerdown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${t.common.language}: ${current.name}`}
        onClick={() => setOpen(!open)}
        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 pl-2 pr-2.5 text-[13px] font-medium tracking-[0.04em] text-fog transition-colors duration-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
      >
        <Flag locale={locale} className="h-6 w-6" />
        {current.short}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`text-fog/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* fundo quase opaco em vez de vidro: sem backdrop-filter não precisa de versão para o modo leve */}
      {open && (
        <div
          id={id}
          className="absolute right-0 top-full z-10 mt-3 flex min-w-[190px] flex-col gap-0.5 rounded-2xl border border-white/[0.14] bg-[rgba(12,16,24,0.97)] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-[opacity,translate] duration-200 starting:-translate-y-1.5 starting:opacity-0"
        >
          {localeOptions.map((o) => {
            const active = o.locale === locale
            return (
              <a
                key={o.locale}
                href={o.href}
                hrefLang={o.locale}
                lang={o.locale}
                aria-current={active ? 'true' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active ? 'bg-white/[0.1] text-fog' : 'text-fog/75 hover:bg-white/[0.06] hover:text-fog'
                }`}
              >
                <Flag locale={o.locale} className="h-6 w-6" />
                <span className="flex-1">{o.name}</span>
                {active && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-mint"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
