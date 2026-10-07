import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { clientesApi } from './api'
import type { ClientesFiltro } from './types'

export const clientesKeys = {
  all: ['clientes'] as const,
  list: (f: ClientesFiltro) => [...clientesKeys.all, 'list', f] as const,
  detail: (id: string) => [...clientesKeys.all, 'detail', id] as const,
}

/** `placeholderData` mantém a lista anterior na tela enquanto a nova página carrega (sem pular layout). */
export const useClientes = (f: ClientesFiltro) =>
  useQuery({ queryKey: clientesKeys.list(f), queryFn: () => clientesApi.list(f), placeholderData: keepPreviousData })

export const useCliente = (id: string | null) =>
  useQuery({ queryKey: clientesKeys.detail(id ?? ''), queryFn: () => clientesApi.get(id!), enabled: !!id })
