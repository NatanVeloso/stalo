import type { ReactNode } from 'react'

type Props = { title: string; description?: ReactNode; actions?: ReactNode }

/** Cabeçalho padrão de página: título, descrição e ações principais à direita. */
export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="animate-rise mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-(length:--page-title) font-semibold tracking-[-0.02em] text-balance">{title}</h1>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
