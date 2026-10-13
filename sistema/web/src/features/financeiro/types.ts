import type { PageQuery } from '@/shared/types/api'

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
  criadoEm: string
  atualizadoEm: string
}

/** Campos pelos quais `GET /financeiro/lancamentos` aceita `sort`. */
export type LancamentoSort = 'descricao' | 'cliente' | 'vencimento' | 'valor' | 'status'

/** Query de `GET /financeiro/lancamentos` (DOMINIO.md → Lista paginada). */
export type LancamentosFiltro = Omit<PageQuery, 'sort'> & {
  page: number
  pageSize: number
  tipo?: LancamentoTipo | ''
  status?: LancamentoStatus | ''
  sort?: LancamentoSort
}

export type FinanceiroResumo = { recebidoMes: number; aReceber: number; vencido: number; despesasMes: number }
