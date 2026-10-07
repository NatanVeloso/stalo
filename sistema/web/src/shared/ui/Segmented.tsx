import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type SegmentOption<V extends string> = { value: V; label: ReactNode; count?: number; icon?: ReactNode }

type Props<V extends string> = {
  value: V
  onChange: (value: V) => void
  options: SegmentOption<V>[]
  /** Nome do grupo para leitores de tela (traduzido). */
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/** Controle segmentado (abas curtas, filtros, tema). A opção ativa vira uma pílula sólida. */
export function Segmented<V extends string>({ value, onChange, options, label, size = 'md', className }: Props<V>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-fg/[0.05] p-1',
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 [&>svg]:size-4',
              size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-3.5 text-[13px]',
              active ? 'bg-bg-elevated text-fg shadow-[0_2px_8px_rgba(0,0,0,0.12)]' : 'text-fg-muted hover:text-fg',
            )}
          >
            {o.icon}
            {o.label}
            {o.count !== undefined && (
              <span className={cn('rounded-full px-1.5 text-[11px] tabular', active ? 'bg-fg/[0.08]' : 'bg-fg/[0.06]')}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
