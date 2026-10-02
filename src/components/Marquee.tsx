import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, heavy } from '../lib/gsap'

type Props = { items: string[]; tone?: 'dark' | 'light' }

/** Faixa infinita que acelera e inverte o sentido conforme a velocidade do scroll. */
export function Marquee({ items, tone = 'dark' }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = root.current?.querySelector('.track')
      if (!track) return

      const tween = gsap.to(track, { xPercent: -50, repeat: -1, duration: 30, ease: 'none' })
      // começa "no meio" dos repeats para poder andar pra trás sem travar no 0
      tween.totalTime(tween.duration() * 500)

      heavy(() => {
        ScrollTrigger.create({
          onUpdate(self) {
            const v = self.getVelocity()
            const dir = v < 0 ? -1 : 1
            gsap.to(tween, {
              timeScale: dir * gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 250),
              duration: 0.4,
              overwrite: true,
              onComplete: () => gsap.to(tween, { timeScale: dir, duration: 1.2 }),
            })
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className={`overflow-hidden whitespace-nowrap border-y py-5 ${tone === 'light' ? 'border-navy/10' : 'border-white/10'}`}
    >
      <div className="track inline-flex w-max will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((t) => (
              <span
                key={t}
                className={`flex items-center gap-6 px-6 text-[clamp(18px,2.4vw,28px)] font-medium tracking-[-0.02em] ${
                  tone === 'light' ? 'text-navy/75' : 'text-fog/80'
                }`}
              >
                <span className="serif-italic">{t}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className={tone === 'light' ? 'text-teal' : 'text-mint'}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 0l1.4 5.6L14 7l-5.6 1.4L7 14 5.6 8.4 0 7l5.6-1.4z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
