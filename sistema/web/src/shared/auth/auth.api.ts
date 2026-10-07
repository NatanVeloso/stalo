import { env } from '@/shared/lib/env'
import { ApiError, http } from '@/shared/lib/http'
import { fakeDelay, mockUsers } from '@/mocks'
import type { AuthUser } from './auth.store'

type Session = { user: AuthUser; accessToken: string }

/**
 * Endpoints de autenticação (contrato em sistema/DOMINIO.md). No modo mock
 * a "sessão" é simulada com os usuários de demonstração; a senha é `123456`.
 */
export const authApi = {
  async login(email: string, password: string): Promise<Session> {
    if (env.mock) {
      await fakeDelay(600)
      const user = mockUsers.find((u) => u.email === email)
      if (!user || password !== '123456') throw new ApiError(401, 'auth/invalid-credentials', 'Credenciais inválidas')
      return { user: toAuthUser(user), accessToken: `mock.${user.id}.${Date.now()}` }
    }
    return http.post<Session>('/auth/login', { email, password }, { retry: false })
  },

  async refresh(): Promise<Session> {
    if (env.mock) {
      await fakeDelay(250)
      const raw = localStorage.getItem('stalo-sistema:auth')
      const id = raw ? (JSON.parse(raw) as { state?: { user?: { id: string } } }).state?.user?.id : null
      const user = mockUsers.find((u) => u.id === id)
      if (!user) throw new ApiError(401, 'auth/no-session', 'Sessão expirada')
      return { user: toAuthUser(user), accessToken: `mock.${user.id}.${Date.now()}` }
    }
    return http.post<Session>('/auth/refresh', undefined, { retry: false })
  },

  async logout(accessToken: string | null): Promise<void> {
    if (env.mock) return fakeDelay(150)
    await http.post('/auth/logout', undefined, {
      retry: false,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
  },
}

function toAuthUser(u: (typeof mockUsers)[number]): AuthUser {
  return { id: u.id, nome: u.nome, email: u.email, role: u.role }
}
