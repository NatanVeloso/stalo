import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { formatCnpj, formatCurrency, formatDate } from '@/shared/lib/format'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { PageHeader } from '@/shared/layout'
import { Avatar, Badge, Button, Card, DataTable, Pagination, SearchInput, Select, type Column } from '@/shared/ui'
import { useClientes } from '../queries'
import type { Cliente, ClienteStatus, RegimeTributario } from '../types'
import { ClienteDrawer } from '../components/ClienteDrawer'

const PAGE_SIZE = 10

export function ClientesPage() {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('clientes:editar')
  const [search, setSearch] = useState('')
  const [regime, setRegime] = useState<RegimeTributario | ''>('')
  const [status, setStatus] = useState<ClienteStatus | ''>('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const debounced = useDebounce(search)

  const query = useClientes({ search: debounced, regime, status, page, pageSize: PAGE_SIZE })

  const columns: Column<Cliente>[] = [
    {
      key: 'empresa',
      header: t.clientes.columns.empresa,
      sortValue: (c) => c.nomeFantasia,
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
      sortValue: (c) => c.regime,
      cell: (c) => t.common.regime[c.regime],
    },
    { key: 'responsavel', header: t.clientes.columns.responsavel, hideOnMobile: true, sortValue: (c) => c.responsavel },
    {
      key: 'honorario',
      header: t.clientes.columns.honorario,
      align: 'right',
      sortValue: (c) => c.honorario,
      cell: (c) => <span className="tabular">{formatCurrency(c.honorario, locale)}</span>,
    },
    {
      key: 'desde',
      header: t.clientes.columns.desde,
      hideOnMobile: true,
      sortValue: (c) => c.desde,
      cell: (c) => formatDate(c.desde, locale),
    },
    {
      key: 'status',
      header: t.clientes.columns.status,
      sortValue: (c) => c.status,
      cell: (c) => <Badge tone={c.status === 'ativo' ? 'ok' : 'neutral'}>{t.common.status[c.status]}</Badge>,
    },
  ]

  const regimeOptions = [
    { value: '', label: t.clientes.filters.all },
    ...(['simples', 'presumido', 'real', 'mei'] as const).map((r) => ({ value: r, label: t.common.regime[r] })),
  ]
  const statusOptions = [
    { value: '', label: t.clientes.filters.all },
    ...(['ativo', 'inativo'] as const).map((s) => ({ value: s, label: t.common.status[s] })),
  ]

  return (
    <>
      <PageHeader
        title={t.clientes.title}
        description={query.data ? fmt(t.clientes.subtitle, { n: query.data.total }) : undefined}
        actions={podeEditar && <Button leading={<Plus className="size-4" />}>{t.clientes.new}</Button>}
      />

      <Card padding="none" className="animate-rise">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder={t.clientes.searchPlaceholder}
            className="md:max-w-sm md:flex-1"
          />
          <div className="flex gap-2">
            <Select
              size="sm"
              aria-label={t.clientes.filters.regime}
              value={regime}
              onChange={(v) => {
                setRegime(v as RegimeTributario | '')
                setPage(1)
              }}
              options={regimeOptions}
              className="w-44"
            />
            <Select
              size="sm"
              aria-label={t.clientes.filters.status}
              value={status}
              onChange={(v) => {
                setStatus(v as ClienteStatus | '')
                setPage(1)
              }}
              options={statusOptions}
              className="w-32"
            />
          </div>
        </div>

        <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            columns={columns}
            rows={query.data?.items ?? []}
            rowKey={(c) => c.id}
            loading={query.isPending}
            onRowClick={(c) => setSelected(c.id)}
          />
        </div>
        {query.data && query.data.total > 0 && (
          <Pagination page={page} pageSize={PAGE_SIZE} total={query.data.total} onChange={setPage} />
        )}
      </Card>

      <ClienteDrawer id={selected} onClose={() => setSelected(null)} />
    </>
  )
}
