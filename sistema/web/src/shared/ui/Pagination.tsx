import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatNumber } from '@/shared/lib/format'
import { IconButton } from './IconButton'

type Props = { page: number; pageSize: number; total: number; onChange: (page: number) => void }

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const t = useT()
  const locale = useLocale()
  const n = (v: number) => formatNumber(v, locale)
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return (
    <nav
      className="flex items-center justify-between gap-3 px-4 py-(--cell-y) text-small text-fg-muted"
      aria-label={fmt(t.common.table.page, { page: n(page), pages: n(pages) })}
    >
      <span className="tabular">{fmt(t.common.table.showing, { from: n(from), to: n(to), total: n(total) })}</span>
      <div className="flex items-center gap-1">
        <IconButton size="sm" label={t.common.table.previous} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft />
        </IconButton>
        <span className="px-1 tabular">{fmt(t.common.table.page, { page: n(page), pages: n(pages) })}</span>
        <IconButton size="sm" label={t.common.table.next} disabled={page >= pages} onClick={() => onChange(page + 1)}>
          <ChevronRight />
        </IconButton>
      </div>
    </nav>
  )
}
