import { useQuery } from '@tanstack/react-query'
import { usuariosApi } from './api'

export const usuariosKeys = { all: ['usuarios'] as const }

export const useUsuarios = () => useQuery({ queryKey: usuariosKeys.all, queryFn: usuariosApi.list })
