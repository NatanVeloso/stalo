import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { roles, type Role } from '@/shared/auth'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { PageHeader } from '@/shared/layout'
import { Button, Card, DataTable, Pagination, SearchInput, Select, type SortState } from '@/shared/ui'
import { useUsuarios } from '../queries'
import type { UsuarioSort } from '../types'
import { PerfisCard } from '../components/PerfisCard'
import { useUsuarioColumns } from '../components/useUsuarioColumns'

const PAGE_SIZE = 10

export function UsuariosPage() {
  const t = useT()
  const columns = useUsuarioColumns()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<Role | ''>('')
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search)

  const query = useUsuarios({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    role,
    sort: sort?.key as UsuarioSort | undefined,
    order: sort?.order,
  })

  // filtro ou ordenação novos mudam o conjunto: volta para a primeira página
  const resetando =
    <V,>(set: (v: V) => void) =>
    (v: V) => {
      set(v)
      setPage(1)
    }

  return (
    <>
      <PageHeader
        title={t.usuarios.title}
        description={t.usuarios.subtitle}
        actions={<Button leading={<UserPlus className="size-4" />}>{t.usuarios.invite}</Button>}
      />

      <div className="animate-rise grid items-start gap-(--stack-y) xl:grid-cols-3">
        <Card padding="none" className="xl:col-span-2">
          <div className="flex flex-col gap-2 p-(--card-p) sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={resetando(setSearch)}
              placeholder={t.usuarios.searchPlaceholder}
              className="sm:max-w-sm sm:flex-1"
            />
            <Select
              size="sm"
              aria-label={t.usuarios.filters.role}
              value={role}
              onChange={(v) => resetando(setRole)(v as Role | '')}
              options={[
                { value: '', label: t.usuarios.filters.allRoles },
                ...roles.map((r) => ({ value: r, label: t.common.roles[r] })),
              ]}
              className="sm:w-44"
            />
          </div>
          <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <DataTable
              columns={columns}
              rows={query.data?.items ?? []}
              rowKey={(u) => u.id}
              loading={query.isPending}
              error={query.isError}
              onRetry={() => void query.refetch()}
              sort={sort}
              onSortChange={resetando(setSort)}
            />
          </div>
          {query.data && query.data.total > 0 && !query.isError && (
            <Pagination page={page} pageSize={PAGE_SIZE} total={query.data.total} onChange={setPage} />
          )}
        </Card>

        <PerfisCard />
      </div>
    </>
  )
}
