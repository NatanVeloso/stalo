import { useEffect, useRef } from 'react'

/**
 * Brilho na borda que acompanha o cursor (estilo botão "Modo IA" do Google).
 * Coloque como último filho de um botão/link com `position: relative`; ele
 * escuta o mousemove do pai e move o centro do gradiente via CSS vars.
 * O desenho fica em `.cursor-glow` no index.css.
 */
export function CursorGlow() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      const r = host.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    host.addEventListener('mousemove', move)
    return () => host.removeEventListener('mousemove', move)
  }, [])

  return <span ref={ref} aria-hidden="true" className="cursor-glow" />
}
