import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/lib/http'
import { getDictionary } from '.'
import { errorMessage } from './errorMessage'

const pt = getDictionary('pt-BR')
const en = getDictionary('en')

describe('errorMessage', () => {
  it('código conhecido → texto do dicionário do idioma', () => {
    const err = new ApiError(401, 'auth/invalid-credentials', 'Invalid credentials')
    expect(errorMessage(err, pt)).toBe(pt.common.errors.codes['auth/invalid-credentials'])
    expect(errorMessage(err, en)).toBe(en.common.errors.codes['auth/invalid-credentials'])
    expect(errorMessage(err, pt)).not.toBe(errorMessage(err, en))
  })

  it('todos os códigos do dicionário são reconhecidos', () => {
    for (const [code, text] of Object.entries(pt.common.errors.codes)) {
      expect(errorMessage(new ApiError(400, code, 'x'), pt)).toBe(text)
    }
  })

  it('código desconhecido → actionFailed (não mostra a mensagem crua da API)', () => {
    const err = new ApiError(500, 'algo/novo', 'stack trace interno')
    expect(errorMessage(err, pt)).toBe(pt.common.errors.actionFailed)
  })

  it('erro qualquer (rede, Error, string, undefined) → actionFailed', () => {
    expect(errorMessage(new TypeError('Failed to fetch'), pt)).toBe(pt.common.errors.actionFailed)
    expect(errorMessage('falhou', pt)).toBe(pt.common.errors.actionFailed)
    expect(errorMessage(undefined, en)).toBe(en.common.errors.actionFailed)
  })

  /*
   * BUG (pequeno): `error.code in t.common.errors.codes` olha o protótipo. Um `code` como
   * 'toString' ou 'constructor' passa no teste e a função devolve uma *função* em vez de texto
   * (o toast mostraria "function toString() { [native code] }"). Correção: `Object.hasOwn(...)`.
   */
  it('código que coincide com propriedade herdada de Object cai no actionFailed', () => {
    const err = new ApiError(400, 'toString', 'x')
    expect(errorMessage(err, pt)).toBe(pt.common.errors.actionFailed)
  })
})
