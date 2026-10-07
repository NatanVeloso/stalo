import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  /** Texto traduzido. Sem conteúdo, o filho é renderizado sem tooltip. */
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

/**
 * Tooltip (Radix). O filho precisa aceitar `ref` e repassar props (botão nativo,
 * `IconButton`, `Button`). Abre no hover e no foco; fecha com Esc. Para rótulo
 * de acessibilidade continue usando `aria-label`: o tooltip é só visual.
 */
export function Tooltip({ content, children, side = 'top', align = 'center', className }: Props) {
  if (!content) return <>{children}</>
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            'z-50 max-w-xs rounded-xl px-2.5 py-1.5 text-xs font-medium text-fg glass-strong',
            'data-[state=delayed-open]:animate-rise',
            className,
          )}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}

/** Montar uma vez em `app/providers.tsx`. `delayDuration` curto e `skipDelayDuration` para a sequência de ícones. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={350} skipDelayDuration={250}>
      {children}
    </RadixTooltip.Provider>
  )
}
