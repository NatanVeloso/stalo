import { useQuery } from '@tanstack/react-query'
import { financeiroApi } from './api'
import type { LancamentoTipo } from './types'

export const financeiroKeys = {
  all: ['financeiro'] as const,
  list: (tipo: LancamentoTipo | '') => [...financeiroKeys.all, 'list', tipo] as const,
  resumo: () => [...financeiroKeys.all, 'resumo'] as const,
}

export const useLancamentos = (tipo: LancamentoTipo | '') =>
  useQuery({ queryKey: financeiroKeys.list(tipo), queryFn: () => financeiroApi.list(tipo) })
export const useFinanceiroResumo = () => useQuery({ queryKey: financeiroKeys.resumo(), queryFn: financeiroApi.resumo })
