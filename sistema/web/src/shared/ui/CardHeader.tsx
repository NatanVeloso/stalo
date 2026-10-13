import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  title: ReactNode
  description?: ReactNode
  /** Ações à direita (botões, filtros). */
  actions?: ReactNode
  className?: string
}

/** Título + descrição de um `Card`, com ações à direita. O espaço abaixo segue a densidade. */
export function CardHeader({ title, description, actions, className }: Props) {
  return (
    <div className={cn('mb-(--card-head-mb) flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-title font-semibold tracking-[-0.01em] text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-small text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
