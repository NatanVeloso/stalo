export type TipoObrigacao = 'DAS' | 'DCTF' | 'EFD' | 'SPED' | 'GFIP' | 'ESOCIAL' | 'DEFIS' | 'ECD' | 'DIRF' | 'FOLHA'
export type ObrigacaoStatus = 'pendente' | 'entregue' | 'atrasada'

export type Obrigacao = {
  id: string
  tipo: TipoObrigacao
  clienteId: string
  cliente: string
  /** YYYY-MM */
  competencia: string
  vencimento: string
  responsavel: string
  status: ObrigacaoStatus
  entregueEm: string | null
}

export type ObrigacoesFiltro = { status?: ObrigacaoStatus | '' }
