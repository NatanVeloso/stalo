import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

export type Column<T> = {
  key: string
  /** Rótulo da coluna (traduzido). Sempre preencha, mesmo na coluna de ações: vira texto do leitor de tela. */
  header: string
  /** Esconde o rótulo na tela, mas mantém para leitor de tela (coluna de ações). */
  hideHeader?: boolean
  /** Renderiza a célula. Padrão: `row[key]`. */
  cell?: (row: T) => ReactNode
  /** Valor usado para ordenar no modo local; sem ele a coluna não ordena. */
  sortValue?: (row: T) => string | number | null
  /** Modo controlado: a coluna ordena no servidor por este campo (sem `sortValue`). */
  sortable?: boolean
  align?: 'left' | 'right'
  className?: string
  /** Esconde abaixo de `md` (colunas secundárias). */
  hideOnMobile?: boolean
}

export type SortState = { key: string; order: 'asc' | 'desc' } | null

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  /** Falha ao carregar: mostra `ErrorState` no lugar das linhas (e não o estado vazio). */
  error?: boolean
  onRetry?: () => void
  /** Linhas de skeleton enquanto carrega. */
  skeletonRows?: number
  onRowClick?: (row: T) => void
  empty?: { title: string; description?: string; action?: ReactNode }
  /** Ordenação inicial (modo local). */
  defaultSort?: { key: string; order: 'asc' | 'desc' }
  /**
   * Modo controlado, para lista paginada no servidor: a tabela não reordena as linhas, só avisa.
   * Quem usa manda `sort`/`order` para a API (DOMINIO.md → Lista paginada) e volta para a página 1.
   */
  sort?: SortState
  onSortChange?: (sort: SortState) => void
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
  error,
  onRetry,
  skeletonRows = 6,
  onRowClick,
  empty,
  defaultSort,
  sort: controlledSort,
  onSortChange,
  className,
}: Props<T>) {
  const t = useT()
  const locale = useLocale()
  const [localSort, setLocalSort] = useState<SortState>(defaultSort ?? null)
  const controlled = onSortChange !== undefined
  const sort = controlled ? (controlledSort ?? null) : localSort

  // no modo controlado as linhas já chegam ordenadas pela API
  const sorted =
    !controlled && sort
      ? [...rows].sort((a, b) => {
          const col = columns.find((c) => c.key === sort.key)
          const va = col?.sortValue?.(a) ?? ''
          const vb = col?.sortValue?.(b) ?? ''
          const r =
            typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), locale)
          return sort.order === 'asc' ? r : -r
        })
      : rows

  // ciclo de cada coluna: crescente → decrescente → sem ordenação
  const toggleSort = (key: string) => {
    const next: SortState =
      sort?.key === key ? (sort.order === 'asc' ? { key, order: 'desc' } : null) : { key, order: 'asc' }
    if (controlled) onSortChange(next)
    else setLocalSort(next)
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = !!col.sortValue || !!col.sortable
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
                  ) : col.hideHeader ? (
                    <span className="sr-only">{col.header}</span>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {error
            ? null
            : loading
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
      {error && <ErrorState onRetry={onRetry} />}
      {!error && !loading && rows.length === 0 && (
        <EmptyState
          title={empty?.title ?? t.common.table.empty}
          description={empty?.description ?? t.common.table.emptyHint}
          action={empty?.action}
        />
      )}
    </div>
  )
}
