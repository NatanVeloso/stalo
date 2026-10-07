import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { formatDate } from '@/shared/lib/format'
import { PageHeader } from '@/shared/layout'
import { Button, Card, DataTable, Segmented, toast, type Column } from '@/shared/ui'
import { useMarcarEntregue, useObrigacoes } from '../queries'
import type { Obrigacao, ObrigacaoStatus } from '../types'
import { VencimentoBadge } from '../components/VencimentoBadge'
import { ObrigacaoStatusBadge } from '../components/ObrigacaoStatusBadge'

type Tab = 'todas' | ObrigacaoStatus

export function ObrigacoesPage() {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('obrigacoes:editar')
  const [tab, setTab] = useState<Tab>('todas')
  const all = useObrigacoes()
  const entregar = useMarcarEntregue()

  const rows = (all.data ?? []).filter((o) => tab === 'todas' || o.status === tab)
  const count = (s: ObrigacaoStatus) => all.data?.filter((o) => o.status === s).length

  const columns: Column<Obrigacao>[] = [
    {
      key: 'tipo',
      header: t.obrigacoes.columns.obrigacao,
      sortValue: (o) => o.tipo,
      cell: (o) => (
        <span className="min-w-0">
          <span className="block font-medium">{t.obrigacoes.tipos[o.tipo]}</span>
          <span className="block text-xs text-fg-muted md:hidden">{o.cliente}</span>
        </span>
      ),
    },
    { key: 'cliente', header: t.obrigacoes.columns.cliente, hideOnMobile: true, sortValue: (o) => o.cliente },
    {
      key: 'competencia',
      header: t.obrigacoes.columns.competencia,
      hideOnMobile: true,
      sortValue: (o) => o.competencia,
      cell: (o) => <span className="tabular">{o.competencia}</span>,
    },
    {
      key: 'vencimento',
      header: t.obrigacoes.columns.vencimento,
      sortValue: (o) => o.vencimento,
      cell: (o) => (
        <span className="flex items-center gap-2">
          <span className="hidden text-fg-muted tabular md:inline">{formatDate(o.vencimento, locale)}</span>
          {o.status !== 'entregue' && <VencimentoBadge iso={o.vencimento} />}
        </span>
      ),
    },
    {
      key: 'responsavel',
      header: t.obrigacoes.columns.responsavel,
      hideOnMobile: true,
      sortValue: (o) => o.responsavel,
    },
    {
      key: 'status',
      header: t.obrigacoes.columns.status,
      sortValue: (o) => o.status,
      cell: (o) => <ObrigacaoStatusBadge status={o.status} />,
    },
    ...(podeEditar
      ? [
          {
            key: 'acoes',
            header: '',
            align: 'right' as const,
            cell: (o: Obrigacao) =>
              o.status !== 'entregue' && (
                <Button
                  size="sm"
                  variant="secondary"
                  leading={<Check className="size-3.5" />}
                  loading={entregar.isPending && entregar.variables === o.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    entregar.mutate(o.id, {
                      onSuccess: () => toast(`${t.obrigacoes.tipos[o.tipo]} · ${o.cliente}`, 'ok'),
                    })
                  }}
                >
                  <span className="hidden lg:inline">{t.obrigacoes.markDelivered}</span>
                </Button>
              ),
          },
        ]
      : []),
  ]

  return (
    <>
      <PageHeader
        title={t.obrigacoes.title}
        description={t.obrigacoes.subtitle}
        actions={podeEditar && <Button leading={<Plus className="size-4" />}>{t.obrigacoes.new}</Button>}
      />

      <Card padding="none" className="animate-rise">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <Segmented<Tab>
            label={t.obrigacoes.columns.status}
            value={tab}
            onChange={setTab}
            options={[
              { value: 'todas', label: t.obrigacoes.tabs.todas, count: all.data?.length },
              { value: 'pendente', label: t.obrigacoes.tabs.pendentes, count: count('pendente') },
              { value: 'atrasada', label: t.obrigacoes.tabs.atrasadas, count: count('atrasada') },
              { value: 'entregue', label: t.obrigacoes.tabs.entregues, count: count('entregue') },
            ]}
          />
          {all.data && (
            <p className="text-[13px] text-fg-muted">
              {fmt(t.obrigacoes.summary.pendentes, { n: count('pendente') ?? 0 })} ·{' '}
              {fmt(t.obrigacoes.summary.atrasadas, { n: count('atrasada') ?? 0 })}
            </p>
          )}
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(o) => o.id}
          loading={all.isPending}
          defaultSort={{ key: 'vencimento', order: 'asc' }}
        />
      </Card>
    </>
  )
}
