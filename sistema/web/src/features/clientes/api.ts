import { env } from '@/shared/lib/env'
import { ApiError, http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockClientes, paginate } from '@/mocks'
import type { Cliente, ClientesFiltro } from './types'

export const clientesApi = {
  async list(f: ClientesFiltro): Promise<Paginated<Cliente>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.search) qs.set('search', f.search)
      if (f.sort) qs.set('sort', f.sort)
      if (f.sort && f.order) qs.set('order', f.order)
      if (f.regime) qs.set('regime', f.regime)
      if (f.status) qs.set('status', f.status)
      return http.get(`/clientes?${qs}`)
    }
    await fakeDelay()
    const term = f.search?.trim().toLowerCase() ?? ''
    const digits = term.replace(/\D/g, '')
    const rows = mockClientes.filter(
      (c) =>
        (!term ||
          c.razaoSocial.toLowerCase().includes(term) ||
          c.nomeFantasia.toLowerCase().includes(term) ||
          (digits && c.cnpj.includes(digits))) &&
        (!f.regime || c.regime === f.regime) &&
        (!f.status || c.status === f.status),
    )
    const { sort, order = 'asc' } = f
    if (sort) {
      rows.sort((a, b) => {
        const va = a[sort]
        const vb = b[sort]
        const r = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return order === 'asc' ? r : -r
      })
    }
    return paginate(rows, f.page, f.pageSize)
  },

  async get(id: string): Promise<Cliente> {
    if (!env.mock) return http.get(`/clientes/${id}`)
    await fakeDelay(250)
    const c = mockClientes.find((c) => c.id === id)
    if (!c) throw new ApiError(404, 'resource/not-found', 'Cliente não encontrado')
    return c
  },
}
