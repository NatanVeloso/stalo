import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import { fakeDelay, mockLancamentos } from '@/mocks'
import type { FinanceiroResumo, Lancamento, LancamentoTipo } from './types'

export const financeiroApi = {
  async list(tipo?: LancamentoTipo | ''): Promise<Lancamento[]> {
    if (!env.mock) return http.get(`/financeiro/lancamentos${tipo ? `?tipo=${tipo}` : ''}`)
    await fakeDelay()
    return mockLancamentos.filter((l) => !tipo || l.tipo === tipo)
  },

  async resumo(): Promise<FinanceiroResumo> {
    if (!env.mock) return http.get('/financeiro/resumo')
    await fakeDelay(450)
    const sum = (f: (l: Lancamento) => boolean) => mockLancamentos.filter(f).reduce((s, l) => s + l.valor, 0)
    return {
      recebidoMes: sum((l) => l.tipo === 'receita' && l.status === 'pago'),
      aReceber: sum((l) => l.tipo === 'receita' && l.status === 'emAberto'),
      vencido: sum((l) => l.tipo === 'receita' && l.status === 'vencido'),
      despesasMes: sum((l) => l.tipo === 'despesa'),
    }
  },
}
