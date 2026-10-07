import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export const inputClass =
  'h-11 w-full rounded-2xl border border-line bg-fg/[0.03] px-4 text-sm text-fg placeholder:text-fg-subtle transition-[border-color,background-color] duration-200 hover:border-line-strong focus:border-line-strong focus:bg-fg/[0.05] focus:outline-none disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { invalid, leading, trailing, className, ...rest },
  ref,
) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {leading && <span className="pointer-events-none absolute left-4 text-fg-subtle [&>svg]:size-4">{leading}</span>}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          inputClass,
          !!leading && 'pl-11',
          !!trailing && 'pr-11',
          invalid && 'border-danger/60 focus:border-danger',
        )}
        {...rest}
      />
      {trailing && <span className="absolute right-3 flex items-center text-fg-subtle">{trailing}</span>}
    </div>
  )
})
