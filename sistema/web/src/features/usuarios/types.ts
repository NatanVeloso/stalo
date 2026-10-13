import type { Role } from '@/shared/auth'
import type { PageQuery } from '@/shared/types/api'

export type Usuario = {
  id: string
  nome: string
  email: string
  role: Role
  status: 'ativo' | 'inativo'
  ultimoAcesso: string | null
  criadoEm: string
  atualizadoEm: string
}

/** Campos pelos quais `GET /usuarios` aceita `sort`. */
export type UsuarioSort = 'nome' | 'role' | 'ultimoAcesso' | 'status'

/** Query de `GET /usuarios` (DOMINIO.md → Lista paginada). */
export type UsuariosFiltro = Omit<PageQuery, 'sort'> & {
  page: number
  pageSize: number
  role?: Role | ''
  sort?: UsuarioSort
}
