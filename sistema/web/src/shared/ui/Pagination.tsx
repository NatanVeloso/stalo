import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT, fmt } from '@/shared/i18n'
import { IconButton } from './IconButton'

type Props = { page: number; pageSize: number; total: number; onChange: (page: number) => void }

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const t = useT()
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return (
    <nav
      className="flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-fg-muted"
      aria-label={fmt(t.common.table.page, { page, pages })}
    >
      <span className="tabular">{fmt(t.common.table.showing, { from, to, total })}</span>
      <div className="flex items-center gap-1">
        <IconButton size="sm" label={t.common.table.previous} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft />
        </IconButton>
        <span className="px-1 tabular">{fmt(t.common.table.page, { page, pages })}</span>
        <IconButton size="sm" label={t.common.table.next} disabled={page >= pages} onClick={() => onChange(page + 1)}>
          <ChevronRight />
        </IconButton>
      </div>
    </nav>
  )
}
