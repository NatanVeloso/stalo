import { env } from '@/shared/lib/env'
import { ApiError, http } from '@/shared/lib/http'
import type { AuthUser } from '@/shared/auth'
import { fakeDelay, mockSession, mockSessoes, mockUsers } from '@/mocks'
import type { PerfilInput, Sessao } from './types'

export const configuracoesApi = {
  /** Edita nome/e-mail do próprio usuário e devolve o usuário da sessão atualizado. */
  async atualizarPerfil(input: PerfilInput): Promise<AuthUser> {
    if (!env.mock) return http.patch<AuthUser>('/auth/me', input)

    await fakeDelay(500)
    const user = mockUsers.find((u) => u.id === mockSession.read())
    if (!user) throw new ApiError(401, 'auth/no-session', 'Sessão expirada')
    if (mockUsers.some((u) => u.id !== user.id && u.email === input.email)) {
      throw new ApiError(409, 'resource/conflict', 'E-mail já usado')
    }
    // muta o mock para o refresh e a lista de usuários verem o dado novo, como o banco faria
    Object.assign(user, { ...input, atualizadoEm: new Date().toISOString() })
    return { id: user.id, nome: user.nome, email: user.email, role: user.role }
  },

  async sessoes(): Promise<Sessao[]> {
    if (!env.mock) return http.get('/auth/sessoes')
    await fakeDelay(350)
    return [...mockSessoes]
  },

  async encerrarSessao(id: string): Promise<void> {
    if (!env.mock) return http.delete<void>(`/auth/sessoes/${id}`)
    await fakeDelay(350)
    const i = mockSessoes.findIndex((s) => s.id === id && !s.atual)
    if (i < 0) throw new ApiError(404, 'resource/not-found', 'Sessão não encontrada')
    mockSessoes.splice(i, 1)
  },
}
