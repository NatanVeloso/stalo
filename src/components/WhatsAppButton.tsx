import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { contact } from '../data/content'
import { CursorGlow } from './CursorGlow'

type Props = { show: boolean }

/** Botão flutuante do WhatsApp (canto inferior direito), mesmo link dos CTAs. */
export function WhatsAppButton({ show }: Props) {
  const root = useRef<HTMLAnchorElement>(null)

  // entra depois do preloader, junto com o header
  useGSAP(
    () => {
      if (!show) return
      gsap.fromTo(
        root.current,
        { y: 24, scale: 0.6, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, delay: 0.8, ease: 'back.out(1.6)' },
      )
    },
    { dependencies: [show], scope: root },
  )

  return (
    <a
      ref={root}
      data-intro
      href={contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-[65] flex items-center gap-3 md:bottom-7 md:right-7"
    >
      {/* etiqueta que aparece no hover (desktop) */}
      <span className="pointer-events-none hidden translate-x-2 whitespace-nowrap rounded-full border border-white/10 bg-[rgba(11,18,32,0.95)] px-4 py-2 text-sm font-medium text-fog opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Fale com um consultor
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.35),0_4px_12px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-300 group-hover:scale-105 group-hover:shadow-[0_14px_36px_rgba(37,211,102,0.5),0_4px_12px_rgba(0,0,0,0.3)]">
        <img src="/whatsapp.svg" alt="" className="relative h-7 w-7" />
        <CursorGlow />
      </span>
    </a>
  )
}
