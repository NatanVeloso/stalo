import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Card } from './Card'
import { Skeleton } from './Skeleton'

type Props = {
  label: string
  value?: ReactNode
  icon?: ReactNode
  /**
   * Variação vs. período anterior. `value` (pontos percentuais) decide a direção; `text` é o mesmo
   * número já formatado pela página (`formatPercent(v, locale, { signed: true })`).
   * `upIsGood=false` para métricas onde subir é ruim (atrasos).
   */
  delta?: { value: number; text: string; label: string; upIsGood?: boolean }
  loading?: boolean
  /** Luz colorida no lado direito, a meia altura (só nos indicadores do dashboard, uma cor por card). */
  light?: StatLight
}

export type StatLight = 'blue' | 'pink' | 'amber' | 'mint'

const lights: Record<StatLight, string> = {
  blue: 'glass-light-blue',
  pink: 'glass-light-pink',
  amber: 'glass-light-amber',
  mint: 'glass-light-mint',
}

/** Indicador de dashboard: rótulo, número grande e variação com direção visível (ícone + sinal, não só cor). */
export function StatTile({ label, value, icon, delta, loading, light }: Props) {
  const up = (delta?.value ?? 0) >= 0
  const good = delta ? (delta.upIsGood ?? true) === up : true
  return (
    <Card padding="sm" className={cn('flex min-h-(--tile-h) flex-col justify-between', light && lights[light])}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-small font-medium text-fg-muted">{label}</span>
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
          <p className="text-(length:--tile-value) leading-none font-semibold tracking-[-0.02em] text-fg tabular">
            {value}
          </p>
        )}
        {delta && !loading && (
          <p className={cn('mt-2 flex items-center gap-1 text-xs', good ? 'text-ok' : 'text-danger')}>
            {up ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            <span className="font-medium tabular">{delta.text}</span>
            <span className="text-fg-subtle">{delta.label}</span>
          </p>
        )}
      </div>
    </Card>
  )
}
