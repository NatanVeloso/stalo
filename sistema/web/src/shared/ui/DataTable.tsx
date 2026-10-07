import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT, fmt } from '@/shared/i18n'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'

export type Column<T> = {
  key: string
  header: string
  /** Renderiza a célula. Padrão: `row[key]`. */
  cell?: (row: T) => ReactNode
  /** Valor usado para ordenar; sem ele a coluna não ordena. */
  sortValue?: (row: T) => string | number | null
  align?: 'left' | 'right'
  className?: string
  /** Esconde abaixo de `md` (colunas secundárias). */
  hideOnMobile?: boolean
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  /** Linhas de skeleton enquanto carrega. */
  skeletonRows?: number
  onRowClick?: (row: T) => void
  empty?: { title: string; description?: string; action?: ReactNode }
  /** Ordenação inicial. */
  defaultSort?: { key: string; order: 'asc' | 'desc' }
  className?: string
}

/**
 * Tabela genérica: ordenação local por coluna, skeleton, estado vazio e
 * linha clicável. Paginação fica fora (ver `Pagination`), porque quem pagina
 * é a API.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  skeletonRows = 6,
  onRowClick,
  empty,
  defaultSort,
  className,
}: Props<T>) {
  const t = useT()
  const [sort, setSort] = useState(defaultSort ?? null)

  const sorted = sort
    ? [...rows].sort((a, b) => {
        const col = columns.find((c) => c.key === sort.key)
        const va = col?.sortValue?.(a) ?? ''
        const vb = col?.sortValue?.(b) ?? ''
        const r = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return sort.order === 'asc' ? r : -r
      })
    : rows

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? (s.order === 'asc' ? { key, order: 'desc' } : null) : { key, order: 'asc' }))

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = !!col.sortValue
              const active = sort?.key === col.key
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cn(
                    'border-b border-line px-3 py-(--head-y) text-left text-xs font-medium whitespace-nowrap text-fg-muted first:pl-4 last:pr-4',
                    col.align === 'right' && 'text-right',
                    col.hideOnMobile && 'hidden md:table-cell',
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      aria-label={fmt(t.common.table.sortBy, { column: col.header })}
                      className={cn('inline-flex items-center gap-1 rounded-md hover:text-fg', active && 'text-fg')}
                    >
                      {col.header}
                      {active ? (
                        sort.order === 'asc' ? (
                          <ArrowUp className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="size-3.5" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-40" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'border-b border-line px-3 py-(--cell-y) first:pl-4 last:pr-4',
                        col.hideOnMobile && 'hidden md:table-cell',
                      )}
                    >
                      <Skeleton className="h-4 w-[70%]" />
                    </td>
                  ))}
                </tr>
              ))
            : sorted.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={cn(
                    'group transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-fg/[0.04] focus-visible:bg-fg/[0.04]',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'border-b border-line px-3 py-(--cell-y) align-middle group-last:border-b-0 first:pl-4 last:pr-4',
                        col.align === 'right' && 'text-right',
                        col.hideOnMobile && 'hidden md:table-cell',
                        col.className,
                      )}
                    >
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!loading && rows.length === 0 && (
        <EmptyState
          title={empty?.title ?? t.common.table.empty}
          description={empty?.description ?? t.common.table.emptyHint}
          action={empty?.action}
        />
      )}
    </div>
  )
}
