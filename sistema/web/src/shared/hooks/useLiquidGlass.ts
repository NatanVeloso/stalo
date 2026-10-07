import { useEffect, useState, type RefObject } from 'react'

export type LiquidGlassMap = {
  width: number
  height: number
  /** PNG (data URL) com o deslocamento: R = eixo X, G = eixo Y, 128 = neutro. */
  map: string
  /** Deslocamento máximo em px — vai no `scale` do feDisplacementMap. */
  scale: number
}

type Options = {
  /** Largura da faixa de distorção na borda, em fração da altura (0–1). */
  band?: number
  /** Força do deslocamento na borda, em fração da altura. */
  strength?: number
}

/** Só o Chromium renderiza `backdrop-filter: url(#svg)`; Safari parseia mas ignora. */
function supported() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return false
  return 'chrome' in window && CSS.supports('backdrop-filter', 'url(#x)')
}

/**
 * Mapa de deslocamento de uma pílula (cápsula): cada pixel da faixa da borda
 * puxa a amostra do fundo para dentro, seguindo a normal da cápsula, com
 * intensidade que cai a zero no centro — o efeito "lente" do liquid glass.
 */
function buildMap(width: number, height: number, band: number, strength: number): LiquidGlassMap {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)
  const data = img.data

  const hw = w / 2
  const hh = h / 2
  const r = hh
  const axis = Math.max(0, hw - r)
  const edge = Math.max(1, h * band)
  const scale = Math.max(1, h * strength)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hw
      const py = y + 0.5 - hh
      const qx = Math.max(-axis, Math.min(axis, px))
      const dx = px - qx
      const dy = py
      const dist = Math.hypot(dx, dy)
      const sd = dist - r
      const t = Math.max(0, Math.min(1, 1 + sd / edge))
      const s = t * t * (3 - 2 * t)
      const f = Math.pow(s, 1.5)
      const nx = dist > 0 ? dx / dist : 0
      const ny = dist > 0 ? dy / dist : 0
      const i = (y * w + x) * 4
      data[i] = Math.round(128 - nx * f * 127)
      data[i + 1] = Math.round(128 - ny * f * 127)
      data[i + 2] = 128
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return { width: w, height: h, map: canvas.toDataURL('image/png'), scale }
}

/**
 * Liquid glass de verdade (refração nas bordas) para UMA pílula fixa por tela.
 * Mede o elemento e devolve o mapa (refeito em cada resize). Devolve `null`
 * quando não dá para usar: o componente cai no vidro comum (`glass`).
 */
export function useLiquidGlass(ref: RefObject<HTMLElement | null>, { band = 0.42, strength = 0.75 }: Options = {}) {
  const [glass, setGlass] = useState<LiquidGlassMap | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !supported()) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const { width, height } = el.getBoundingClientRect()
        if (width && height) setGlass(buildMap(width, height, band, strength))
      })
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [ref, band, strength])

  return glass
}
