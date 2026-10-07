import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from './api'

/** Chaves de cache do módulo. Invalidar com `queryClient.invalidateQueries({ queryKey: dashboardKeys.all })`. */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  resumo: () => [...dashboardKeys.all, 'resumo'] as const,
  receita: () => [...dashboardKeys.all, 'receita'] as const,
  vencimentos: () => [...dashboardKeys.all, 'vencimentos'] as const,
  atividades: () => [...dashboardKeys.all, 'atividades'] as const,
}

export const useResumo = () => useQuery({ queryKey: dashboardKeys.resumo(), queryFn: dashboardApi.resumo })
export const useReceitaMensal = () =>
  useQuery({ queryKey: dashboardKeys.receita(), queryFn: dashboardApi.receitaMensal })
export const useProximosVencimentos = () =>
  useQuery({ queryKey: dashboardKeys.vencimentos(), queryFn: dashboardApi.proximosVencimentos })
export const useAtividades = () => useQuery({ queryKey: dashboardKeys.atividades(), queryFn: dashboardApi.atividades })
