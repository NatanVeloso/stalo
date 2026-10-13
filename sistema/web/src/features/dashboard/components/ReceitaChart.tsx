import { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatMonth } from '@/shared/lib/format'
import { BarChart, Card, CardHeader, EmptyState, ErrorState, IconButton, Skeleton } from '@/shared/ui'
import { useDensity } from '@/shared/theme/useTheme'
import { useReceitaMensal } from '../queries'

/**
 * Honorários recebidos por mês. Alterna gráfico ↔ tabela (a tabela é a versão acessível dos mesmos dados).
 * Só montar com `financeiro:ver` (o endpoint exige; a página decide).
 */
export function ReceitaChart({ className }: { className?: string }) {
  const t = useT()
  const locale = useLocale()
  const query = useReceitaMensal()
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const density = useDensity()
  // altura mínima em rem (acompanha a fonte); o gráfico cresce até preencher o card
  const minHeightRem = { comfortable: 12, medium: 9, compact: 8 }[density]

  const data = (query.data ?? []).map((r) => ({
    key: r.mes,
    label: formatMonth(r.mes, locale),
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
            {data.length > 0 && (
              <span className="mr-2 text-right">
                <span className="block text-caption text-fg-subtle">{t.dashboard.chart.total}</span>
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
      {query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} className="flex-1" />
      ) : query.isPending ? (
        <Skeleton className="w-full flex-1" style={{ minHeight: `${minHeightRem}rem` }} />
      ) : data.length === 0 ? (
        <EmptyState title={t.dashboard.chart.empty} icon={<BarChart3 />} />
      ) : view === 'chart' ? (
        <BarChart
          data={data}
          label={fmt(t.dashboard.chart.label, { title: t.dashboard.chart.title, subtitle: t.dashboard.chart.subtitle })}
          className="flex-1"
          style={{ minHeight: `${minHeightRem}rem` }}
          formatValue={(v) => formatCurrency(v, locale)}
          formatTick={(v) => formatCurrency(v, locale, { compact: true })}
        />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-fg-muted">
              <th className="border-b border-line py-(--head-y) font-medium">{t.dashboard.chart.month}</th>
              <th className="border-b border-line py-(--head-y) text-right font-medium">{t.dashboard.chart.value}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <td className="border-b border-line py-(--cell-y) capitalize">{d.label}</td>
                <td className="border-b border-line py-(--cell-y) text-right tabular">
                  {formatCurrency(d.value, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}
