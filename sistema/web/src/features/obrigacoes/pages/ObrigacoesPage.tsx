import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { usePermission, useRole } from '@/shared/auth'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { PageHeader } from '@/shared/layout'
import { Button, Card, DataTable, Pagination, SearchInput, Segmented, type SortState } from '@/shared/ui'
import { useObrigacoes, useObrigacoesContagem } from '../queries'
import type { ObrigacaoStatus, ObrigacoesSort } from '../types'
import { obrigacoesColumns } from '../components/obrigacoesColumns'

type Tab = 'todas' | ObrigacaoStatus

const PAGE_SIZE = 20

export function ObrigacoesPage() {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('obrigacoes:editar')
  const isCliente = useRole() === 'cliente'
  const [tab, setTab] = useState<Tab>('todas')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'vencimento', order: 'asc' })
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search)

  const query = useObrigacoes({
    page,
    pageSize: PAGE_SIZE,
    search: debounced,
    // a key da coluna é o nome do campo na API (ver obrigacoesColumns)
    sort: sort?.key as ObrigacoesSort | undefined,
    order: sort?.order,
    status: tab === 'todas' ? '' : tab,
  })
  const contagem = useObrigacoesContagem(debounced)
  const c = contagem.data

  // trocar aba, busca ou ordem muda o conjunto: volta para a primeira página
  const resetPage =
    <V,>(set: (v: V) => void) =>
    (v: V) => {
      set(v)
      setPage(1)
    }

  return (
    <>
      <PageHeader
        title={t.obrigacoes.title}
        description={t.obrigacoes.subtitle}
        actions={podeEditar && <Button leading={<Plus className="size-4" />}>{t.obrigacoes.new}</Button>}
      />

      <Card padding="none" className="animate-rise">
        <div className="flex flex-wrap items-center justify-between gap-(--list-gap) p-(--card-p)">
          <Segmented<Tab>
            label={t.obrigacoes.columns.status}
            value={tab}
            onChange={resetPage(setTab)}
            options={[
              { value: 'todas', label: t.obrigacoes.tabs.todas, count: c?.total },
              { value: 'pendente', label: t.obrigacoes.tabs.pendentes, count: c?.pendente },
              { value: 'atrasada', label: t.obrigacoes.tabs.atrasadas, count: c?.atrasada },
              { value: 'entregue', label: t.obrigacoes.tabs.entregues, count: c?.entregue },
            ]}
          />
          <SearchInput
            value={search}
            onChange={resetPage(setSearch)}
            placeholder={isCliente ? t.obrigacoes.searchPlaceholderCliente : t.obrigacoes.searchPlaceholder}
            className="w-full md:max-w-xs"
          />
          {c && (
            <p className="text-small text-fg-muted tabular">
              {fmt(t.obrigacoes.summary, { pendentes: c.pendente, atrasadas: c.atrasada })}
            </p>
          )}
        </div>
        <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <DataTable
            columns={obrigacoesColumns({ t, locale, podeEditar, isCliente })}
            rows={query.data?.items ?? []}
            rowKey={(o) => o.id}
            loading={query.isPending}
            error={query.isError}
            onRetry={() => void query.refetch()}
            empty={{ title: t.obrigacoes.empty }}
            sort={sort}
            onSortChange={resetPage(setSort)}
          />
        </div>
        {query.data && query.data.total > 0 && (
          <Pagination page={page} pageSize={PAGE_SIZE} total={query.data.total} onChange={setPage} />
        )}
      </Card>
    </>
  )
}
