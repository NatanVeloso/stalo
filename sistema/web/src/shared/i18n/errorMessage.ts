import { ApiError } from '@/shared/lib/http'
import type { Dictionary } from './locales/pt-BR'

type Codes = Dictionary['common']['errors']['codes']

/** Texto do erro no idioma atual a partir do `code` estável da API; sem código conhecido, mensagem genérica. */
export function errorMessage(error: unknown, t: Dictionary) {
  // hasOwn, não `in`: um code como 'toString' casaria com propriedade herdada de Object
  if (error instanceof ApiError && Object.hasOwn(t.common.errors.codes, error.code)) {
    return t.common.errors.codes[error.code as keyof Codes]
  }
  return t.common.errors.actionFailed
}
