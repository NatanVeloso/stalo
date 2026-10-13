import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type SelectOption = { value: string; label: string; disabled?: boolean }

type Props = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Texto quando `value` não bate com nenhuma opção. */
  placeholder?: string
  size?: 'sm' | 'md'
  invalid?: boolean
  disabled?: boolean
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
  className?: string
}

/** O Radix não aceita item com valor vazio; `''` (ex.: "Todos") vira este sentinela por dentro. */
const EMPTY = '__empty__'
const toRadix = (v: string) => (v === '' ? EMPTY : v)
const fromRadix = (v: string) => (v === EMPTY ? '' : v)

/**
 * Select (Radix): mesma cara do `Input`, lista em vidro, navegação por teclado e
 * busca por digitação. Use com `Field` quando tiver rótulo visível. Para muitas
 * opções com busca por texto, criar um `Combobox`.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  size = 'md',
  invalid,
  disabled,
  id,
  className,
  ...aria
}: Props) {
  return (
    <RadixSelect.Root value={toRadix(value)} onValueChange={(v) => onChange(fromRadix(v))} disabled={disabled}>
      <RadixSelect.Trigger
        id={id}
        aria-label={aria['aria-label']}
        aria-describedby={aria['aria-describedby']}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-2xl border border-line bg-fg/[0.03] px-4 text-left text-sm text-fg transition-[border-color,background-color] duration-200 outline-none hover:border-line-strong focus-visible:border-line-strong disabled:opacity-50 data-[placeholder]:text-fg-subtle data-[state=open]:border-line-strong',
          size === 'sm' ? 'h-9 rounded-xl px-3 text-[13px]' : 'h-11',
          invalid && 'border-danger/60',
          className,
        )}
      >
        <span className="truncate">
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon asChild>
          <ChevronDown
            className="size-4 shrink-0 text-fg-subtle transition-transform [[data-state=open]_&]:rotate-180"
            aria-hidden="true"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          collisionPadding={8}
          className="data-[state=open]:animate-rise z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-2xl p-1.5 glass-strong"
        >
          <RadixSelect.Viewport className="flex flex-col gap-0.5">
            {options.map((o) => (
              <RadixSelect.Item
                key={o.value}
                value={toRadix(o.value)}
                disabled={o.disabled}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-fg-muted outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-fg/[0.06] data-[highlighted]:text-fg data-[state=checked]:text-fg"
              >
                <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check className="size-4" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
