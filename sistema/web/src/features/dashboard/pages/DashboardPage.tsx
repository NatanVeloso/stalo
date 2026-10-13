import { useState } from 'react'
import { Building2, CalendarClock, CalendarCheck2, Wallet } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { useCurrentUser, usePermission } from '@/shared/auth'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '@/shared/lib/format'
import { PageHeader } from '@/shared/layout'
import { Card, ErrorState, StatTile } from '@/shared/ui'
import { useResumo } from '../queries'
import { ReceitaChart } from '../components/ReceitaChart'
import { ProximosVencimentos } from '../components/ProximosVencimentos'
import { AtividadeRecente } from '../components/AtividadeRecente'

function greetingKey(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
}

export function DashboardPage() {
  const t = useT()
  const locale = useLocale()
  const user = useCurrentUser()
  const verFinanceiro = usePermission('financeiro:ver')
  const verObrigacoes = usePermission('obrigacoes:ver')
  // calculado uma vez por montagem: render puro, sem relógio no corpo do componente
  const [greeting] = useState(greetingKey)
  const resumo = useResumo()
  const d = resumo.data
  const pct = (v: number) => formatPercent(v, locale, { signed: true })

  return (
    <>
      <PageHeader
        title={fmt(t.dashboard.greeting[greeting], { name: user?.nome.split(' ')[0] ?? '' })}
        description={t.dashboard.subtitle}
      />

      {resumo.isError ? (
        <Card padding="none" className="animate-rise">
          <ErrorState description={t.dashboard.kpis.error} onRetry={() => void resumo.refetch()} />
        </Card>
      ) : (
        <section
          className={cn(
            'animate-rise grid gap-3 md:gap-(--stack-y)',
            // sem financeiro:ver são 3 indicadores: uma linha de 3 em vez de deixar buraco na grade de 2
            verFinanceiro ? 'grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3',
          )}
          aria-label={t.dashboard.title}
        >
          <StatTile
            label={t.dashboard.kpis.clientes}
            light="blue"
            icon={<Building2 />}
            loading={resumo.isPending}
            value={d && formatNumber(d.clientesAtivos, locale)}
            delta={d && { value: d.clientesDelta, text: pct(d.clientesDelta), label: t.dashboard.kpis.vsLastMonth }}
          />
          <StatTile
            label={t.dashboard.kpis.obrigacoes}
            light="pink"
            icon={<CalendarCheck2 />}
            loading={resumo.isPending}
            value={d && formatNumber(d.obrigacoesAbertas, locale)}
            delta={
              d && {
                value: d.obrigacoesDelta,
                text: pct(d.obrigacoesDelta),
                label: t.dashboard.kpis.vsLastMonth,
                upIsGood: false,
              }
            }
          />
          {verFinanceiro && (
            <StatTile
              label={t.dashboard.kpis.receber}
              light="amber"
              icon={<Wallet />}
              loading={resumo.isPending}
              value={d?.aReceber != null ? formatCurrency(d.aReceber, locale, { compact: true }) : undefined}
              delta={
                d?.aReceberDelta != null
                  ? { value: d.aReceberDelta, text: pct(d.aReceberDelta), label: t.dashboard.kpis.vsLastMonth }
                  : undefined
              }
            />
          )}
          <StatTile
            label={t.dashboard.kpis.vencendo}
            light="mint"
            icon={<CalendarClock />}
            loading={resumo.isPending}
            value={d && formatNumber(d.vencendo7d, locale)}
          />
        </section>
      )}

      {(verFinanceiro || verObrigacoes) && (
        <section
          className={cn('mt-(--stack-y) grid gap-(--stack-y)', verFinanceiro && verObrigacoes && 'xl:grid-cols-3')}
        >
          {verFinanceiro && <ReceitaChart className={cn(verObrigacoes && 'xl:col-span-2')} />}
          {verObrigacoes && <ProximosVencimentos />}
        </section>
      )}

      <section className="mt-(--stack-y)">
        <AtividadeRecente />
      </section>
    </>
  )
}
