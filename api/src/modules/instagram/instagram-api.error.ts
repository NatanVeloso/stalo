/** Erro da Graph API já sem segredos na mensagem (ver utils/redact.ts). */
export class InstagramApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: number,
  ) {
    super(message);
    this.name = 'InstagramApiError';
  }

  /** 190 = token inválido/expirado: precisa reautorizar na Meta. */
  get isAuthError(): boolean {
    return this.status === 401 || this.code === 190;
  }
}
