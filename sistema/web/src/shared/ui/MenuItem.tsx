import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  onSelect: () => void
  icon?: ReactNode
  /** Opção atual (idioma escolhido, por exemplo): pílula de vidro embutido. */
  active?: boolean
  tone?: 'default' | 'danger'
  children: ReactNode
}

/** Item de `Menu`. O raio é um degrau menor que o do painel (`rounded-xl` dentro de `rounded-2xl`). */
export function MenuItem({ onSelect, icon, active, tone = 'default', children }: Props) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-(--list-y) text-left text-sm outline-none select-none [&>svg]:size-4 [&>svg]:shrink-0',
        'transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        tone === 'danger'
          ? 'text-danger data-[highlighted]:bg-danger-soft'
          : 'text-fg-muted data-[highlighted]:bg-fg/[0.06] data-[highlighted]:text-fg',
        active && 'text-fg glass-inset',
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
    </DropdownMenu.Item>
  )
}
