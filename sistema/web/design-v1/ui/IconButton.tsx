import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Tooltip } from './Tooltip'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Obrigatório: é o único texto do botão para leitores de tela (traduzido) e vira o tooltip. */
  label: string
  variant?: 'glass' | 'ghost'
  size?: 'sm' | 'md'
  active?: boolean
  /** Desliga o tooltip (ex.: quando o botão abre um menu com o mesmo texto). */
  tooltip?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  {
    label,
    variant = 'ghost',
    size = 'md',
    active = false,
    tooltip = true,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <Tooltip content={tooltip ? label : null}>
      <button
        ref={ref}
        type={type}
        aria-label={label}
        aria-pressed={active || undefined}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
          size === 'sm' ? 'size-8 [&>svg]:size-4' : 'size-10 [&>svg]:size-[18px]',
          variant === 'glass' ? 'text-fg glass hover:bg-fg/[0.06]' : 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
          active && 'bg-fg/[0.08] text-fg',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    </Tooltip>
  )
})
