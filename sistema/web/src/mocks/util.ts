/** Simula latência de rede para os loadings aparecerem como na vida real. */
export function fakeDelay(ms = 400) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** Data ISO (só dia) a N dias de hoje. Os mocks são relativos para a demo nunca "envelhecer". */
export function daysFromNow(days: number) {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Primeiro dia do mês, N meses atrás. */
export function monthsAgo(months: number) {
  const d = new Date()
  d.setDate(1)
  d.setHours(12, 0, 0, 0)
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

/** Timestamp ISO a N horas de agora. */
export function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 3_600_000).toISOString()
}
