import { describe, expect, it } from 'vitest'
import { formatCnpj, formatCurrency, initials } from './format'

describe('format', () => {
  it('formata CNPJ com a máscara padrão', () => {
    expect(formatCnpj('12345678000190')).toBe('12.345.678/0001-90')
  })

  it('formata moeda em BRL conforme o idioma', () => {
    expect(formatCurrency(1234.5, 'pt-BR')).toMatch(/R\$\s?1\.234,50/)
    expect(formatCurrency(1234.5, 'en')).toMatch(/R\$\s?1,234\.50/)
  })

  it('gera iniciais de até dois nomes', () => {
    expect(initials('Ana Souza')).toBe('AS')
    expect(initials('Walex')).toBe('W')
  })
})
