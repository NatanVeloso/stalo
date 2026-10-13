import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { configureHttp } from '@/shared/lib/http'
import { queryClient } from '@/shared/lib/queryClient'
import type { Role } from './permissions'
import { authApi } from './auth.api'

export type AuthUser = {
  id: string
  nome: string
  email: string
  role: Role
  /** URL da foto; sem ela o avatar mostra as iniciais. */
  fotoUrl?: string
}

type AuthStatus = 'booting' | 'anonymous' | 'authenticated'

type AuthState = {
  status: AuthStatus
  user: AuthUser | null
  /** Só em memória: nunca vai para o localStorage. O refresh fica no cookie httpOnly. */
  accessToken: string | null
  /** `remember` = "manter conectado": o back estende o refresh para 30 dias. */
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => Promise<void>
  /** Na carga: tenta renovar a sessão pelo cookie. Sem cookie válido → anônimo. */
  bootstrap: () => Promise<void>
  /** Atualiza os dados do usuário logado (ex.: perfil salvo em Configurações). */
  setUser: (user: AuthUser) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'booting',
      user: null,
      accessToken: null,

      async login(email, password, remember) {
        const { user, accessToken } = await authApi.login(email, password, remember)
        // outro usuário pode ter usado a aba antes: nada do cache dele pode aparecer
        queryClient.clear()
        set({ user, accessToken, status: 'authenticated' })
      },

      async logout() {
        const token = get().accessToken
        endSession()
        try {
          await authApi.logout(token)
        } catch {
          /* a sessão local já foi encerrada; o cookie expira sozinho */
        }
      },

      setUser(user) {
        set({ user })
      },

      async bootstrap() {
        // sem usuário lembrado não há cookie para renovar: pula a chamada
        if (!get().user) {
          set({ status: 'anonymous' })
          return
        }
        try {
          const { user, accessToken } = await authApi.refresh()
          set({ user, accessToken, status: 'authenticated' })
        } catch {
          set({ user: null, accessToken: null, status: 'anonymous' })
        }
      },
    }),
    {
      name: 'stalo-sistema:auth',
      // persistimos só o usuário (para render otimista e para saber se vale tentar o refresh)
      partialize: (s) => ({ user: s.user }),
    },
  ),
)

configureHttp({
  getAccessToken: () => useAuth.getState().accessToken,
  setAccessToken: (accessToken) => useAuth.setState({ accessToken }),
  onUnauthorized: endSession,
})

/** Encerra a sessão local e descarta o cache das queries (dados do usuário que saiu). */
function endSession() {
  useAuth.setState({ user: null, accessToken: null, status: 'anonymous' })
  queryClient.clear()
}

export function useCurrentUser() {
  return useAuth((s) => s.user)
}

export function useRole(): Role | null {
  return useAuth((s) => s.user?.role ?? null)
}
