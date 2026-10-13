import { sampleIcon } from '@/shared/lib/particleLogo'
import { ICON_CENTER, ICON_HEIGHT, ICON_PATHS } from '@/shared/ui/logoPaths'
import {
  LEVELS,
  galaxyToScreen,
  mixPalette,
  parseRgb,
  sampleCluster,
  sampleGalaxy,
  sampleStars,
  type GalaxySample,
  type GalaxyShape,
  type Rgb,
} from './galaxy'

/**
 * Motor do fundo do login (Canvas 2D, sem dependência), em duas camadas:
 * - `sky`: galáxia inclinada (bojo + braços em espiral) girando devagar, duas galáxias satélites,
 *   estrelas piscando, poeira e o rastro colorido do mouse. Fica num canvas desfocado (CSS), como
 *   fora de foco atrás do logo;
 * - `logo`: o asterisco da Stalo, nítido, girando no sentido horário, inclinando em 3D para o lado do
 *   mouse, com uma onda azul passando pelos palitos de tempos em tempos.
 * Na entrada, tudo (universo e logo) parte de pontos espalhados pela página e se organiza junto.
 * O mouse solta faíscas que mudam de cor conforme ele anda e empurra as partículas do ícone (ele não
 * tinge o universo: o brilho azul em volta do cursor foi tirado a pedido). Cores vêm dos tokens `--fg` e `--cosmos-*`.
 */

const INTRO_S = 2.6 // entrada: partículas espalhadas -> universo e logo
const GALAXY = { count: 8000, arms: 2, wind: 2.4, spin: 0.025, alpha: 0.75 }
// núcleo logo à direita do card: o brilho dele passa por trás do vidro e aparece como luz fosca
const GALAXY_SHAPE: GalaxyShape = { center: [0.69, 0.4], radius: 0.6, incl: 0.36, tilt: -0.42 }
/** Galáxias satélites (elípticas, paradas), do lado esquerdo para equilibrar a composição. */
const SATELLITES: { count: number; shape: GalaxyShape; core: number }[] = [
  { count: 700, shape: { center: [0.1, 0.8], radius: 0.06, incl: 0.55, tilt: -0.5 }, core: 0.5 },
  { count: 400, shape: { center: [0.17, 0.14], radius: 0.04, incl: 0.7, tilt: 0.3 }, core: 0.4 },
]
/** Galáxia distante no canto inferior direito: pequena, apagada e com pontos menores (parece longe). */
const DISTANT = {
  count: 1800,
  arms: 2,
  wind: 2.8,
  spin: 0.04,
  shape: { center: [0.9, 0.84], radius: 0.12, incl: 0.42, tilt: 0.55 } as GalaxyShape,
  core: 0.3,
  dim: 2, // níveis de brilho a menos
  size: 0.7,
}
const STARS = { count: 800, big: 14, left: 450 } // `left`: estrelas extras só na metade esquerda
const DUST = 200
const ICON = { count: 4200, x: 0.25, size: 0.45, alpha: 0.5, turn: 40, depth: 2.6 }
const TILT = { x: 0.3, y: 0.45, follow: 0.05 } // inclinação máxima (rad) e suavidade
const WAVE = { every: 6, duration: 2.6, band: 0.054, fill: 0.8, zoom: 0.25 }
const REPEL_R = 0.17 // em alturas do ícone
const SPARKS = { max: 500, perPx: 1 / 8, perFrame: 6, lifeMin: 0.9, lifeMax: 1.7, colorPerPx: 1 / 900 }
/** Movimento das partículas dentro dos palitos (em alturas do ícone): correm ao longo e tremulam de lado. */
const FLOW = { along: 0.014, across: 0.005 }
const PALETTE_TOKENS = ['--cosmos-blue', '--cosmos-violet', '--cosmos-magenta', '--cosmos-amber', '--cosmos-ice']
const ALPHAS = [0.35, 0.55, 0.75, 0.95] as const

export type CosmosEngine = {
  /** Relê os tokens de cor (chamar quando o tema muda). */
  refreshColors(): void
  destroy(): void
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
/** Progresso de entrada de uma partícula (cada uma com seu atraso, para não chegarem todas juntas). */
const arrival = (intro: number, delay: number) => {
  const f = clamp01((intro - delay * 0.4) / 0.6)
  return f * f * (3 - 2 * f)
}

/** Um Path2D por nível de brilho, separado em branco e azul: poucas chamadas de fill por quadro. */
type Buckets = { white: Path2D[]; blue: Path2D[] }
const makeBuckets = (): Buckets => ({
  white: ALPHAS.map(() => new Path2D()),
  blue: ALPHAS.map(() => new Path2D()),
})
const dot = (b: Buckets, x: number, y: number, size: number, level: number, blue: boolean) =>
  (blue ? b.blue : b.white)[level]?.rect(x - size / 2, y - size / 2, size, size)

/** Ponto de partida espalhado pela página (fração da largura e da altura) + atraso de chegada. */
const scattered = (count: number) => ({
  from: Float32Array.from({ length: count * 2 }, () => Math.random()),
  delay: Float32Array.from({ length: count }, () => Math.random()),
})

/** Galáxia (principal ou satélite) com o estado de entrada e o "calor" do mouse de cada partícula. */
type Body = {
  sample: GalaxySample
  shape: GalaxyShape
  core: number
  /** níveis de brilho a menos e escala dos pontos (galáxia distante) */
  dim: number
  size: number
  entry: ReturnType<typeof scattered>
}
const body = (sample: GalaxySample, shape: GalaxyShape, core: number, dim = 0, size = 1): Body => ({
  sample,
  shape,
  core,
  dim,
  size,
  entry: scattered(sample.r.length),
})

/** Faísca do rastro do mouse. */
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string }

export function startCosmos(
  { sky, logo }: { sky: HTMLCanvasElement; logo: HTMLCanvasElement },
  { reducedMotion }: { reducedMotion: boolean },
): CosmosEngine {
  const skyCtx = sky.getContext('2d')
  const logoCtx = logo.getContext('2d')
  if (!skyCtx || !logoCtx) return { refreshColors() {}, destroy() {} }
  // fixa os tipos já checados para as funções internas
  const gs: CanvasRenderingContext2D = skyCtx
  const gl: CanvasRenderingContext2D = logoCtx
  const rnd = Math.random

  // ---- dados ----
  const bodies: Body[] = [
    body(sampleGalaxy(GALAXY.count, GALAXY), GALAXY_SHAPE, 1),
    ...SATELLITES.map((s) => body(sampleCluster(s.count), s.shape, s.core)),
    body(sampleGalaxy(DISTANT.count, DISTANT), DISTANT.shape, DISTANT.core, DISTANT.dim, DISTANT.size),
  ]
  const stars = [
    ...sampleStars(STARS.count, STARS.big),
    ...sampleStars(STARS.left, 0).map((s) => ({ ...s, x: s.x * 0.5 })),
  ].map((s) => ({ ...s, fromX: rnd(), fromY: rnd(), delay: rnd() }))
  const dust = Array.from({ length: DUST }, () => ({
    x: rnd(),
    y: rnd(),
    vx: (rnd() - 0.5) * 0.004,
    vy: (rnd() - 0.5) * 0.003,
  }))
  const sparks: Spark[] = []

  const icon = sampleIcon(ICON_PATHS, ICON.count, ICON_CENTER, ICON_HEIGHT)
  const iconIn = scattered(ICON.count)
  const iconZ = Float32Array.from({ length: ICON.count }, () => (rnd() - 0.5) * 0.04) // espessura (para a inclinação 3D)
  const iconLevel = Uint8Array.from({ length: ICON.count }, () => Math.floor(rnd() * LEVELS))
  const iconScatter = Float32Array.from({ length: ICON.count * 2 }, () => (rnd() - 0.5) * 0.25)
  const off = new Float32Array(ICON.count * 2)
  const vel = new Float32Array(ICON.count * 2)
  const maxR = Math.max(...icon.radius)
  // eixo de cada palito (unitário) e fases do movimento interno
  const iconAxis = new Float32Array(ICON.count * 2)
  for (let i = 0; i < ICON.count; i++) {
    const ax = icon.pos[i * 2]! - icon.perp[i * 2]!
    const ay = icon.pos[i * 2 + 1]! - icon.perp[i * 2 + 1]!
    const len = Math.hypot(ax, ay) || 1
    iconAxis[i * 2] = ax / len
    iconAxis[i * 2 + 1] = ay / len
  }
  const iconPhase = Float32Array.from({ length: ICON.count * 2 }, () => rnd() * Math.PI * 2)

  // ---- estado ----
  let width = 0
  let height = 0
  let dpr = 1
  let fg = ''
  let blue = ''
  let palette: Rgb[] = []
  let colorsDirty = true
  let mouse: { x: number; y: number } | null = null
  let prevMouse: { x: number; y: number } | null = null
  let travel = 0 // distância percorrida pelo mouse: anda pela paleta do rastro
  let spin = 0
  let tiltX = 0
  let tiltY = 0
  let raf = 0
  const start = performance.now()
  let last = start

  const readColors = () => {
    const css = getComputedStyle(document.documentElement)
    fg = css.getPropertyValue('--fg').trim()
    blue = css.getPropertyValue('--cosmos-blue').trim() || fg
    palette = PALETTE_TOKENS.map((name) => parseRgb(css.getPropertyValue(name))).filter((c): c is Rgb => c !== null)
    colorsDirty = false
  }

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = logo.clientWidth
    height = logo.clientHeight
    for (const c of [sky, logo]) {
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
    }
    if (reducedMotion) schedule()
  }

  // os canvas ficam atrás do card: escuta a janela para o efeito continuar em volta dele
  const onMove = (e: PointerEvent) => {
    const r = logo.getBoundingClientRect()
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onLeave = () => {
    mouse = null
  }

  /** Solta faíscas ao longo do caminho do mouse desde o último quadro; a cor anda pela paleta. */
  function emitSparks(from: { x: number; y: number }, to: { x: number; y: number }) {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dist = Math.hypot(dx, dy)
    if (dist < 0.5 || palette.length === 0) return
    const n = Math.min(SPARKS.perFrame, Math.ceil(dist * SPARKS.perPx))
    for (let k = 0; k < n && sparks.length < SPARKS.max; k++) {
      const f = (k + rnd()) / n
      travel += dist / n
      const speed = 15 + rnd() * 45
      const [r, g, b] = mixPalette(palette, travel * SPARKS.colorPerPx + rnd() * 0.06)
      const max = SPARKS.lifeMin + rnd() * (SPARKS.lifeMax - SPARKS.lifeMin)
      sparks.push({
        x: from.x + dx * f + (rnd() - 0.5) * 12,
        y: from.y + dy * f + (rnd() - 0.5) * 12,
        vx: (dx / dist) * speed * 0.6 + (rnd() - 0.5) * 30,
        vy: (dy / dist) * speed * 0.6 + (rnd() - 0.5) * 30,
        life: max,
        max,
        size: 2 + rnd() * 3.5, // não muito pequenas: a camada é desfocada e ponto pequeno some
        color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
      })
    }
  }

  function frame() {
    raf = 0
    const now = performance.now()
    if (colorsDirty) readColors()
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const t = (now - start) / 1000
    if (!width || !height) {
      if (!reducedMotion) schedule() // ainda sem tamanho; com movimento reduzido o resize agenda
      return
    }
    const intro = reducedMotion ? 1 : smooth(0, 1, t / INTRO_S)

    const hover = mouse && !reducedMotion ? mouse : null

    // =================== camada do universo ===================
    gs.setTransform(dpr, 0, 0, dpr, 0, 0)
    gs.clearRect(0, 0, width, height)
    gs.globalCompositeOperation = 'lighter' // partículas somam luz (o fundo só aparece no tema escuro)
    const skyDots = makeBuckets()

    // ---- galáxias ----
    for (const b of bodies) {
      const { sample, shape, entry } = b
      for (let i = 0; i < sample.r.length; i++) {
        const i2 = i * 2
        // índices sempre válidos (todos os arrays da galáxia têm o mesmo tamanho, ou o dobro)
        const angle = sample.angle[i]! + (reducedMotion ? 0 : sample.omega[i]! * dt)
        sample.angle[i] = angle
        let [x, y] = galaxyToScreen(sample.r[i]!, angle, shape, width, height)
        const f = arrival(intro, entry.delay[i]!)
        if (f < 1) {
          x = entry.from[i2]! * width + (x - entry.from[i2]! * width) * f
          y = entry.from[i2 + 1]! * height + (y - entry.from[i2 + 1]! * height) * f
        }
        if (x < -10 || y < -10 || x > width + 10 || y > height + 10) continue
        dot(skyDots, x, y, sample.size[i]! * b.size, Math.max(0, sample.level[i]! - b.dim), false)
      }

      // núcleo: brilho elíptico (acende junto com a chegada)
      const [cx, cy] = galaxyToScreen(0, 0, shape, width, height)
      const r = shape.radius * width * 0.32 * (b === bodies[0] ? 1 : 2.2)
      gs.save()
      gs.translate(cx, cy)
      gs.rotate(shape.tilt)
      gs.scale(1, shape.incl * 1.4)
      const core = gs.createRadialGradient(0, 0, 0, 0, 0, r)
      core.addColorStop(0, fg)
      core.addColorStop(0.2, blue)
      core.addColorStop(1, 'transparent')
      gs.globalAlpha = 0.45 * GALAXY.alpha * b.core * intro
      gs.fillStyle = core
      gs.fillRect(-r, -r, r * 2, r * 2)
      gs.restore()
    }

    // ---- estrelas (as grandes ganham halo) ----
    for (const s of stars) {
      const f = arrival(intro, s.delay)
      const x = (s.fromX + (s.x - s.fromX) * f) * width
      const y = (s.fromY + (s.y - s.fromY) * f) * height
      const tw = reducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * s.twinkle + s.phase)
      dot(skyDots, x, y, s.size, Math.round(s.level * tw), false)
      if (s.big) {
        const r = s.size * 4
        const halo = gs.createRadialGradient(x, y, 0, x, y, r)
        halo.addColorStop(0, fg)
        halo.addColorStop(1, 'transparent')
        gs.globalAlpha = 0.4 * tw * f
        gs.fillStyle = halo
        gs.fillRect(x - r, y - r, r * 2, r * 2)
      }
    }

    // ---- poeira (aparece no fim da entrada) ----
    const dustOn = intro > 0.5
    for (const p of dust) {
      if (!reducedMotion) {
        p.x = (p.x + p.vx * dt + 1) % 1
        p.y = (p.y + p.vy * dt + 1) % 1
      }
      const x = p.x * width
      const y = p.y * height
      if (dustOn) dot(skyDots, x, y, 1, 0, false)
    }

    paint(gs, skyDots, GALAXY.alpha)

    // ---- rastro do mouse: faíscas coloridas que se espalham e apagam ----
    if (hover && prevMouse) emitSparks(prevMouse, hover)
    prevMouse = hover ? { ...hover } : null
    let alive = 0
    for (const s of sparks) {
      s.life -= dt
      if (s.life <= 0) continue
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.vx *= 0.96
      s.vy *= 0.96
      gs.globalAlpha = Math.pow(s.life / s.max, 1.2)
      gs.fillStyle = s.color
      gs.beginPath()
      gs.arc(s.x, s.y, (s.size * (0.5 + s.life / s.max)) / 2, 0, Math.PI * 2)
      gs.fill()
      sparks[alive++] = s
    }
    sparks.length = alive

    gs.globalAlpha = 1

    // =================== camada do logo ===================
    if (!reducedMotion) spin -= (dt * Math.PI * 2) / ICON.turn // negativo = horário (y para cima)
    // inclinação 3D: o ícone vira para o lado do mouse
    const ndcX = hover ? (hover.x / width) * 2 - 1 : 0
    const ndcY = hover ? -((hover.y / height) * 2 - 1) : 0
    tiltY += (ndcX * TILT.y - tiltY) * TILT.follow
    tiltX += (-ndcY * TILT.x - tiltX) * TILT.follow
    const [ca, sa, cb, sb] = [Math.cos(tiltX), Math.sin(tiltX), Math.cos(tiltY), Math.sin(tiltY)]

    const scale = Math.min(width, height) * ICON.size
    const cx = width * ICON.x
    const cy = height / 2
    const cs = Math.cos(spin)
    const sn = Math.sin(spin)

    const since = reducedMotion ? Infinity : (t - INTRO_S) % WAVE.every
    const waveOn = t >= INTRO_S && since < WAVE.duration + 0.4
    const wp = since / WAVE.duration
    const front = smooth(0, 1, wp) * (maxR + WAVE.band * 2) - WAVE.band
    const fade = 1 - smooth(0.85, 1.15, wp)

    // mouse no espaço do ícone (desfaz o giro; a inclinação é pequena e fica de fora)
    let mx = 1e9
    let my = 1e9
    if (hover) {
      const ux = (hover.x - cx) / scale
      const uy = -(hover.y - cy) / scale
      mx = ux * cs + uy * sn
      my = -ux * sn + uy * cs
    }

    const logoDots = makeBuckets()
    const size = Math.max(1.1, scale / 300)
    for (let i = 0; i < ICON.count; i++) {
      const i2 = i * 2
      // índices sempre válidos (todos os arrays têm ICON.count ou ICON.count * 2 posições)
      const fi = arrival(intro, iconIn.delay[i]!)
      let fromX = 0
      let fromY = 0
      if (fi < 1) {
        // ponto de partida na página, levado ao espaço do ícone (desfaz o giro, como o mouse)
        const ux = (iconIn.from[i2]! * width - cx) / scale
        const uy = -(iconIn.from[i2 + 1]! * height - cy) / scale
        fromX = ux * cs + uy * sn
        fromY = -ux * sn + uy * cs
      }
      let k = 0
      if (waveOn) {
        const dr = (icon.radius[i]! - front) / WAVE.band
        k = Math.exp(-dr * dr) * fade
      }
      const zk = k * WAVE.zoom
      const arc = Math.sin(Math.PI * fi)
      // movimento interno: corre um pouco ao longo do palito e tremula de lado
      const along = reducedMotion ? 0 : FLOW.along * Math.sin(t * 0.9 + iconPhase[i2]!)
      const across = reducedMotion ? 0 : FLOW.across * Math.sin(t * 1.7 + iconPhase[i2 + 1]!)
      const flowX = (iconAxis[i2]! * along - iconAxis[i2 + 1]! * across) * fi
      const flowY = (iconAxis[i2 + 1]! * along + iconAxis[i2]! * across) * fi
      const tx = fromX + (icon.pos[i2]! + icon.perp[i2]! * zk - fromX) * fi + iconScatter[i2]! * arc + flowX
      const ty = fromY + (icon.pos[i2 + 1]! + icon.perp[i2 + 1]! * zk - fromY) * fi + iconScatter[i2 + 1]! * arc + flowY

      // repulsão do mouse + mola de volta
      let [offX, offY] = [off[i2]!, off[i2 + 1]!]
      let [velX, velY] = [vel[i2]!, vel[i2 + 1]!]
      const dx = tx + offX - mx
      const dy = ty + offY - my
      const d2 = dx * dx + dy * dy
      if (d2 < REPEL_R * REPEL_R) {
        const d = Math.sqrt(d2) + 1e-6
        const push = (1 - d / REPEL_R) * 0.0075
        velX += (dx / d) * push
        velY += (dy / d) * push
      }
      velX = velX * 0.88 - offX * 0.035
      velY = velY * 0.88 - offY * 0.035
      offX += velX
      offY += velY
      vel[i2] = velX
      vel[i2 + 1] = velY
      off[i2] = offX
      off[i2 + 1] = offY

      // giro no plano, depois inclinação 3D (em y, depois em x) com perspectiva
      const px = tx + offX
      const py = ty + offY
      const rx = px * cs - py * sn
      const ry = px * sn + py * cs
      const x1 = rx * cb + iconZ[i]! * sb
      const z1 = -rx * sb + iconZ[i]! * cb
      const y1 = ry * ca - z1 * sa
      const z2 = ry * sa + z1 * ca
      const persp = ICON.depth / (ICON.depth - z2)
      const x = cx + x1 * persp * scale
      const y = cy - y1 * persp * scale
      dot(logoDots, x, y, size * persp, iconLevel[i]!, k * (icon.edge[i] ? 1 : WAVE.fill) > 0.3)
    }

    gl.setTransform(dpr, 0, 0, dpr, 0, 0)
    gl.clearRect(0, 0, width, height)
    gl.globalCompositeOperation = 'lighter'
    paint(gl, logoDots, ICON.alpha)
    gl.globalAlpha = 1

    if (!reducedMotion) schedule()
  }

  /** Pinta os grupos de pontos: branco em `--fg`, azul em `--cosmos-blue`. */
  function paint(g: CanvasRenderingContext2D, b: Buckets, layerAlpha: number) {
    ALPHAS.forEach((alpha, l) => {
      g.globalAlpha = alpha * layerAlpha
      g.fillStyle = fg
      g.fill(b.white[l]!)
      g.globalAlpha = Math.min(1, alpha * layerAlpha * 1.6) // o azul precisa de mais força para aparecer
      g.fillStyle = blue
      g.fill(b.blue[l]!)
    })
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(frame)
  }

  const observer = new ResizeObserver(resize)
  observer.observe(logo)
  window.addEventListener('pointermove', onMove)
  document.addEventListener('pointerleave', onLeave)
  resize()
  schedule()

  return {
    refreshColors() {
      // o <html data-theme> muda num efeito do App, que roda depois do nosso: lê no próximo quadro
      colorsDirty = true
      if (reducedMotion) schedule()
    },
    destroy() {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    },
  }
}
