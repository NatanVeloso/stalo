import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Logo } from './Logo'

type Props = { onDone: () => void }

/** Centro do asterisco no viewBox do logo (onde as 6 hastes se encontram). */
const MARK_CENTER = '33.4 37.3'

/** Cortina de abertura: asterisco monta, wordmark sobe, barra carrega e a cortina sobe. */
export function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(root.current, { display: 'none' })
        onDone()
        return
      }

      const progress = { v: 0 }
      let killed = false
      const tl = gsap.timeline({ paused: true })

      // a origem vai dentro do próprio tween: trocar transformOrigin depois do `from` já ter
      // renderizado faz o GSAP compensar com um deslocamento e as hastes terminam fora do lugar
      tl.from('.logo-spoke', {
        scale: 0,
        svgOrigin: MARK_CENTER,
        stagger: 0.07,
        duration: 0.7,
        ease: 'back.out(1.6)',
      })
        .from('.logo-letter', { y: 18, autoAlpha: 0, stagger: 0.05, duration: 0.6 }, '-=0.35')
        .to(
          progress,
          {
            v: 100,
            duration: 1.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(progress.v)).padStart(3, '0')
            },
          },
          '<',
        )
        .fromTo('.bar', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut', transformOrigin: '0 50%' }, '<')
        .to('.logo-mark', { rotation: 180, svgOrigin: MARK_CENTER, duration: 0.9, ease: 'power3.inOut' }, '-=0.2')
        .to('.content', { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '-=0.45')
        // libera a hero no início da subida da cortina, para ela já estar animando por baixo
        .call(onDone, [], '-=0.3')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '<')
        .set(root.current, { display: 'none' })

      // só começa com as fontes prontas, para a hero não "pular" ao aparecer
      document.fonts.ready.then(() => {
        if (!killed) tl.play()
      })
      return () => {
        killed = true
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-fog">
      <div className="content flex w-[min(80vw,340px)] flex-col items-center gap-8">
        <Logo className="h-14 w-auto md:h-16" />
        <div className="w-full">
          <div className="h-px w-full bg-white/10">
            <div className="bar h-px w-full bg-mint" />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            <span>Carregando</span>
            <span ref={counter}>000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
