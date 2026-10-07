import { ptBR, type Dictionary } from './locales/pt-BR'
import { en } from './locales/en'
import { es } from './locales/es'
import { type Locale } from './locales'
import { usePrefs } from '@/shared/prefs/prefs.store'

export { locales, localeLabels, defaultLocale, type Locale } from './locales'
export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { 'pt-BR': ptBR, en, es }

/**
 * Textos do idioma atual. A troca de idioma é em runtime (sem recarregar):
 * o hook assina o store, então o componente re-renderiza com o novo dicionário.
 *
 *   const t = useT()
 *   <h1>{t.clientes.title}</h1>
 *   <p>{fmt(t.clientes.subtitle, { n: total })}</p>
 */
export function useT(): Dictionary {
  const locale = usePrefs((s) => s.locale)
  return dictionaries[locale]
}

export function useLocale(): Locale {
  return usePrefs((s) => s.locale)
}

/** Interpola `{chave}` com os valores: fmt('Página {page} de {pages}', { page: 1, pages: 3 }). */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`))
}

/** Fora de componentes (ex.: título do documento). */
export function getDictionary(locale: Locale = usePrefs.getState().locale) {
  return dictionaries[locale]
}
