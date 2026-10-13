/** Sessão de login do próprio usuário (`GET /auth/sessoes`). Dispositivo e navegador são dado, não tradução. */
export type Sessao = {
  id: string
  dispositivo: string
  navegador: string
  /** Instante ISO do último uso do refresh desta sessão. */
  ultimoAcesso: string
  /** É a sessão deste navegador: não pode ser encerrada por aqui (use "Sair"). */
  atual: boolean
  criadoEm: string
}

/** Corpo de `PATCH /auth/me`. */
export type PerfilInput = { nome: string; email: string }
