import { useSyncExternalStore } from 'react'

/**
 * Modo de performance do site.
 *
 * `full`: tudo ligado (liquid glass, vidro com blur, ScrollSmoother, parallax).
 * `lite`: mesma aparência com versões baratas (sem backdrop-filter, scroll
 * nativo, sem animações presas ao scroll). Entra em máquinas fracas.
 *
 * O modo vai para `<html data-perf="...">` (o CSS lê) e para quem assinar
 * `subscribe` (o GSAP lê via `heavy()` em lib/gsap.ts).
 *
 * Decisão: 1) `?perf=lite|full|auto` na URL força/limpa; 2) decisão guardada
 * no localStorage (só `lite` é guardado, por 7 dias); 3) heurística de
 * hardware; 4) medição real de fps no carregamento e no primeiro scroll.
 */
export type PerfMode = 'full' | 'lite'

const KEY = 'stalo:perf'
const TTL = 7 * 24 * 60 * 60 * 1000
const listeners = new Set<() => void>()
let mode: PerfMode = 'full'
let forced = false

type Saved = { mode: PerfMode; t: number; forced?: boolean }

function read(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Saved
    if (!s.forced && Date.now() - s.t > TTL) return null
    return s
  } catch {
    return null
  }
}

function save(s: Saved | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s))
    else localStorage.removeItem(KEY)
  } catch {
    /* sem storage: decide de novo na próxima visita */
  }
}

function apply(next: PerfMode) {
  if (next === mode) return
  mode = next
  document.documentElement.dataset.perf = next
  listeners.forEach((fn) => fn())
}

function heuristic(): PerfMode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'lite'
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory && nav.deviceMemory < 4) return 'lite'
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return 'lite'
  return 'full'
}

/** Decide o modo inicial. Chamar antes do primeiro render. */
export function initPerf(): PerfMode {
  const q = new URLSearchParams(window.location.search).get('perf')
  let next: PerfMode
  if (q === 'lite' || q === 'full') {
    save({ mode: q, t: Date.now(), forced: true })
    forced = true
    next = q
  } else {
    if (q === 'auto') save(null)
    const saved = read()
    if (saved) {
      forced = !!saved.forced
      next = saved.mode
    } else {
      next = heuristic()
    }
  }
  mode = next
  document.documentElement.dataset.perf = next

  // Atalho de suporte/teste no console: staloPerf.set('lite' | 'full' | 'auto')
  ;(window as unknown as { staloPerf: unknown }).staloPerf = {
    get mode() {
      return mode
    },
    set(m: PerfMode | 'auto') {
      if (m === 'auto') {
        save(null)
        forced = false
        apply(heuristic())
        return
      }
      save({ mode: m, t: Date.now(), forced: true })
      forced = true
      apply(m)
    },
  }
  return next
}

/**
 * Mede a taxa de frames por `ms` e resolve `true` se a máquina deu conta.
 * Aborta (resolve `true`) se a aba ficar oculta, porque o rAF para e a
 * medição ficaria falsa. Os primeiros 300 ms são descartados (aquecimento).
 */
function measure(ms: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.hidden) return resolve(true)
    let hidden = false
    const onVis = () => {
      if (document.hidden) hidden = true
    }
    document.addEventListener('visibilitychange', onVis)

    const start = performance.now()
    let last = start
    let frames = 0
    let long = 0
    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (now - start > 300) {
        frames++
        if (dt > 50) long++
      }
      if (hidden) {
        document.removeEventListener('visibilitychange', onVis)
        return resolve(true)
      }
      if (now - start < ms) return requestAnimationFrame(tick)
      document.removeEventListener('visibilitychange', onVis)
      const fps = frames / ((ms - 300) / 1000)
      const longRatio = frames ? long / frames : 0
      resolve(fps >= 40 && longRatio < 0.15)
    }
    requestAnimationFrame(tick)
  })
}

/**
 * Liga as medições reais: uma janela de 2 s já no carregamento (durante o
 * preloader) e outra de 1,5 s no primeiro scroll do usuário. Qualquer uma
 * reprovando troca para `lite` na hora e guarda a decisão por 7 dias.
 */
export function watchPerf() {
  if (mode === 'lite' || forced) return

  const fail = () => {
    save({ mode: 'lite', t: Date.now() })
    apply('lite')
  }

  measure(2000).then((ok) => {
    if (!ok) fail()
  })

  const onScroll = () => {
    window.removeEventListener('wheel', onScroll)
    window.removeEventListener('touchmove', onScroll)
    if (mode === 'lite') return
    measure(1500).then((ok) => {
      if (!ok) fail()
    })
  }
  window.addEventListener('wheel', onScroll, { passive: true })
  window.addEventListener('touchmove', onScroll, { passive: true })
}

export const perf = {
  get mode() {
    return mode
  },
  get lite() {
    return mode === 'lite'
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

/** Hook: `true` quando o site está no modo leve. Re-renderiza na troca. */
export function usePerfLite() {
  return useSyncExternalStore(perf.subscribe, () => mode === 'lite')
}
