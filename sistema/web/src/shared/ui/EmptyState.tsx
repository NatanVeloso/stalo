import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

type Props = { title: string; description?: string; icon?: ReactNode; action?: ReactNode }

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-fg/[0.06] text-fg-muted [&>svg]:size-5">
        {icon ?? <Inbox />}
      </span>
      <p className="text-sm font-medium text-fg">{title}</p>
      {description && <p className="max-w-xs text-[13px] text-fg-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
