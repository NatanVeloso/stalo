import { describe, expect, it } from 'vitest'
import {
  LEVELS,
  galaxyToScreen,
  mixPalette,
  parseRgb,
  sampleCluster,
  sampleGalaxy,
  sampleStars,
  type GalaxyShape,
} from './galaxy'

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

const at = (arr: Float32Array | Uint8Array, i: number) => arr[i] ?? Number.NaN

describe('sampleGalaxy', () => {
  const g = sampleGalaxy(2000, { arms: 2, wind: 2.4, spin: 0.025 }, seeded(11))

  it('gera a quantidade pedida, com raio dentro do disco', () => {
    expect(g.r).toHaveLength(2000)
    for (let i = 0; i < 2000; i++) {
      expect(at(g.r, i)).toBeGreaterThanOrEqual(0)
      expect(at(g.r, i)).toBeLessThan(1.5)
    }
  })

  it('rotação diferencial: quem está mais perto do centro gira mais rápido', () => {
    for (let i = 0; i < 2000; i++) {
      for (const j of [i + 1, i + 7]) {
        if (j >= 2000) continue
        if (at(g.r, i) < at(g.r, j)) expect(at(g.omega, i)).toBeGreaterThan(at(g.omega, j))
      }
    }
  })

  it('níveis de brilho dentro da faixa', () => {
    for (let i = 0; i < 2000; i++) {
      expect(at(g.level, i)).toBeGreaterThanOrEqual(0)
      expect(at(g.level, i)).toBeLessThan(LEVELS)
    }
  })

  it('o centro concentra partículas (bojo)', () => {
    const inner = g.r.filter((r) => r < 0.15).length
    expect(inner / 2000).toBeGreaterThan(0.15)
  })
})

describe('galaxyToScreen', () => {
  const shape: GalaxyShape = { center: [0.5, 0.5], radius: 0.4, incl: 0.5, tilt: 0 }

  it('o centro do disco cai no centro configurado', () => {
    expect(galaxyToScreen(0, 1.2, shape, 1000, 800)).toEqual([500, 400])
  })

  it('sem inclinação, raio 1 no ângulo 0 fica a radius × largura à direita', () => {
    const [x, y] = galaxyToScreen(1, 0, shape, 1000, 800)
    expect(x).toBeCloseTo(900)
    expect(y).toBeCloseTo(400)
  })

  it('o achatamento encurta o eixo vertical do disco', () => {
    const [, y] = galaxyToScreen(1, Math.PI / 2, shape, 1000, 800)
    expect(y - 400).toBeCloseTo(1000 * 0.4 * 0.5)
  })

  it('o tilt gira o disco na tela', () => {
    const [x, y] = galaxyToScreen(1, 0, { ...shape, tilt: Math.PI / 2 }, 1000, 800)
    expect(x).toBeCloseTo(500)
    expect(y).toBeCloseTo(800)
  })
})

describe('sampleStars', () => {
  it('as primeiras são as grandes (com halo) e todas ficam dentro da tela', () => {
    const stars = sampleStars(100, 5, seeded(2))
    expect(stars.filter((s) => s.big)).toHaveLength(5)
    expect(stars.slice(0, 5).every((s) => s.big)).toBe(true)
    for (const s of stars) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.x).toBeLessThan(1)
      expect(s.y).toBeGreaterThanOrEqual(0)
      expect(s.y).toBeLessThan(1)
    }
  })
})

describe('sampleCluster', () => {
  it('fica concentrado no centro e não gira sozinho', () => {
    const c = sampleCluster(500, seeded(5))
    expect(c.r).toHaveLength(500)
    expect(c.omega.every((w) => w === 0)).toBe(true)
    expect(c.r.filter((r) => r < 0.35).length / 500).toBeGreaterThan(0.5)
  })
})

describe('parseRgb', () => {
  it('lê rgb() e rgba(), com ou sem vírgula', () => {
    expect(parseRgb('rgb(47, 91, 214)')).toEqual([47, 91, 214])
    expect(parseRgb(' rgba(1,2,3,0.5) ')).toEqual([1, 2, 3])
    expect(parseRgb('rgb(10 20 30)')).toEqual([10, 20, 30])
  })
  it('formato desconhecido devolve null', () => {
    expect(parseRgb('#fff')).toBeNull()
    expect(parseRgb('')).toBeNull()
  })
})

describe('mixPalette', () => {
  const palette = [
    [0, 0, 0],
    [100, 200, 50],
  ] as const
  it('nas posições exatas devolve a própria cor', () => {
    expect(mixPalette(palette, 0)).toEqual([0, 0, 0])
    expect(mixPalette(palette, 0.5)).toEqual([100, 200, 50])
  })
  it('entre duas cores, interpola; no fim volta para a primeira (circular)', () => {
    expect(mixPalette(palette, 0.25)).toEqual([50, 100, 25])
    expect(mixPalette(palette, 0.75)).toEqual([50, 100, 25])
    expect(mixPalette(palette, 1)).toEqual([0, 0, 0])
    expect(mixPalette(palette, -0.25)).toEqual([50, 100, 25])
  })
  it('paleta vazia não quebra', () => {
    expect(mixPalette([], 0.3)).toEqual([255, 255, 255])
  })
})
