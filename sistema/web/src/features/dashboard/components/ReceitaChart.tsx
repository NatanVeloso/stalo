import { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatMonth } from '@/shared/lib/format'
import { BarChart, Card, CardHeader, IconButton, Skeleton } from '@/shared/ui'
import { useCompact } from '@/shared/theme/useTheme'
import { useReceitaMensal } from '../queries'

/** Honorários recebidos por mês. Alterna gráfico ↔ tabela (a tabela é a versão acessível dos mesmos dados). */
export function ReceitaChart({ className }: { className?: string }) {
  const t = useT()
  const locale = useLocale()
  const query = useReceitaMensal()
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const compact = useCompact()
  // altura mínima em rem (acompanha a fonte); o gráfico cresce até preencher o card
  const minHeightRem = compact ? 9 : 12

  const data = (query.data ?? []).map((r) => ({
    key: r.mes,
    label: formatMonth(r.mes, locale).replace('.', ''),
    value: r.valor,
  }))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader
        title={t.dashboard.chart.title}
        description={t.dashboard.chart.subtitle}
        actions={
          <>
            {query.data && (
              <span className="mr-2 text-right">
                <span className="block text-[11px] text-fg-subtle">{t.dashboard.chart.total}</span>
                <span className="text-sm font-semibold tabular">{formatCurrency(total, locale)}</span>
              </span>
            )}
            <IconButton
              size="sm"
              label={view === 'chart' ? t.dashboard.chart.table : t.dashboard.chart.chart}
              onClick={() => setView((v) => (v === 'chart' ? 'table' : 'chart'))}
              active={view === 'table'}
            >
              {view === 'chart' ? <Table2 /> : <BarChart3 />}
            </IconButton>
          </>
        }
      />
      {query.isPending ? (
        <Skeleton className="w-full flex-1" style={{ minHeight: `${minHeightRem}rem` }} />
      ) : view === 'chart' ? (
        <BarChart
          data={data}
          className="flex-1"
          style={{ minHeight: `${minHeightRem}rem` }}
          formatValue={(v) => formatCurrency(v, locale)}
          formatTick={(v) => formatCurrency(v, locale, { compact: true })}
        />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-fg-muted">
              <th className="border-b border-line py-2 font-medium">{t.dashboard.chart.month}</th>
              <th className="border-b border-line py-2 text-right font-medium">{t.dashboard.chart.value}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <td className="border-b border-line py-2 capitalize">{d.label}</td>
                <td className="border-b border-line py-2 text-right tabular">{formatCurrency(d.value, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}
