import { describe, expect, it } from 'vitest'
import { fmt } from '.'

describe('fmt', () => {
  it('interpola as chaves', () => {
    expect(fmt('Página {page} de {pages}', { page: 2, pages: 5 })).toBe('Página 2 de 5')
  })
  it('deixa a chave visível quando falta valor, para o erro aparecer na tela', () => {
    expect(fmt('Olá {name}', {})).toBe('Olá {name}')
  })
})
