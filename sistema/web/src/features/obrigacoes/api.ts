import { env } from '@/shared/lib/env'
import { ApiError, http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockClientes, mockObrigacoes, paginate } from '@/mocks'
import type { Obrigacao, ObrigacoesContagem, ObrigacoesFiltro } from './types'

/** Busca do mock: tipo, cliente ou responsável (o back faz o mesmo no servidor). */
function buscar(rows: Obrigacao[], search?: string) {
  const term = search?.trim().toLowerCase() ?? ''
  if (!term) return rows
  return rows.filter((o) => [o.tipo, o.cliente, o.responsavel].some((v) => v.toLowerCase().includes(term)))
}

export const obrigacoesApi = {
  async list(f: ObrigacoesFiltro): Promise<Paginated<Obrigacao>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.search) qs.set('search', f.search)
      if (f.sort) qs.set('sort', f.sort)
      if (f.sort && f.order) qs.set('order', f.order)
      if (f.status) qs.set('status', f.status)
      return http.get(`/obrigacoes?${qs}`)
    }
    await fakeDelay()
    const rows = buscar(mockObrigacoes, f.search).filter((o) => !f.status || o.status === f.status)
    const sort = f.sort ?? 'vencimento'
    const dir = (f.sort ? (f.order ?? 'asc') : 'asc') === 'asc' ? 1 : -1
    rows.sort((a, b) => dir * a[sort].localeCompare(b[sort]) || a.vencimento.localeCompare(b.vencimento))
    return paginate(rows, f.page, f.pageSize)
  },

  async contagem(search?: string): Promise<ObrigacoesContagem> {
    if (!env.mock) return http.get(`/obrigacoes/contagem${search ? `?${new URLSearchParams({ search })}` : ''}`)
    await fakeDelay(300)
    const rows = buscar(mockObrigacoes, search)
    const n = (s: Obrigacao['status']) => rows.filter((o) => o.status === s).length
    return { pendente: n('pendente'), entregue: n('entregue'), atrasada: n('atrasada'), total: rows.length }
  },

  async marcarEntregue(id: string): Promise<Obrigacao> {
    if (!env.mock) return http.patch(`/obrigacoes/${id}/entregar`)
    await fakeDelay(500)
    const o = mockObrigacoes.find((o) => o.id === id)
    if (!o) throw new ApiError(404, 'resource/not-found', 'Obrigação não encontrada')
    const agora = new Date().toISOString()
    o.status = 'entregue'
    o.entregueEm = agora.slice(0, 10)
    o.atualizadoEm = agora
    // o back atualiza os agregados do cliente na mesma transação
    const c = mockClientes.find((c) => c.id === o.clienteId)
    if (c) {
      c.obrigacoesAbertas = Math.max(0, c.obrigacoesAbertas - 1)
      c.ultimaEntrega = o.entregueEm
      c.atualizadoEm = agora
    }
    return { ...o }
  },
}
