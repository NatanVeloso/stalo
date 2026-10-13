import type { Locale } from '@/shared/i18n/locales'

/** Locale do Intl para cada idioma da interface. */
const intlLocale: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }

/**
 * Lê data do contrato. Data só-dia (`YYYY-MM-DD`) vira meia-noite **local**: `new Date('2026-10-05')`
 * seria meia-noite UTC, que no Brasil ainda é dia 4 às 21h e mostraria a data errada.
 * Instante completo (ISO com hora) segue como veio.
 */
export function parseDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso)
}

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
  const date = parseDate(iso)
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

/** Mês abreviado sem o ponto final do pt/es ("out", "Oct"), para eixo de gráfico. */
export function formatMonth(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: 'short' }).format(parseDate(iso)).replace('.', '')
}

/** Competência `YYYY-MM` → "out. de 2026" / "Oct 2026". Lida como data local para não voltar um mês no fuso. */
export function formatCompetencia(competencia: string, locale: Locale) {
  const [y, m] = competencia.split('-').map(Number)
  if (!y || !m) return competencia
  return new Intl.DateTimeFormat(intlLocale[locale], { month: 'short', year: 'numeric' }).format(new Date(y, m - 1, 1))
}

/** Percentual a partir de pontos percentuais (8.3 → "+8,3%"). `signed` mostra o "+" nos positivos. */
export function formatPercent(value: number, locale: Locale, options: { signed?: boolean } = {}) {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: options.signed ? 'exceptZero' : 'auto',
  }).format(value / 100)
}

/** Chave `YYYY-MM-DD` do dia **local** (não UTC): agrupar mensagens por dia no fuso de quem vê. */
export function localDayKey(date: Date | string | number) {
  const d = new Date(date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
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

/** Dias de calendário entre hoje e a data (negativo = já passou). A hora do dia não conta. */
export function daysUntil(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = parseDate(iso)
  day.setHours(0, 0, 0, 0)
  // arredonda para absorver a hora a mais/a menos da troca de horário de verão
  return Math.round((day.getTime() - today.getTime()) / 86_400_000)
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
