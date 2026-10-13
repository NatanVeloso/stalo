export type TipoObrigacao = 'DAS' | 'DCTF' | 'EFD' | 'SPED' | 'GFIP' | 'ESOCIAL' | 'DEFIS' | 'ECD' | 'DIRF' | 'FOLHA'
export type ObrigacaoStatus = 'pendente' | 'entregue' | 'atrasada'

export type Obrigacao = {
  id: string
  tipo: TipoObrigacao
  clienteId: string
  cliente: string
  /** YYYY-MM */
  competencia: string
  /** YYYY-MM-DD */
  vencimento: string
  responsavel: string
  status: ObrigacaoStatus
  /** YYYY-MM-DD */
  entregueEm: string | null
  criadoEm: string
  atualizadoEm: string
}

/** Campos aceitos em `sort` (ordenação no servidor). */
export type ObrigacoesSort = 'tipo' | 'cliente' | 'competencia' | 'vencimento' | 'responsavel' | 'status'

/** Query de `GET /obrigacoes` (DOMINIO.md → Lista paginada). */
export type ObrigacoesFiltro = {
  page: number
  pageSize: number
  search?: string
  sort?: ObrigacoesSort
  order?: 'asc' | 'desc'
  status?: ObrigacaoStatus | ''
}

/** `GET /obrigacoes/contagem?search=`: totais por status para as abas, com a mesma busca da lista. */
export type ObrigacoesContagem = Record<ObrigacaoStatus, number> & { total: number }
