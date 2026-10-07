import { useEffect, type RefObject } from 'react'

type Options = {
  /** seletor dos itens em que o carrossel "encaixa" ao soltar; sem ele, solta onde parou */
  snapTo?: string
}

/**
 * Arrastar com o mouse para rolar um carrossel horizontal (no toque o
 * navegador já faz isso sozinho). Só pointer do tipo mouse. Enquanto arrasta,
 * o scroll-snap é desligado (senão ele "puxa" o conteúdo de volta a cada
 * pixel); ao soltar, anima até o item mais próximo na direção do movimento e
 * religa o snap. Um arraste curto (< 6px) conta como clique normal.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, { snapTo }: Options = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let startX = 0
    let startLeft = 0
    let lastX = 0
    let velocity = 0
    let dragging = false
    let moved = false
    let restore = 0

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      moved = false
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      velocity = 0
      window.clearTimeout(restore)
      el.style.scrollSnapType = 'none'
      el.style.scrollBehavior = 'auto'
      el.setPointerCapture(e.pointerId)
    }

    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) < 6) return
      moved = true
      el.dataset.dragging = ''
      velocity = e.clientX - lastX
      lastX = e.clientX
      el.scrollLeft = startLeft - dx
    }

    const up = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      delete el.dataset.dragging
      el.style.scrollBehavior = ''

      if (moved && snapTo) {
        // encaixa no item mais próximo, puxando um pouco para o lado do movimento.
        // Posição do item medida em relação ao scroller (offsetLeft seria relativo ao
        // offsetParent), descontando o padding, que é onde o scroll-snap alinha.
        const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0
        const base = el.getBoundingClientRect().left - el.scrollLeft + padding
        const target = el.scrollLeft - velocity * 6
        const items = Array.from(el.querySelectorAll<HTMLElement>(snapTo))
        let best = el.scrollLeft
        let bestDist = Infinity
        for (const item of items) {
          const left = item.getBoundingClientRect().left - base
          const dist = Math.abs(left - target)
          if (dist < bestDist) {
            bestDist = dist
            best = left
          }
        }
        el.scrollTo({ left: best, behavior: 'smooth' })
        restore = window.setTimeout(() => (el.style.scrollSnapType = ''), 500)
      } else {
        el.style.scrollSnapType = ''
      }
    }

    // um clique dentro do carrossel logo depois de arrastar não deve "disparar" nada
    const click = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation()
        e.preventDefault()
        moved = false
      }
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('click', click, true)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('click', click, true)
      window.clearTimeout(restore)
    }
  }, [ref, snapTo])
}
