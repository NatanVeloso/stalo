import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('junta as classes verdadeiras e descarta false, null, undefined, 0 e vazio', () => {
    expect(cn('a', false, 'b', null, undefined, 0, '', 'c')).toBe('a b c')
  })

  it('sem nada verdadeiro devolve string vazia', () => {
    expect(cn(false, null)).toBe('')
  })

  it('não resolve conflito (sem tailwind-merge de propósito)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-2 p-4')
  })
})
