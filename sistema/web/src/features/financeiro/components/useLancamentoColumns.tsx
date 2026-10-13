import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { Badge, type BadgeTone, type Column } from '@/shared/ui'
import type { Lancamento, LancamentoStatus } from '../types'

const statusTone: Record<LancamentoStatus, BadgeTone> = { pago: 'ok', emAberto: 'neutral', vencido: 'danger' }

/** Colunas da lista de lançamentos. Ordenação é no servidor (`sortable`), por isso sem `sortValue`. */
export function useLancamentoColumns(): Column<Lancamento>[] {
  const t = useT()
  const locale = useLocale()
  return [
    {
      key: 'descricao',
      header: t.financeiro.columns.descricao,
      sortable: true,
      cell: (l) => (
        <span className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-xl',
              l.tipo === 'receita' ? 'bg-ok-soft text-ok' : 'bg-fg/[0.06] text-fg-muted',
            )}
          >
            {l.tipo === 'receita' ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
          </span>
          {/* ícone e cor dizem o tipo para quem vê; o texto escondido diz o mesmo ao leitor de tela */}
          <span className="sr-only">{t.financeiro.tipos[l.tipo]}</span>
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
      sortable: true,
      cell: (l) => l.cliente ?? <span className="text-fg-subtle">—</span>,
    },
    {
      key: 'vencimento',
      header: t.financeiro.columns.vencimento,
      hideOnMobile: true,
      sortable: true,
      cell: (l) => <span className="tabular">{formatDate(l.vencimento, locale)}</span>,
    },
    {
      key: 'valor',
      header: t.financeiro.columns.valor,
      align: 'right',
      sortable: true,
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
      sortable: true,
      cell: (l) => <Badge tone={statusTone[l.status]}>{t.common.status[l.status]}</Badge>,
    },
  ]
}
