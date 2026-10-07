import { cn } from '@/shared/lib/cn'

/** Placeholder de carregamento. Mesma forma do conteúdo que vai substituir, para não pular layout. */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={cn('block animate-pulse rounded-xl bg-fg/[0.08]', className)} style={style} aria-hidden="true" />
  )
}
