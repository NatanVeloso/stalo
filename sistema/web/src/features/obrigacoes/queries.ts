import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { obrigacoesApi } from './api'
import type { ObrigacoesFiltro } from './types'

export const obrigacoesKeys = {
  all: ['obrigacoes'] as const,
  list: (f: ObrigacoesFiltro) => [...obrigacoesKeys.all, 'list', f] as const,
}

export const useObrigacoes = (f: ObrigacoesFiltro = {}) =>
  useQuery({ queryKey: obrigacoesKeys.list(f), queryFn: () => obrigacoesApi.list(f) })

/** Ao entregar, invalida as listas do módulo e o dashboard (vencimentos e KPIs mudam). */
export function useMarcarEntregue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: obrigacoesApi.marcarEntregue,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: obrigacoesKeys.all })
      void qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
