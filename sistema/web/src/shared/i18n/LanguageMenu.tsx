import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { Flag, Menu, MenuItem } from '@/shared/ui'
import { fmt, localeLabels, locales, useT } from '.'

/** Seletor de idioma: troca em runtime, sem recarregar. */
export function LanguageMenu({ variant = 'ghost' }: { variant?: 'ghost' | 'glass' }) {
  const t = useT()
  const locale = usePrefs((s) => s.locale)
  const setLocale = usePrefs((s) => s.setLocale)
  const current = localeLabels[locale]
  return (
    <Menu
      trigger={
        <button
          type="button"
          aria-label={fmt(t.common.languageCurrent, { name: current.name })}
          className={cn(
            'group flex h-10 items-center gap-1.5 rounded-full pr-2.5 pl-2 text-small font-medium tracking-[0.04em] transition-colors',
            variant === 'glass'
              ? 'glass-inset hover:border-line-strong'
              : 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
          )}
        >
          <Flag locale={locale} className="size-5" />
          {current.short}
          <ChevronDown
            className="size-3.5 transition-transform group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      }
    >
      {locales.map((l) => (
        <MenuItem
          key={l}
          active={l === locale}
          icon={<Flag locale={l} className="size-5" />}
          onSelect={() => setLocale(l)}
        >
          <span className="flex items-center justify-between gap-3" lang={l}>
            {localeLabels[l].name}
            {l === locale && <Check className="size-4" aria-hidden="true" />}
          </span>
        </MenuItem>
      ))}
    </Menu>
  )
}
