import type { Role } from '@/shared/auth'

export type Usuario = {
  id: string
  nome: string
  email: string
  role: Role
  status: 'ativo' | 'inativo'
  ultimoAcesso: string | null
}
