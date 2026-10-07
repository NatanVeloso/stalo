import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/shared/ui/Tooltip'

/**
 * Provedores globais. TanStack Query cuida de todo dado que vem da API
 * (cache, loading, refetch); Zustand cuida só de estado de cliente (auth, prefs).
 * TooltipProvider compartilha o atraso de abertura entre todos os tooltips.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  )
  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}
