import type { Locale } from '@/shared/i18n/locales'

/** Locale do Intl para cada idioma da interface. */
const intlLocale: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

/** Valores monetários são sempre em BRL: a moeda é do dado, o idioma só muda a grafia. */
export function formatCurrency(value: number, locale: Locale, options: { compact?: boolean } = {}) {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: 'currency',
    currency: 'BRL',
    notation: options.compact ? 'compact' : 'standard',
    maximumFractionDigits: options.compact ? 1 : 2,
  }).format(value)
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocale[locale]).format(value)
}

export function formatDate(iso: string, locale: Locale, style: 'short' | 'medium' | 'long' = 'short') {
  const date = new Date(iso)
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { day: '2-digit', month: '2-digit', year: 'numeric' }
      : style === 'medium'
        ? { day: 'numeric', month: 'short' }
        : { day: 'numeric', month: 'long', year: 'numeric' }
  return new Intl.DateTimeFormat(intlLocale[locale], options).format(date)
}

export function formatTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function formatMonth(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: 'short' }).format(new Date(iso))
}

/** "há 3 dias", "in 2 hours"... relativo a agora. */
export function formatRelative(iso: string, locale: Locale) {
  const diff = new Date(iso).getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat(intlLocale[locale], { numeric: 'auto' })
  const minutes = Math.round(diff / 60_000)
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(days, 'day')
  return rtf.format(Math.round(days / 30), 'month')
}

export function formatCnpj(digits: string) {
  const d = digits.replace(/\D/g, '').padStart(14, '0')
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/** Dias entre hoje e a data (negativo = já passou). */
export function daysUntil(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(iso).getTime() - today.getTime()) / 86_400_000)
}

/** Iniciais para avatar: "Ana Souza" → "AS". */
export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
