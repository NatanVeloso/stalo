import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
  /** `glass` (padrão) para painéis sobre o fundo; `strong` quando há conteúdo atrás (drawer, modal). */
  tone?: 'glass' | 'strong' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// `md` e `sm` seguem a densidade (tokens --card-p); `lg` é para telas de destaque (login)
const paddings = { none: '', sm: 'p-(--card-p)', md: 'p-(--card-p) md:p-(--card-p-lg)', lg: 'p-6 md:p-8' }

/** Painel de vidro com cantos arredondados e reflexo. É a superfície base de tudo. Cabeçalho: `CardHeader`. */
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
