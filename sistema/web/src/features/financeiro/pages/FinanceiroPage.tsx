import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { PageHeader } from '@/shared/layout'
import { Button, Card, DataTable, Pagination, SearchInput, Segmented, Select, type SortState } from '@/shared/ui'
import { useLancamentos } from '../queries'
import type { LancamentoSort, LancamentoStatus, LancamentoTipo } from '../types'
import { ResumoTiles } from '../components/ResumoTiles'
import { useLancamentoColumns } from '../components/useLancamentoColumns'

const PAGE_SIZE = 10
const statuses: LancamentoStatus[] = ['pago', 'emAberto', 'vencido']

export function FinanceiroPage() {
  const t = useT()
  const podeEditar = usePermission('financeiro:editar')
  const columns = useLancamentoColumns()
  const [tipo, setTipo] = useState<LancamentoTipo | ''>('')
  const [status, setStatus] = useState<LancamentoStatus | ''>('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search)

  const list = useLancamentos({
    page,
    pageSize: PAGE_SIZE,
    tipo,
    status,
    search: debounced,
    sort: sort?.key as LancamentoSort | undefined,
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
        title={t.financeiro.title}
        description={t.financeiro.subtitle}
        actions={podeEditar && <Button leading={<Plus className="size-4" />}>{t.financeiro.new}</Button>}
      />

      <ResumoTiles />

      <Card padding="none" className="animate-rise mt-(--stack-y)">
        <div className="flex flex-col gap-3 p-(--card-p) lg:flex-row lg:items-center">
          <Segmented<LancamentoTipo | ''>
            label={t.financeiro.filters.tipo}
            value={tipo}
            onChange={resetando(setTipo)}
            options={[
              { value: '', label: t.financeiro.tabs.todos },
              { value: 'receita', label: t.financeiro.tabs.receitas },
              { value: 'despesa', label: t.financeiro.tabs.despesas },
            ]}
          />
          <div className="flex flex-1 flex-col gap-2 sm:flex-row lg:justify-end">
            <SearchInput
              value={search}
              onChange={resetando(setSearch)}
              placeholder={t.financeiro.searchPlaceholder}
              className="sm:max-w-xs sm:flex-1"
            />
            <Select
              size="sm"
              aria-label={t.financeiro.filters.status}
              value={status}
              onChange={(v) => resetando(setStatus)(v as LancamentoStatus | '')}
              options={[
                { value: '', label: t.financeiro.filters.allStatus },
                ...statuses.map((s) => ({ value: s, label: t.common.status[s] })),
              ]}
              className="sm:w-44"
            />
          </div>
        </div>

        <div className={list.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            columns={columns}
            rows={list.data?.items ?? []}
            rowKey={(l) => l.id}
            loading={list.isPending}
            error={list.isError}
            onRetry={() => void list.refetch()}
            sort={sort}
            onSortChange={resetando(setSort)}
          />
        </div>
        {list.data && list.data.total > 0 && !list.isError && (
          <Pagination page={page} pageSize={PAGE_SIZE} total={list.data.total} onChange={setPage} />
        )}
      </Card>
    </>
  )
}
