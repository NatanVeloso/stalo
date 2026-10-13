import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { PageHeader } from '@/shared/layout'
import { Button, Card, DataTable, Pagination, SearchInput, Select, type SortState } from '@/shared/ui'
import { useClientes } from '../queries'
import type { ClienteStatus, ClientesSort, RegimeTributario } from '../types'
import { ClienteDrawer } from '../components/ClienteDrawer'
import { clientesColumns } from '../components/clientesColumns'

const PAGE_SIZE = 10

export function ClientesPage() {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('clientes:editar')
  const [search, setSearch] = useState('')
  const [regime, setRegime] = useState<RegimeTributario | ''>('')
  const [status, setStatus] = useState<ClienteStatus | ''>('')
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const debounced = useDebounce(search)

  const query = useClientes({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    // a key da coluna é o nome do campo na API (ver clientesColumns)
    sort: sort?.key as ClientesSort | undefined,
    order: sort?.order,
    regime,
    status,
  })

  // qualquer mudança de filtro ou ordem muda o conjunto: volta para a primeira página
  const resetPage =
    <V,>(set: (v: V) => void) =>
    (v: V) => {
      set(v)
      setPage(1)
    }

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
        <div className="flex flex-col gap-(--list-gap) p-(--card-p) md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={resetPage(setSearch)}
            placeholder={t.clientes.searchPlaceholder}
            className="md:max-w-sm md:flex-1"
          />
          <div className="flex gap-2">
            <Select
              size="sm"
              aria-label={t.clientes.filters.regime}
              value={regime}
              onChange={resetPage((v: string) => setRegime(v as RegimeTributario | ''))}
              options={regimeOptions}
              className="w-44"
            />
            <Select
              size="sm"
              aria-label={t.clientes.filters.status}
              value={status}
              onChange={resetPage((v: string) => setStatus(v as ClienteStatus | ''))}
              options={statusOptions}
              className="w-32"
            />
          </div>
        </div>

        <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            columns={clientesColumns({ t, locale })}
            rows={query.data?.items ?? []}
            rowKey={(c) => c.id}
            loading={query.isPending}
            error={query.isError}
            onRetry={() => void query.refetch()}
            sort={sort}
            onSortChange={resetPage(setSort)}
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
