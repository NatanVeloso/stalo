import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

/** Montar uma vez em `app/providers.tsx`. `delayDuration` curto e `skipDelayDuration` para a sequência de ícones. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={350} skipDelayDuration={250}>
      {children}
    </RadixTooltip.Provider>
  )
}
