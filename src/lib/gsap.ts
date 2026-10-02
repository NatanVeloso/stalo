import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { perf } from './perf'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrambleTextPlugin,
  CustomEase,
)

// Easings compartilhados — "hero" é uma expo-out suave usada nas revelações grandes.
CustomEase.create('hero', 'M0,0 C0.16,1 0.3,1 1,1')
CustomEase.create('soft', 'M0,0 C0.25,0.1 0.25,1 1,1')

gsap.defaults({ ease: 'hero', duration: 1 })

ScrollTrigger.config({ ignoreMobileResize: true })

/** Media query usada em gsap.matchMedia() para pular animações pesadas. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

type Scope = { current: Element | null } | Element | string

type HeavyEntry = { ctx: gsap.Context; lite?: () => void; scope?: Scope }
const heavyEntries = new Set<HeavyEntry>()

function scopeAlive(scope?: Scope) {
  if (!scope) return true
  if (typeof scope === 'string') return !!document.querySelector(scope)
  const el = 'current' in scope ? scope.current : scope
  return !!el && el.isConnected
}

/**
 * Efeito "pesado" (scrub, parallax, pin, ScrollSmoother): só roda no modo
 * `full` (ver lib/perf.ts). Se a máquina for rebaixada para `lite` com a
 * página aberta, o contexto é revertido na hora e o `lite` opcional roda no
 * lugar (ex.: versão empilhada de uma section que era horizontal).
 *
 * Use dentro de um `useGSAP`: o contexto aninhado é revertido junto no unmount.
 */
export function heavy(full: () => void | (() => void), opts: { lite?: () => void; scope?: Scope } = {}) {
  if (perf.lite) {
    opts.lite?.()
    return
  }
  const ctx = gsap.context(full, opts.scope as Element | string | object)
  heavyEntries.add({ ctx, lite: opts.lite, scope: opts.scope })
}

perf.subscribe(() => {
  if (!perf.lite) return
  ScrollSmoother.get()?.kill()
  heavyEntries.forEach((e) => {
    e.ctx.revert()
    if (e.lite && scopeAlive(e.scope)) gsap.context(e.lite, e.scope as Element | string | object)
  })
  heavyEntries.clear()
  ScrollTrigger.refresh()
})

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText }
