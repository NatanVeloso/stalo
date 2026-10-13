import { useT, useLocale } from '@/shared/i18n'
import { formatCurrency } from '@/shared/lib/format'
import { Card, ErrorState, StatTile } from '@/shared/ui'
import { useFinanceiroResumo } from '../queries'

/** Os quatro indicadores do topo. Erro de carga ocupa o lugar deles, com "tentar de novo". */
export function ResumoTiles() {
  const t = useT()
  const locale = useLocale()
  const resumo = useFinanceiroResumo()
  const r = resumo.data
  const money = (v: number | undefined) => (v === undefined ? undefined : formatCurrency(v, locale, { compact: true }))

  if (resumo.isError) {
    return (
      <Card padding="none" className="animate-rise">
        <ErrorState onRetry={() => void resumo.refetch()} />
      </Card>
    )
  }

  return (
    <section className="animate-rise grid grid-cols-2 gap-(--stack-y) xl:grid-cols-4">
      <StatTile label={t.financeiro.kpis.recebido} loading={resumo.isPending} value={money(r?.recebidoMes)} />
      <StatTile label={t.financeiro.kpis.aReceber} loading={resumo.isPending} value={money(r?.aReceber)} />
      <StatTile label={t.financeiro.kpis.vencido} loading={resumo.isPending} value={money(r?.vencido)} />
      <StatTile label={t.financeiro.kpis.despesas} loading={resumo.isPending} value={money(r?.despesasMes)} />
    </section>
  )
}
