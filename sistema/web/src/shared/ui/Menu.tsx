import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactElement, ReactNode } from 'react'

type Props = {
  /** Botão que abre o menu. Precisa aceitar `ref` e repassar props (`IconButton`, `Button`, `<button>`). */
  trigger: ReactElement
  /** `MenuItem`, `MenuSeparator`, `MenuLabel`. */
  children: ReactNode
  align?: 'start' | 'end'
}

/**
 * Menu suspenso (Radix DropdownMenu): portal (não fica preso no vidro de trás), setas e letras para
 * navegar, Esc e clique fora fecham, o foco volta para o gatilho. Item escolhido fecha o menu.
 * Painel com controles em vez de itens (toggles, campos): use `Popover`.
 */
export function Menu({ trigger, children, align = 'end' }: Props) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          collisionPadding={8}
          className="data-[state=open]:animate-rise z-50 flex min-w-48 glass-strong flex-col gap-0.5 rounded-2xl p-1.5"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
