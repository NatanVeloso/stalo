export type LancamentoTipo = 'receita' | 'despesa'
export type LancamentoStatus = 'pago' | 'emAberto' | 'vencido'
export type LancamentoCategoria = 'honorario' | 'abertura' | 'consultoria' | 'software' | 'aluguel' | 'folha' | 'outros'

export type Lancamento = {
  id: string
  tipo: LancamentoTipo
  descricao: string
  clienteId: string | null
  cliente: string | null
  categoria: LancamentoCategoria
  vencimento: string
  valor: number
  status: LancamentoStatus
}

export type FinanceiroResumo = { recebidoMes: number; aReceber: number; vencido: number; despesasMes: number }
