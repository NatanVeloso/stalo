import type { Dictionary, Locale } from '@/shared/i18n'
import { formatCompetencia, formatDate } from '@/shared/lib/format'
import type { Column } from '@/shared/ui'
import type { Obrigacao } from '../types'
import { VencimentoBadge } from './VencimentoBadge'
import { ObrigacaoStatusBadge } from './ObrigacaoStatusBadge'
import { EntregarButton } from './EntregarButton'

type Deps = {
  t: Dictionary
  locale: Locale
  podeEditar: boolean
  /** Perfil `cliente` só vê as próprias obrigações: a coluna Cliente seria repetida em toda linha. */
  isCliente: boolean
}

/**
 * Colunas da lista de obrigações. A `key` das ordenáveis é o nome do campo na API (`sort=<key>`):
 * a ordenação é no servidor (lista paginada).
 */
export function obrigacoesColumns({ t, locale, podeEditar, isCliente }: Deps): Column<Obrigacao>[] {
  const columns: Column<Obrigacao>[] = [
    {
      key: 'tipo',
      header: t.obrigacoes.columns.obrigacao,
      sortable: true,
      cell: (o) => (
        <span className="min-w-0">
          <span className="block font-medium">{t.obrigacoes.tipos[o.tipo]}</span>
          {!isCliente && <span className="block text-xs text-fg-muted md:hidden">{o.cliente}</span>}
        </span>
      ),
    },
  ]
  if (!isCliente) {
    columns.push({ key: 'cliente', header: t.obrigacoes.columns.cliente, hideOnMobile: true, sortable: true })
  }
  columns.push(
    {
      key: 'competencia',
      header: t.obrigacoes.columns.competencia,
      hideOnMobile: true,
      sortable: true,
      cell: (o) => <span className="tabular">{formatCompetencia(o.competencia, locale)}</span>,
    },
    {
      key: 'vencimento',
      header: t.obrigacoes.columns.vencimento,
      sortable: true,
      cell: (o) => (
        <span className="flex items-center gap-2">
          <span className="hidden text-fg-muted tabular md:inline">{formatDate(o.vencimento, locale)}</span>
          {o.status !== 'entregue' && <VencimentoBadge iso={o.vencimento} />}
        </span>
      ),
    },
    { key: 'responsavel', header: t.obrigacoes.columns.responsavel, hideOnMobile: true, sortable: true },
    {
      key: 'status',
      header: t.obrigacoes.columns.status,
      sortable: true,
      cell: (o) => <ObrigacaoStatusBadge status={o.status} />,
    },
  )
  if (podeEditar) {
    columns.push({
      key: 'acoes',
      header: t.common.table.actions,
      hideHeader: true,
      align: 'right',
      cell: (o) => o.status !== 'entregue' && <EntregarButton obrigacao={o} />,
    })
  }
  return columns
}
