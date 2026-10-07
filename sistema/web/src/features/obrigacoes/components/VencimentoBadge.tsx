import { useT, useLocale, fmt } from '@/shared/i18n'
import { daysUntil, formatDate } from '@/shared/lib/format'
import { Badge } from '@/shared/ui'

/** Vencimento com urgência: atrasado (vermelho), até 3 dias (âmbar), resto neutro. Sempre com o texto. */
export function VencimentoBadge({ iso }: { iso: string }) {
  const t = useT()
  const locale = useLocale()
  const d = daysUntil(iso)
  const label =
    d === -1
      ? t.common.yesterday
      : d < 0
        ? fmt(t.common.daysLate, { n: -d })
        : d === 0
          ? t.common.today
          : d === 1
            ? t.common.tomorrow
            : d <= 15
              ? fmt(t.common.inDays, { n: d })
              : formatDate(iso, locale)
  return (
    <Badge tone={d < 0 ? 'danger' : d <= 3 ? 'warn' : 'neutral'} dot={d <= 3}>
      {label}
    </Badge>
  )
}
