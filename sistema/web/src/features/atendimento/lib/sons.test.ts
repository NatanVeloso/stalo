import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { chegouMensagem, chegouNaoLida, tocarSomRecebimento } from './sons'
import type { Mensagem } from '../types'

const msg = (id: string, de: Mensagem['de'], em = '2026-10-10T12:00:00.000Z') => ({ id, de, em }) as Mensagem

describe('chegouNaoLida', () => {
  it('detecta aumento do total de não lidas', () => {
    expect(chegouNaoLida(2, 3)).toBe(true)
  })
  it('ignora total igual ou menor (conversa lida)', () => {
    expect(chegouNaoLida(3, 3)).toBe(false)
    expect(chegouNaoLida(3, 0)).toBe(false)
  })
  it('não toca na primeira carga', () => {
    expect(chegouNaoLida(null, 4)).toBe(false)
  })
})

describe('chegouMensagem', () => {
  const antes = [msg('1', 'contato', '2026-10-10T10:00:00.000Z'), msg('2', 'atendente', '2026-10-10T11:00:00.000Z')]
  it('só conta mensagem nova do contato', () => {
    expect(chegouMensagem(antes, [...antes, msg('3', 'atendente')])).toBe(false)
    expect(chegouMensagem(antes, [...antes, msg('3', 'sistema')])).toBe(false)
    expect(chegouMensagem(antes, [...antes, msg('3', 'contato')])).toBe(true)
  })
  it('carregar mensagens anteriores (mais antigas) não toca', () => {
    expect(chegouMensagem(antes, [msg('0', 'contato', '2026-10-09T08:00:00.000Z'), ...antes])).toBe(false)
  })
})

describe('tocarSomRecebimento', () => {
  let osciladores = 0

  class FakeAudioContext {
    state = 'running'
    currentTime = 0
    destination = {}
    resume = vi.fn()
    createOscillator() {
      osciladores++
      return {
        type: 'sine',
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      }
    }
    createGain() {
      return { connect: vi.fn(), gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() } }
    }
  }

  beforeEach(() => {
    osciladores = 0
    vi.useFakeTimers()
    vi.stubGlobal('AudioContext', FakeAudioContext)
    usePrefs.setState({ somAoReceber: true })
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('dois disparos em menos de 500 ms tocam uma vez só (dois tons = dois osciladores)', () => {
    vi.setSystemTime(new Date('2026-10-10T12:00:00.000Z'))
    tocarSomRecebimento()
    vi.setSystemTime(new Date('2026-10-10T12:00:00.300Z'))
    tocarSomRecebimento()
    expect(osciladores).toBe(2)
  })

  it('disparos espaçados tocam de novo', () => {
    vi.setSystemTime(new Date('2026-10-10T13:00:00.000Z'))
    tocarSomRecebimento()
    vi.setSystemTime(new Date('2026-10-10T13:00:00.600Z'))
    tocarSomRecebimento()
    expect(osciladores).toBe(4)
  })

  it('respeita a preferência desligada', () => {
    usePrefs.setState({ somAoReceber: false })
    vi.setSystemTime(new Date('2026-10-10T14:00:00.000Z'))
    tocarSomRecebimento()
    expect(osciladores).toBe(0)
  })
})
