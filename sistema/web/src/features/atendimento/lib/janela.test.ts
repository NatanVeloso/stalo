import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { janelaFechada, janelaRestanteMin } from './janela'

const AGORA = new Date('2026-10-10T12:00:00.000Z')
const daqui = (min: number) => new Date(AGORA.getTime() + min * 60_000).toISOString()

describe('janelaRestanteMin', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(AGORA)
  })
  afterEach(() => vi.useRealTimers())

  it('aberta: devolve os minutos que faltam', () => {
    expect(janelaRestanteMin(daqui(23 * 60))).toBe(23 * 60)
    expect(janelaFechada(daqui(23 * 60))).toBe(false)
  })
  it('fechando: menos de uma hora ainda conta como aberta', () => {
    expect(janelaRestanteMin(daqui(5))).toBe(5)
    expect(janelaFechada(daqui(1))).toBe(false)
  })
  it('fechada: exatamente no limite e depois dele', () => {
    expect(janelaRestanteMin(daqui(0))).toBe(0)
    expect(janelaFechada(daqui(0))).toBe(true)
    expect(janelaRestanteMin(daqui(-90))).toBe(-90)
    expect(janelaFechada(daqui(-90))).toBe(true)
  })
  it('sem mensagem do contato: null e não bloqueia', () => {
    expect(janelaRestanteMin(null)).toBeNull()
    expect(janelaFechada(null)).toBe(false)
  })
})
