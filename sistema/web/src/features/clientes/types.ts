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
}

export type ClientesFiltro = {
  search?: string
  regime?: RegimeTributario | ''
  status?: ClienteStatus | ''
  page: number
  pageSize: number
}
