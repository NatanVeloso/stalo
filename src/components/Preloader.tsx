import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { hideBoot } from '../lib/boot'
import { Logo } from './Logo'

type Props = { onDone: () => void }

/** Centro do asterisco no viewBox do logo (onde as 6 hastes se encontram). */
const MARK_CENTER = '33.4 37.3'

const SEEN_KEY = 'stalo:intro'

/** A abertura completa roda uma vez por sessão (aba); `?intro` na URL força de novo. */
function seenThisSession() {
  if (new URLSearchParams(window.location.search).has('intro')) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* sem storage: a abertura roda de novo na próxima carga */
  }
}

/**
 * Cortina de abertura: asterisco monta, wordmark sobe e a cortina sobe.
 * Quem já viu nesta sessão recebe só um fade rápido da cortina.
 */
export function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [skip] = useState(seenThisSession)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(root.current, { display: 'none' })
        hideBoot()
        onDone()
        return
      }

      let killed = false
      const tl = gsap.timeline({ paused: true })

      if (skip) {
        // o logo de carregamento do index.html some junto com a cortina
        tl.call(hideBoot, [], 0)
          .call(onDone, [], 0)
          .to(root.current, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0)
          .set(root.current, { display: 'none' })
      } else {
        hideBoot() // já vem escondido nesta carga (ver index.html); só tira do DOM
        // a origem vai dentro do próprio tween: trocar transformOrigin depois do `from` já ter
        // renderizado faz o GSAP compensar com um deslocamento e as hastes terminam fora do lugar
        tl.from('.logo-spoke', {
          scale: 0,
          svgOrigin: MARK_CENTER,
          stagger: 0.04,
          duration: 0.45,
          ease: 'back.out(1.6)',
        })
          .from('.logo-letter', { y: 18, autoAlpha: 0, stagger: 0.03, duration: 0.4 }, '-=0.35')
          .to('.logo-mark', { rotation: 180, svgOrigin: MARK_CENTER, duration: 0.55, ease: 'power3.inOut' }, '-=0.05')
          .to('.content', { yPercent: -30, autoAlpha: 0, duration: 0.4, ease: 'power3.in' }, '-=0.35')
          // libera a hero no início da subida da cortina, para ela já estar animando por baixo
          .call(
            () => {
              markSeen()
              onDone()
            },
            [],
            '-=0.25',
          )
          .to(root.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '<')
          .set(root.current, { display: 'none' })
      }

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
      {!skip && <Logo className="content h-14 w-auto md:h-16" />}
    </div>
  )
}
