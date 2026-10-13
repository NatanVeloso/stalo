import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockLancamentos, paginate } from '@/mocks'
import type { FinanceiroResumo, Lancamento, LancamentosFiltro } from './types'

export const financeiroApi = {
  async list(f: LancamentosFiltro): Promise<Paginated<Lancamento>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.tipo) qs.set('tipo', f.tipo)
      if (f.status) qs.set('status', f.status)
      if (f.search) qs.set('search', f.search)
      if (f.sort) {
        qs.set('sort', f.sort)
        qs.set('order', f.order ?? 'asc')
      }
      return http.get(`/financeiro/lancamentos?${qs}`)
    }

    await fakeDelay()
    const term = f.search?.trim().toLowerCase() ?? ''
    const rows = mockLancamentos.filter(
      (l) =>
        (!f.tipo || l.tipo === f.tipo) &&
        (!f.status || l.status === f.status) &&
        (!term || l.descricao.toLowerCase().includes(term) || (l.cliente?.toLowerCase().includes(term) ?? false)),
    )
    const sort = f.sort
    if (sort) {
      const dir = f.order === 'desc' ? -1 : 1
      rows.sort((a, b) => {
        const va = a[sort] ?? ''
        const vb = b[sort] ?? ''
        return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))) * dir
      })
    }
    return paginate(rows, f.page, f.pageSize)
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
