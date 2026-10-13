import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockUsers, paginate } from '@/mocks'
import type { Usuario, UsuariosFiltro } from './types'

export const usuariosApi = {
  async list(f: UsuariosFiltro): Promise<Paginated<Usuario>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.search) qs.set('search', f.search)
      if (f.role) qs.set('role', f.role)
      if (f.sort) {
        qs.set('sort', f.sort)
        qs.set('order', f.order ?? 'asc')
      }
      return http.get(`/usuarios?${qs}`)
    }

    await fakeDelay()
    const term = f.search?.trim().toLowerCase() ?? ''
    const rows = mockUsers.filter(
      (u) =>
        (!f.role || u.role === f.role) &&
        (!term || u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)),
    )
    const sort = f.sort
    if (sort) {
      const dir = f.order === 'desc' ? -1 : 1
      // "nunca acessou" (null) fica no fim na ordem crescente, como um banco com NULLS LAST
      rows.sort((a, b) => String(a[sort] ?? '￿').localeCompare(String(b[sort] ?? '￿')) * dir)
    }
    return paginate(rows, f.page, f.pageSize)
  },
}
