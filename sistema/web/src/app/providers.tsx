import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import { TooltipProvider } from '@/shared/ui'

/**
 * Provedores globais. TanStack Query cuida de todo dado que vem da API (cache, loading, refetch);
 * Zustand cuida só de estado de cliente (auth, prefs). O `queryClient` é único e mora em
 * `shared/lib` para o logout conseguir limpá-lo. TooltipProvider compartilha o atraso de abertura.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}
