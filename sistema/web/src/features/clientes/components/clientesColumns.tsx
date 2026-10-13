import type { Dictionary, Locale } from '@/shared/i18n'
import { formatCnpj, formatCurrency, formatDate } from '@/shared/lib/format'
import { Avatar, Badge, type Column } from '@/shared/ui'
import type { Cliente } from '../types'

type Deps = { t: Dictionary; locale: Locale }

/**
 * Colunas da lista de clientes. A `key` das ordenáveis é o nome do campo na API (`sort=<key>`):
 * a ordenação é no servidor (lista paginada).
 */
export function clientesColumns({ t, locale }: Deps): Column<Cliente>[] {
  return [
    {
      key: 'nomeFantasia',
      header: t.clientes.columns.empresa,
      sortable: true,
      cell: (c) => (
        <span className="flex items-center gap-3">
          <Avatar name={c.nomeFantasia} size="sm" className="bg-fg/[0.08] text-fg" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{c.nomeFantasia}</span>
            <span className="block truncate text-xs text-fg-muted">{c.razaoSocial}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'cnpj',
      header: t.clientes.columns.cnpj,
      hideOnMobile: true,
      cell: (c) => <span className="whitespace-nowrap text-fg-muted tabular">{formatCnpj(c.cnpj)}</span>,
    },
    {
      key: 'regime',
      header: t.clientes.columns.regime,
      hideOnMobile: true,
      sortable: true,
      cell: (c) => t.common.regime[c.regime],
    },
    { key: 'responsavel', header: t.clientes.columns.responsavel, hideOnMobile: true, sortable: true },
    {
      key: 'honorario',
      header: t.clientes.columns.honorario,
      align: 'right',
      sortable: true,
      cell: (c) => <span className="tabular">{formatCurrency(c.honorario, locale)}</span>,
    },
    {
      key: 'desde',
      header: t.clientes.columns.desde,
      hideOnMobile: true,
      sortable: true,
      cell: (c) => <span className="tabular">{formatDate(c.desde, locale)}</span>,
    },
    {
      key: 'status',
      header: t.clientes.columns.status,
      sortable: true,
      cell: (c) => <Badge tone={c.status === 'ativo' ? 'ok' : 'neutral'}>{t.common.status[c.status]}</Badge>,
    },
  ]
}
