/**
 * Idiomas da interface. pt-BR é a fonte da verdade: o tipo `Dictionary` sai
 * dele e os outros idiomas são anotados com esse tipo, então chave faltando
 * ou sobrando quebra o `tsc`.
 *
 * Idioma novo: adicione aqui, em `labels` e crie a pasta em locales/.
 */
export const locales = ['pt-BR', 'en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt-BR'

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  'pt-BR': { short: 'PT', name: 'Português' },
  en: { short: 'EN', name: 'English' },
  es: { short: 'ES', name: 'Español' },
}
