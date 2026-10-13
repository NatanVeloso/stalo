import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg shadow-accent hover:opacity-90',
  secondary: 'glass-inset text-fg hover:border-line-strong',
  ghost: 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
  danger: 'bg-danger-soft text-danger hover:bg-danger/20',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-small gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-title gap-2',
}

/** Classes do botão, compartilhadas entre `Button` (ação) e `LinkButton` (navegação). */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-[background-color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&>svg]:shrink-0',
    variants[variant],
    sizes[size],
    className,
  )
}
