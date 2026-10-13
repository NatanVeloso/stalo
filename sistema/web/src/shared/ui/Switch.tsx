import * as RadixSwitch from '@radix-ui/react-switch'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = Omit<ComponentPropsWithoutRef<typeof RadixSwitch.Root>, 'onCheckedChange' | 'onChange'> & {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Obrigatório quando não há `<label>` visível apontando para o switch. */
  'aria-label'?: string
}

/**
 * Liga/desliga (Radix Switch). Trilho `bg-accent` quando ligado, bolinha `bg-accent-fg`;
 * teclado (Espaço) e `aria-checked` vêm do primitivo. Visual monocromático.
 */
export const Switch = forwardRef<HTMLButtonElement, Props>(function Switch(
  { checked, onChange, className, ...rest },
  ref,
) {
  return (
    <RadixSwitch.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        'bg-fg/[0.18] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent',
        className,
      )}
      {...rest}
    >
      <RadixSwitch.Thumb
        className={cn(
          'block size-4 translate-x-0.5 rounded-full bg-bg-elevated shadow-sm transition-transform duration-200',
          'data-[state=checked]:translate-x-[1.125rem] data-[state=checked]:bg-accent-fg',
        )}
      />
    </RadixSwitch.Root>
  )
})
