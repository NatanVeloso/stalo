import { Building2, CalendarClock, CalendarCheck2, Wallet } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { useCurrentUser } from '@/shared/auth'
import { formatCurrency, formatNumber } from '@/shared/lib/format'
import { PageHeader } from '@/shared/layout'
import { StatTile } from '@/shared/ui'
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
  const resumo = useResumo()
  const d = resumo.data

  return (
    <>
      <PageHeader
        title={fmt(t.dashboard.greeting[greetingKey()], { name: user?.nome.split(' ')[0] ?? '' })}
        description={t.dashboard.subtitle}
      />

      <section className="animate-rise grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4" aria-label={t.dashboard.title}>
        <StatTile
          label={t.dashboard.kpis.clientes}
          icon={<Building2 />}
          loading={resumo.isPending}
          value={d && formatNumber(d.clientesAtivos, locale)}
          delta={d && { value: d.clientesDelta, label: t.dashboard.kpis.vsLastMonth }}
        />
        <StatTile
          label={t.dashboard.kpis.obrigacoes}
          icon={<CalendarCheck2 />}
          loading={resumo.isPending}
          value={d && formatNumber(d.obrigacoesAbertas, locale)}
          delta={d && { value: d.obrigacoesDelta, label: t.dashboard.kpis.vsLastMonth, upIsGood: false }}
        />
        <StatTile
          label={t.dashboard.kpis.receber}
          icon={<Wallet />}
          loading={resumo.isPending}
          value={d && formatCurrency(d.aReceber, locale, { compact: true })}
          delta={d && { value: d.aReceberDelta, label: t.dashboard.kpis.vsLastMonth }}
        />
        <StatTile
          label={t.dashboard.kpis.vencendo}
          icon={<CalendarClock />}
          loading={resumo.isPending}
          value={d && formatNumber(d.vencendo7d, locale)}
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <ReceitaChart className="xl:col-span-2" />
        <ProximosVencimentos />
      </section>

      <section className="mt-4">
        <AtividadeRecente />
      </section>
    </>
  )
}
