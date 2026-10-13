import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockSession } from './session'

const KEY = 'stalo-sistema:mock-session'

describe('mockSession', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('salva, lê e limpa o id do usuário numa chave própria', () => {
    expect(mockSession.read()).toBeNull()
    mockSession.save('u1')
    expect(localStorage.getItem(KEY)).toBe('u1')
    expect(mockSession.read()).toBe('u1')
    mockSession.clear()
    expect(mockSession.read()).toBeNull()
  })

  it('storage bloqueado não quebra: save/clear não lançam e read devolve null', () => {
    const blocked = () => {
      throw new Error('blocked')
    }
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(blocked)
    expect(() => mockSession.save('u1')).not.toThrow()
    expect(mockSession.read()).toBeNull()
    expect(() => mockSession.clear()).not.toThrow()
  })
})
