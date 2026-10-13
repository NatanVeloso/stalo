import { env } from '@/shared/lib/env'
import { ApiError, http, refreshSession } from '@/shared/lib/http'
import { fakeDelay, mockSession, mockUsers } from '@/mocks'
import type { AuthUser } from './auth.store'
import { roles, type Role } from './permissions'

type Session = { user: AuthUser; accessToken: string }

/** Atalho de login da demonstração (um por perfil). */
export type ContaDemo = { role: Role; email: string; password: string }

/**
 * Endpoints de autenticação (contrato em sistema/DOMINIO.md). No modo mock a "sessão" é simulada
 * com os usuários de demonstração (`mocks/`); a senha é `123456`.
 */
export const authApi = {
  async login(email: string, password: string, remember: boolean): Promise<Session> {
    if (!env.mock) return http.post<Session>('/auth/login', { email, password, remember }, { retry: false })

    await fakeDelay(600)
    const user = mockUsers.find((u) => u.email === email)
    if (!user || password !== '123456') throw new ApiError(401, 'auth/invalid-credentials', 'Credenciais inválidas')
    mockSession.save(user.id)
    return { user: toAuthUser(user), accessToken: `mock.${user.id}.${Date.now()}` }
  },

  /** Usa o mesmo refresh single-flight do `http`: nunca dois refresh com o mesmo cookie. */
  async refresh(): Promise<Session> {
    if (!env.mock) {
      const body = await refreshSession()
      if (!body?.user) throw new ApiError(401, 'auth/no-session', 'Sessão expirada')
      return body as Session
    }

    await fakeDelay(250)
    const user = mockUsers.find((u) => u.id === mockSession.read())
    if (!user) throw new ApiError(401, 'auth/no-session', 'Sessão expirada')
    return { user: toAuthUser(user), accessToken: `mock.${user.id}.${Date.now()}` }
  },

  async logout(accessToken: string | null): Promise<void> {
    if (!env.mock) {
      await http.post('/auth/logout', undefined, {
        retry: false,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })
      return
    }

    mockSession.clear()
    await fakeDelay(150)
  },

  /**
   * Pede o link de redefinição de senha. Rota pública; o back responde igual exista ou não o
   * e-mail (não revela quem tem conta), então o front sempre mostra a mesma confirmação.
   */
  async esqueciSenha(email: string): Promise<void> {
    if (!env.mock) return http.post<void>('/auth/esqueci-senha', { email }, { retry: false })
    await fakeDelay(500)
  },

  /**
   * Contas de demonstração para os atalhos da tela de login. Fora do modo mock não existem:
   * devolve lista vazia, e a tela nem mostra os atalhos.
   */
  contasDemo(): ContaDemo[] {
    if (!env.mock) return []
    return roles.flatMap((role) => {
      const u = mockUsers.find((m) => m.role === role && m.status === 'ativo')
      return u ? [{ role, email: u.email, password: '123456' }] : []
    })
  },
}

function toAuthUser(u: (typeof mockUsers)[number]): AuthUser {
  return { id: u.id, nome: u.nome, email: u.email, role: u.role }
}
