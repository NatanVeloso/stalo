import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockClientes } from '@/mocks'
import type { Cliente, ClientesFiltro } from './types'

export const clientesApi = {
  async list(f: ClientesFiltro): Promise<Paginated<Cliente>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.search) qs.set('search', f.search)
      if (f.regime) qs.set('regime', f.regime)
      if (f.status) qs.set('status', f.status)
      return http.get(`/clientes?${qs}`)
    }
    await fakeDelay()
    const term = f.search?.trim().toLowerCase() ?? ''
    const digits = term.replace(/\D/g, '')
    const items = mockClientes.filter(
      (c) =>
        (!term ||
          c.razaoSocial.toLowerCase().includes(term) ||
          c.nomeFantasia.toLowerCase().includes(term) ||
          (digits && c.cnpj.includes(digits))) &&
        (!f.regime || c.regime === f.regime) &&
        (!f.status || c.status === f.status),
    )
    const start = (f.page - 1) * f.pageSize
    return { items: items.slice(start, start + f.pageSize), page: f.page, pageSize: f.pageSize, total: items.length }
  },

  async get(id: string): Promise<Cliente> {
    if (!env.mock) return http.get(`/clientes/${id}`)
    await fakeDelay(250)
    const c = mockClientes.find((c) => c.id === id)
    if (!c) throw new Error('not found')
    return c
  },
}
