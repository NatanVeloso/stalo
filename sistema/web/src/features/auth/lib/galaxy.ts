/**
 * Geometria do fundo do login (funções puras; o desenho fica em cosmosEngine.ts).
 * A galáxia é um disco visto inclinado: cada partícula tem raio (0 = centro, ~1 = borda) e ângulo
 * no disco; a projeção achata pelo `incl` e gira pelo `tilt` na tela.
 */
import type { Rng } from '@/shared/lib/particleLogo'

/** Quantos níveis de brilho as partículas usam (o desenho agrupa por nível). */
export const LEVELS = 4

export type GalaxyShape = {
  /** centro, em fração da largura e da altura */
  center: readonly [number, number]
  /** raio maior, em fração da largura */
  radius: number
  /** achatamento do disco (1 = de frente, 0 = de perfil) */
  incl: number
  /** rotação na tela, em radianos (negativo = sobe para a direita) */
  tilt: number
}

export type GalaxySample = {
  r: Float32Array
  angle: Float32Array
  /** velocidade angular (rad/s): o centro gira mais rápido que a borda */
  omega: Float32Array
  level: Uint8Array
  size: Float32Array
}

/** Soma de 4 uniformes, centrada em 0 (aproxima uma normal, sem cauda longa). */
const gauss = (rng: Rng) => (rng() + rng() + rng() + rng() - 2) / 2
const clampLevel = (x: number) => Math.min(LEVELS - 1, Math.max(0, Math.floor(x * LEVELS)))

/** Bojo central (20%), braços em espiral (52%) e disco difuso (28%). */
export function sampleGalaxy(
  count: number,
  { arms, wind, spin }: { arms: number; wind: number; spin: number },
  rng: Rng = Math.random,
): GalaxySample {
  const r = new Float32Array(count)
  const angle = new Float32Array(count)
  const omega = new Float32Array(count)
  const level = new Uint8Array(count)
  const size = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const kind = rng()
    let ri: number
    let ai: number
    let bright: number
    if (kind < 0.2) {
      ri = Math.abs(gauss(rng)) * 0.16
      ai = rng() * Math.PI * 2
      bright = 0.95
    } else if (kind < 0.72) {
      ri = 0.05 + Math.pow(rng(), 1.1) * 0.95
      ai = ((i % arms) * Math.PI * 2) / arms + ri * wind + gauss(rng) * 0.7
      ri *= 1 + gauss(rng) * 0.12
      bright = 0.8 - ri * 0.4
    } else {
      ri = Math.pow(rng(), 1.4) * 0.95
      ai = rng() * Math.PI * 2
      bright = 0.5 - ri * 0.3
    }
    r[i] = ri
    angle[i] = ai
    omega[i] = spin / (0.25 + ri)
    level[i] = clampLevel(bright + gauss(rng) * 0.25)
    size[i] = ri < 0.15 ? 1.2 + rng() * 0.8 : 0.8 + rng() * 0.9
  }
  return { r, angle, omega, level, size }
}

/** Posição na tela (px) de um ponto do disco. */
export function galaxyToScreen(
  r: number,
  angle: number,
  shape: GalaxyShape,
  width: number,
  height: number,
): [number, number] {
  const big = shape.radius * width
  const x = r * Math.cos(angle) * big
  const y = r * Math.sin(angle) * big * shape.incl
  const c = Math.cos(shape.tilt)
  const s = Math.sin(shape.tilt)
  return [shape.center[0] * width + x * c - y * s, shape.center[1] * height + x * s + y * c]
}

export type Star = {
  /** posição em fração da tela */
  x: number
  y: number
  size: number
  /** estrela grande ganha halo */
  big: boolean
  /** frequência e fase do piscar */
  twinkle: number
  phase: number
  level: number
}

/** Estrelas de fundo: a maioria pequena, `bigCount` maiores (com halo). */
export function sampleStars(count: number, bigCount: number, rng: Rng = Math.random): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const big = i < bigCount
    return {
      x: rng(),
      y: rng(),
      size: big ? 1.8 + rng() * 1.4 : 0.6 + Math.pow(rng(), 3) * 1.6,
      big,
      twinkle: 0.4 + rng() * 1.6,
      phase: rng() * Math.PI * 2,
      level: Math.floor(rng() * LEVELS),
    }
  })
}

/** Galáxia elíptica pequena (satélite): só um bojo, sem braços. Usa o mesmo formato de `sampleGalaxy`. */
export function sampleCluster(count: number, rng: Rng = Math.random): GalaxySample {
  const r = new Float32Array(count)
  const angle = new Float32Array(count)
  const omega = new Float32Array(count)
  const level = new Uint8Array(count)
  const size = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const ri = Math.abs(gauss(rng)) * 0.6
    r[i] = ri
    angle[i] = rng() * Math.PI * 2
    level[i] = clampLevel(0.9 - ri * 0.9 + gauss(rng) * 0.2)
    size[i] = 0.8 + rng() * 0.8
  }
  return { r, angle, omega, level, size }
}

export type Rgb = readonly [number, number, number]

/** Lê `rgb(r, g, b)` (o formato dos tokens de cor do universo). Formato desconhecido devolve `null`. */
export function parseRgb(value: string): Rgb | null {
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value.trim())
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

/** Cor ao longo de uma paleta circular: `t` em [0, 1) percorre todas as cores e volta à primeira. */
export function mixPalette(palette: readonly Rgb[], t: number): Rgb {
  if (palette.length === 0) return [255, 255, 255]
  const pos = (((t % 1) + 1) % 1) * palette.length
  const i = Math.floor(pos)
  const a = palette[i % palette.length] ?? palette[0]!
  const b = palette[(i + 1) % palette.length] ?? a
  const f = pos - i
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}
