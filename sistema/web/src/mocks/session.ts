/**
 * Sessão do modo mock: guarda só o id do usuário "logado", numa chave própria, para o refresh
 * simulado saber quem renovar. Faz o papel do cookie httpOnly que o back real usaria.
 */
const KEY = 'stalo-sistema:mock-session'

export const mockSession = {
  save(userId: string) {
    try {
      localStorage.setItem(KEY, userId)
    } catch {
      /* storage bloqueado: a sessão vale só até recarregar */
    }
  },
  read(): string | null {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* nada a limpar */
    }
  },
}
