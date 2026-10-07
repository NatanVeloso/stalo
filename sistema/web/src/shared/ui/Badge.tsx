import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone = 'neutral' | 'ok' | 'warn' | 'danger'

type Props = { tone?: BadgeTone; dot?: boolean; className?: string; children: ReactNode }

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-fg/[0.07] text-fg-muted',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
}

/** Estado em pílula. A cor nunca é a única pista: o texto diz o estado e o ponto reforça. */
export function Badge({ tone = 'neutral', dot = true, className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
