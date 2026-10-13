import { describe, expect, it } from 'vitest'
import { ICON_CENTER, ICON_HEIGHT, ICON_PATHS } from '@/shared/ui/logoPaths'
import { parsePolygon, pointInPolygon, sampleIcon, type Point } from './particleLogo'

/** Gerador determinístico (mulberry32) para o teste não depender de sorte. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('parsePolygon', () => {
  it('lê M/H/L e descarta o vértice repetido do fechamento', () => {
    expect(parsePolygon('M1 2H5L6 9H0L1 2Z')).toEqual([
      [1, 2],
      [5, 2],
      [6, 9],
      [0, 9],
    ])
  })

  it('lê V', () => {
    expect(parsePolygon('M0 0H4V3H0Z')).toEqual([
      [0, 0],
      [4, 0],
      [4, 3],
      [0, 3],
    ])
  })

  it('cada palito do logo vira um quadrilátero', () => {
    for (const d of ICON_PATHS) expect(parsePolygon(d)).toHaveLength(4)
  })
})

describe('pointInPolygon', () => {
  const square: Point[] = [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ]
  it('dentro e fora', () => {
    expect(pointInPolygon(1, 1, square)).toBe(true)
    expect(pointInPolygon(3, 1, square)).toBe(false)
  })
})

/** Leitura de typed array sem `undefined` (índice fora vira NaN e quebra o teste). */
const at = (arr: Float32Array, i: number) => arr[i] ?? Number.NaN

describe('sampleIcon', () => {
  const s = sampleIcon(ICON_PATHS, 600, ICON_CENTER, ICON_HEIGHT, seeded(7))

  it('gera a quantidade pedida', () => {
    expect(s.pos).toHaveLength(1200)
    expect(s.edge).toHaveLength(600)
  })

  it('todas as partículas ficam dentro do ícone normalizado (altura 1, centro na origem)', () => {
    for (let i = 0; i < 600; i++) {
      const [x, y] = [at(s.pos, i * 2), at(s.pos, i * 2 + 1)]
      expect(Math.abs(x)).toBeLessThanOrEqual(0.5)
      expect(Math.abs(y)).toBeLessThanOrEqual(0.51)
      expect(at(s.radius, i)).toBeCloseTo(Math.hypot(x, y), 5)
    }
  })

  it('uma parte desenha o contorno e o resto preenche', () => {
    const edges = s.edge.reduce((n, e) => n + e, 0)
    expect(edges).toBeGreaterThan(120)
    expect(edges).toBeLessThan(300)
  })

  it('o vetor até o eixo é pequeno: os palitos são finos', () => {
    for (let i = 0; i < 600; i++) expect(Math.hypot(at(s.perp, i * 2), at(s.perp, i * 2 + 1))).toBeLessThan(0.05)
  })
})
