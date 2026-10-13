/**
 * Geometria do logo em partículas (funções puras; o desenho fica em features/auth/lib/cosmosEngine).
 * Unidades normalizadas: o ícone tem altura 1, centro na origem e y para cima.
 */

export type Point = readonly [number, number]
export type Rng = () => number

/** Parte das partículas que desenha o contorno de cada palito; o resto preenche. */
export const EDGE_FRACTION = 0.35

/** Lê um path só com comandos absolutos M/L/H/V/Z (os palitos do logo) e devolve os vértices. */
export function parsePolygon(d: string): Point[] {
  const pts: Point[] = []
  let x = 0
  let y = 0
  for (const [, cmd = '', args = ''] of d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const [a = 0, b = 0] = args
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
    if (cmd === 'M' || cmd === 'L') [x, y] = [a, b]
    else if (cmd === 'H') x = a
    else if (cmd === 'V') y = a
    else continue
    pts.push([x, y])
  }
  const first = pts[0]
  const last = pts.at(-1)
  if (pts.length > 1 && first && last && first[0] === last[0] && first[1] === last[1]) pts.pop()
  return pts
}

export function pointInPolygon(x: number, y: number, poly: readonly Point[]): boolean {
  let inside = false
  poly.forEach(([xi, yi], i) => {
    const [xj, yj] = poly.at(i - 1) ?? [xi, yi] // vértice anterior (o último, para i = 0)
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  })
  return inside
}

export type IconSample = {
  /** x, y de cada partícula */
  pos: Float32Array
  /** 1 = partícula do contorno */
  edge: Uint8Array
  /** distância até o centro (a onda corre por ela) */
  radius: Float32Array
  /** vetor do eixo do palito até a partícula (o "zoom" da onda afasta por ele) */
  perp: Float32Array
}

type Edge = { a: Point; b: Point; len: number }

/** Sorteia um ponto sobre as arestas, proporcional ao comprimento (senão as pontas curtas ficam claras demais). */
function pointOnEdges(edges: readonly Edge[], total: number, rng: Rng): Point {
  let r = rng() * total
  const edge = edges.find((e) => (r -= e.len) <= 0) ?? edges.at(-1)
  if (!edge) return [0, 0]
  const t = rng()
  return [edge.a[0] + (edge.b[0] - edge.a[0]) * t, edge.a[1] + (edge.b[1] - edge.a[1]) * t]
}

/** Sorteia um ponto dentro do polígono (rejeição no retângulo que o envolve). */
function pointInside(poly: readonly Point[], rng: Rng): Point {
  const xs = poly.map((p) => p[0])
  const ys = poly.map((p) => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  for (;;) {
    const p: Point = [x0 + (x1 - x0) * rng(), y0 + (y1 - y0) * rng()]
    if (pointInPolygon(p[0], p[1], poly)) return p
  }
}

/** Sorteia `count` partículas nos palitos, distribuídas igualmente entre eles. */
export function sampleIcon(
  paths: readonly string[],
  count: number,
  center: Point,
  height: number,
  rng: Rng = Math.random,
): IconSample {
  const sticks = paths.map((d) => {
    const poly = parsePolygon(d).map(([x, y]): Point => [(x - center[0]) / height, -(y - center[1]) / height])
    const edges = poly.map((a, j): Edge => {
      const b = poly[(j + 1) % poly.length] ?? a
      return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) }
    })
    // os palitos são radiais: o eixo passa pelo centro na direção do centróide
    const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length
    const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length
    const len = Math.hypot(cx, cy) || 1
    return { poly, edges, perimeter: edges.reduce((s, e) => s + e.len, 0), axis: [cx / len, cy / len] as const }
  })

  const pos = new Float32Array(count * 2)
  const edge = new Uint8Array(count)
  const radius = new Float32Array(count)
  const perp = new Float32Array(count * 2)

  for (let i = 0; i < count; i++) {
    const stick = sticks[i % sticks.length]
    if (!stick) break
    const onEdge = rng() < EDGE_FRACTION
    const [x, y] = onEdge ? pointOnEdges(stick.edges, stick.perimeter, rng) : pointInside(stick.poly, rng)
    const proj = x * stick.axis[0] + y * stick.axis[1]
    pos.set([x, y], i * 2)
    perp.set([x - proj * stick.axis[0], y - proj * stick.axis[1]], i * 2)
    edge[i] = onEdge ? 1 : 0
    radius[i] = Math.hypot(x, y)
  }
  return { pos, edge, radius, perp }
}
