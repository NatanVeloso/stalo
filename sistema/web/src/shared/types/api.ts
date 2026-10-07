/** Formatos que o back devolve (ver sistema/DOMINIO.md → Contrato da API). */

export type Paginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type PageQuery = {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export type Id = string
