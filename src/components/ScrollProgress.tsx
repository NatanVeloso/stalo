import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/** Linha fina no topo da tela que cresce com o progresso do scroll. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      )
    },
    { scope: bar },
  )

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-mint to-sky"
    />
  )
}
