import { env } from './env'

/**
 * Cliente HTTP da API. Único lugar que fala com o back.
 *
 * Contrato (ver sistema/DOMINIO.md):
 * - access token curto no header Authorization (fica só em memória);
 * - refresh token em cookie httpOnly, enviado com `credentials: 'include'`;
 * - 401 → tenta `POST /auth/refresh` uma vez (single-flight: várias requisições
 *   em paralelo esperam o mesmo refresh) e repete a chamada; falhou → `onUnauthorized`.
 *
 * Quem fornece o token e o que fazer ao deslogar é injetado por `configureHttp`,
 * para este módulo não depender do store de auth (evita import circular).
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type HttpConfig = {
  getAccessToken: () => string | null
  setAccessToken: (token: string | null) => void
  onUnauthorized: () => void
}

let config: HttpConfig = {
  getAccessToken: () => null,
  setAccessToken: () => {},
  onUnauthorized: () => {},
}

export function configureHttp(next: HttpConfig) {
  config = next
}

let refreshing: Promise<boolean> | null = null

async function refresh(): Promise<boolean> {
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${env.apiUrl}/auth/refresh`, { method: 'POST', credentials: 'include' })
      if (!res.ok) return false
      const body = (await res.json()) as { accessToken: string }
      config.setAccessToken(body.accessToken)
      return true
    } catch {
      return false
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown; retry?: boolean }

async function request<T>(method: string, path: string, options: Options = {}): Promise<T> {
  const { body, retry = true, headers, ...rest } = options
  const token = config.getAccessToken()
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && retry) {
    const ok = await refresh()
    if (ok) return request<T>(method, path, { ...options, retry: false })
    config.onUnauthorized()
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as {
      code?: string
      message?: string
      details?: unknown
    } | null
    throw new ApiError(res.status, payload?.code ?? 'unknown', payload?.message ?? res.statusText, payload?.details)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const http = {
  get: <T>(path: string, options?: Options) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Options) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Options) => request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Options) => request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: Options) => request<T>('DELETE', path, options),
}
