import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
  /** `glass` (padrão) para painéis sobre o fundo; `strong` quando há conteúdo atrás (drawer, modal). */
  tone?: 'glass' | 'strong' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// `md` e `sm` seguem a densidade (tokens --card-p); `lg` é para telas de destaque (login)
const paddings = { none: '', sm: 'p-(--card-p)', md: 'p-(--card-p) md:p-(--card-p-lg)', lg: 'p-6 md:p-8' }

/** Painel de vidro com cantos arredondados e reflexo. É a superfície base de tudo. */
export function Card({ tone = 'glass', padding = 'md', className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'relative isolate rounded-3xl',
        tone === 'glass' && 'glass',
        tone === 'strong' && 'glass-strong',
        tone === 'flat' && 'border border-line bg-bg-elevated',
        paddings[padding],
        className,
      )}
      {...rest}
    >
      {tone !== 'flat' && <span className="glass-sheen -z-10" aria-hidden="true" />}
      {children}
    </div>
  )
}

type HeaderProps = {
  title: ReactNode
  description?: ReactNode
  /** Ações à direita (botões, filtros). */
  actions?: ReactNode
  className?: string
}

export function CardHeader({ title, description, actions, className }: HeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
