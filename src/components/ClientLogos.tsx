import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { clients } from '../data/content'
import { t } from '../i18n'

type Props = { className?: string }

/** Quantas vezes a lista se repete em cada metade da faixa, para passar da largura de qualquer tela. */
const REPEAT = 4

/**
 * Carrossel infinito com os logos dos clientes, na base da hero. A faixa tem
 * duas metades iguais e anda até -50%, então o laço fecha sem emenda. Os logos
 * são arquivos claros, feitos para fundo escuro.
 */
export function ClientLogos({ className = '' }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = root.current?.querySelector('.track')
      if (!track) return

      // com "reduzir movimento" a faixa fica parada mostrando os primeiros logos
      gsap.matchMedia().add(MOTION_OK, () => {
        const tween = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          ease: 'none',
          duration: clients.length * REPEAT * 5,
        })
        // desacelera com o cursor em cima, para dar tempo de reconhecer um logo
        const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6, overwrite: true })
        const normal = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true })
        track.addEventListener('mouseenter', slow)
        track.addEventListener('mouseleave', normal)
        return () => {
          track.removeEventListener('mouseenter', slow)
          track.removeEventListener('mouseleave', normal)
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`flex flex-col gap-3 md:flex-row md:items-center md:gap-10 ${className}`}>
      <p className="m-0 shrink-0 text-[12px] uppercase tracking-[0.14em] text-fog/60">{t.clients.label}</p>
      <div className="min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] md:flex-1">
        <div className="track flex w-max will-change-transform">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
              {Array.from({ length: REPEAT }, (_, rep) =>
                clients.map((c) => (
                  // margem em vez de gap: as duas metades precisam ter exatamente a mesma largura
                  <img
                    key={`${rep}-${c.name}`}
                    src={c.src}
                    alt={half === 0 && rep === 0 ? c.name : ''}
                    decoding="async"
                    className="mx-7 h-8 w-auto max-w-[120px] object-contain opacity-75 md:mx-10 md:h-9 md:max-w-[140px]"
                  />
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
