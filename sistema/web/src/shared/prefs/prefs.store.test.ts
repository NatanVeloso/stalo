import { describe, expect, it } from 'vitest'
import { compactFontScale, fontSizePx, rootFontPx } from './prefs.store'

describe('rootFontPx', () => {
  it('confortável e média usam o tamanho escolhido sem reduzir', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      expect(rootFontPx(size, 'comfortable')).toBe(fontSizePx[size])
      expect(rootFontPx(size, 'medium')).toBe(fontSizePx[size])
    }
  })

  it('compacta reduz a fonte raiz (arredondada a uma casa)', () => {
    expect(rootFontPx('sm', 'compact')).toBe(12.9)
    expect(rootFontPx('md', 'compact')).toBe(14.7)
    expect(rootFontPx('lg', 'compact')).toBe(16.6)
    for (const size of ['sm', 'md', 'lg'] as const) {
      expect(rootFontPx(size, 'compact')).toBeLessThan(fontSizePx[size])
      expect(rootFontPx(size, 'compact')).toBeCloseTo(fontSizePx[size] * compactFontScale, 1)
    }
  })

  it('a escala de fonte é 14/16/18', () => {
    expect(fontSizePx).toEqual({ sm: 14, md: 16, lg: 18 })
  })
})
