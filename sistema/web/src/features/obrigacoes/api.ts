import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import { fakeDelay, mockObrigacoes } from '@/mocks'
import type { Obrigacao, ObrigacoesFiltro } from './types'

export const obrigacoesApi = {
  async list(f: ObrigacoesFiltro = {}): Promise<Obrigacao[]> {
    if (!env.mock) return http.get(`/obrigacoes${f.status ? `?status=${f.status}` : ''}`)
    await fakeDelay()
    return mockObrigacoes
      .filter((o) => !f.status || o.status === f.status)
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  },

  async marcarEntregue(id: string): Promise<Obrigacao> {
    if (!env.mock) return http.patch(`/obrigacoes/${id}/entregar`)
    await fakeDelay(500)
    const o = mockObrigacoes.find((o) => o.id === id)
    if (!o) throw new Error('not found')
    o.status = 'entregue'
    o.entregueEm = new Date().toISOString().slice(0, 10)
    return { ...o }
  },
}
