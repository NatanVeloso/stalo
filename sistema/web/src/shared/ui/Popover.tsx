import * as RadixPopover from '@radix-ui/react-popover'
import type { ReactElement, ReactNode } from 'react'

type Props = {
  /** Botão que abre o painel. Precisa aceitar `ref` e repassar props (`IconButton`, `Button`). */
  trigger: ReactElement
  /** Nome do painel para leitor de tela (traduzido). */
  label: string
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

/**
 * Painel flutuante com controles (toggles, campos), em vidro forte e portal. Radix cuida de foco,
 * Esc, clique fora e posicionamento. Lista de ações: use `Menu`.
 */
export function Popover({ trigger, label, children, align = 'end' }: Props) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          aria-label={label}
          align={align}
          sideOffset={8}
          collisionPadding={8}
          className="data-[state=open]:animate-rise z-50 glass-strong rounded-2xl p-1.5"
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
