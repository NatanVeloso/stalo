import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import { fakeDelay, mockUsers } from '@/mocks'
import type { Usuario } from './types'

export const usuariosApi = {
  async list(): Promise<Usuario[]> {
    if (!env.mock) return http.get('/usuarios')
    await fakeDelay()
    return mockUsers
  },
}
