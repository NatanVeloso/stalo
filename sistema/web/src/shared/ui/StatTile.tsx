import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Card } from './Card'
import { Skeleton } from './Skeleton'

type Props = {
  label: string
  value?: ReactNode
  icon?: ReactNode
  /** Variação em % vs. período anterior. `upIsGood=false` para métricas onde subir é ruim (atrasos). */
  delta?: { value: number; label: string; upIsGood?: boolean }
  loading?: boolean
}

/** Indicador de dashboard: rótulo, número grande e variação com direção visível (ícone + sinal, não só cor). */
export function StatTile({ label, value, icon, delta, loading }: Props) {
  const up = (delta?.value ?? 0) >= 0
  const good = delta ? (delta.upIsGood ?? true) === up : true
  return (
    <Card padding="sm" className="flex min-h-(--tile-h) flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-fg-muted">{label}</span>
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-xl bg-fg/[0.06] text-fg-muted [&>svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="text-(length:--tile-value) leading-none font-semibold tracking-[-0.02em] text-fg">{value}</p>
        )}
        {delta && !loading && (
          <p className={cn('mt-2 flex items-center gap-1 text-xs', good ? 'text-ok' : 'text-danger')}>
            {up ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            <span className="font-medium tabular">
              {up ? '+' : ''}
              {delta.value.toFixed(1)}%
            </span>
            <span className="text-fg-subtle">{delta.label}</span>
          </p>
        )}
      </div>
    </Card>
  )
}
