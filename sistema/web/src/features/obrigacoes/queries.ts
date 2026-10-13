import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '@/features/dashboard'
import { clientesKeys } from '@/features/clientes'
import { obrigacoesApi } from './api'
import type { ObrigacoesFiltro } from './types'

export const obrigacoesKeys = {
  all: ['obrigacoes'] as const,
  list: (f: ObrigacoesFiltro) => [...obrigacoesKeys.all, 'list', f] as const,
  contagem: (search: string) => [...obrigacoesKeys.all, 'contagem', search] as const,
}

/** `placeholderData` mantém a página anterior na tela enquanto a nova carrega (sem pular layout). */
export const useObrigacoes = (f: ObrigacoesFiltro) =>
  useQuery({
    queryKey: obrigacoesKeys.list(f),
    queryFn: () => obrigacoesApi.list(f),
    placeholderData: keepPreviousData,
  })

export const useObrigacoesContagem = (search = '') =>
  useQuery({
    queryKey: obrigacoesKeys.contagem(search),
    queryFn: () => obrigacoesApi.contagem(search),
    placeholderData: keepPreviousData,
  })

/**
 * Ao entregar, invalida as listas e contagens do módulo, o dashboard (vencimentos e KPIs) e os
 * clientes (`obrigacoesAbertas` e `ultimaEntrega` mudam).
 */
export function useMarcarEntregue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: obrigacoesApi.marcarEntregue,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: obrigacoesKeys.all })
      void qc.invalidateQueries({ queryKey: dashboardKeys.all })
      void qc.invalidateQueries({ queryKey: clientesKeys.all })
    },
  })
}
