export type RegimeTributario = 'simples' | 'presumido' | 'real' | 'mei'
export type ClienteStatus = 'ativo' | 'inativo'

export type Cliente = {
  id: string
  razaoSocial: string
  nomeFantasia: string
  /** Só dígitos; a máscara é do front (formatCnpj). */
  cnpj: string
  regime: RegimeTributario
  responsavelId: string
  responsavel: string
  /** Honorário mensal em BRL. */
  honorario: number
  status: ClienteStatus
  desde: string
  email: string
  telefone: string
  cidade: string
  obrigacoesAbertas: number
  documentos: number
  ultimaEntrega: string | null
  criadoEm: string
  atualizadoEm: string
}

/** Campos aceitos em `sort` (ordenação no servidor). */
export type ClientesSort = 'nomeFantasia' | 'regime' | 'responsavel' | 'honorario' | 'desde' | 'status'

/** Query de `GET /clientes` (DOMINIO.md → Lista paginada). */
export type ClientesFiltro = {
  page: number
  pageSize: number
  search?: string
  sort?: ClientesSort
  order?: 'asc' | 'desc'
  regime?: RegimeTributario | ''
  status?: ClienteStatus | ''
}
