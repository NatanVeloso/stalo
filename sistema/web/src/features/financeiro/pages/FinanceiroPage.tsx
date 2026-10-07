import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { PageHeader } from '@/shared/layout'
import { Badge, Button, Card, DataTable, Segmented, StatTile, type BadgeTone, type Column } from '@/shared/ui'
import { useFinanceiroResumo, useLancamentos } from '../queries'
import type { Lancamento, LancamentoStatus, LancamentoTipo } from '../types'

const statusTone: Record<LancamentoStatus, BadgeTone> = { pago: 'ok', emAberto: 'neutral', vencido: 'danger' }

export function FinanceiroPage() {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('financeiro:editar')
  const [tipo, setTipo] = useState<LancamentoTipo | ''>('')
  const resumo = useFinanceiroResumo()
  const list = useLancamentos(tipo)
  const r = resumo.data

  const columns: Column<Lancamento>[] = [
    {
      key: 'descricao',
      header: t.financeiro.columns.descricao,
      sortValue: (l) => l.descricao,
      cell: (l) => (
        <span className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-xl',
              l.tipo === 'receita' ? 'bg-ok-soft text-ok' : 'bg-fg/[0.06] text-fg-muted',
            )}
            aria-label={t.financeiro.tipos[l.tipo]}
          >
            {l.tipo === 'receita' ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{l.descricao}</span>
            <span className="block truncate text-xs text-fg-muted">{t.financeiro.categorias[l.categoria]}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'cliente',
      header: t.financeiro.columns.cliente,
      hideOnMobile: true,
      sortValue: (l) => l.cliente ?? '',
      cell: (l) => l.cliente ?? <span className="text-fg-subtle">—</span>,
    },
    {
      key: 'vencimento',
      header: t.financeiro.columns.vencimento,
      hideOnMobile: true,
      sortValue: (l) => l.vencimento,
      cell: (l) => <span className="tabular">{formatDate(l.vencimento, locale)}</span>,
    },
    {
      key: 'valor',
      header: t.financeiro.columns.valor,
      align: 'right',
      sortValue: (l) => l.valor,
      cell: (l) => (
        <span className={cn('font-medium tabular', l.tipo === 'despesa' && 'text-fg-muted')}>
          {l.tipo === 'despesa' ? '−' : ''}
          {formatCurrency(l.valor, locale)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t.financeiro.columns.status,
      sortValue: (l) => l.status,
      cell: (l) => <Badge tone={statusTone[l.status]}>{t.common.status[l.status]}</Badge>,
    },
  ]

  return (
    <>
      <PageHeader
        title={t.financeiro.title}
        description={t.financeiro.subtitle}
        actions={podeEditar && <Button leading={<Plus className="size-4" />}>{t.financeiro.new}</Button>}
      />

      <section className="animate-rise grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatTile
          label={t.financeiro.kpis.recebido}
          loading={resumo.isPending}
          value={r && formatCurrency(r.recebidoMes, locale, { compact: true })}
        />
        <StatTile
          label={t.financeiro.kpis.aReceber}
          loading={resumo.isPending}
          value={r && formatCurrency(r.aReceber, locale, { compact: true })}
        />
        <StatTile
          label={t.financeiro.kpis.vencido}
          loading={resumo.isPending}
          value={r && formatCurrency(r.vencido, locale, { compact: true })}
        />
        <StatTile
          label={t.financeiro.kpis.despesas}
          loading={resumo.isPending}
          value={r && formatCurrency(r.despesasMes, locale, { compact: true })}
        />
      </section>

      <Card padding="none" className="animate-rise mt-4">
        <div className="p-4">
          <Segmented<LancamentoTipo | ''>
            label={t.financeiro.tabs.todos}
            value={tipo}
            onChange={setTipo}
            options={[
              { value: '', label: t.financeiro.tabs.todos },
              { value: 'receita', label: t.financeiro.tabs.receitas },
              { value: 'despesa', label: t.financeiro.tabs.despesas },
            ]}
          />
        </div>
        <DataTable columns={columns} rows={list.data ?? []} rowKey={(l) => l.id} loading={list.isPending} />
      </Card>
    </>
  )
}
