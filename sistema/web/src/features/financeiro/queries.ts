import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { financeiroApi } from './api'
import type { LancamentosFiltro } from './types'

export const financeiroKeys = {
  all: ['financeiro'] as const,
  list: (f: LancamentosFiltro) => [...financeiroKeys.all, 'list', f] as const,
  resumo: () => [...financeiroKeys.all, 'resumo'] as const,
}

/** `placeholderData` mantém a página anterior na tela enquanto a próxima carrega (sem pular layout). */
export const useLancamentos = (f: LancamentosFiltro) =>
  useQuery({
    queryKey: financeiroKeys.list(f),
    queryFn: () => financeiroApi.list(f),
    placeholderData: keepPreviousData,
  })
export const useFinanceiroResumo = () => useQuery({ queryKey: financeiroKeys.resumo(), queryFn: financeiroApi.resumo })
