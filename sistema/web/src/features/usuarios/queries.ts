import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { usuariosApi } from './api'
import type { UsuariosFiltro } from './types'

export const usuariosKeys = {
  all: ['usuarios'] as const,
  list: (f: UsuariosFiltro) => [...usuariosKeys.all, 'list', f] as const,
}

/** `placeholderData` mantém a página anterior na tela enquanto a próxima carrega. */
export const useUsuarios = (f: UsuariosFiltro) =>
  useQuery({ queryKey: usuariosKeys.list(f), queryFn: () => usuariosApi.list(f), placeholderData: keepPreviousData })
