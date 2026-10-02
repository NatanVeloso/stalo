import { gsap, SplitText } from './gsap'

type Options = {
  /** Elemento que dispara o ScrollTrigger (padrão: o próprio alvo). */
  trigger?: Element | null
  start?: string
  stagger?: number
}

/**
 * Revelação de título estilo gsap.com: quebra em linhas mascaradas e cada
 * palavra sobe de dentro da máscara. `autoSplit` refaz a quebra em resize
 * e quando a fonte termina de carregar.
 */
export function revealLines(target: Element | Element[] | null, { trigger, start = 'top 85%', stagger = 0.05 }: Options = {}) {
  if (!target || (Array.isArray(target) && !target.length)) return
  return SplitText.create(target, {
    type: 'lines,words',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 130, // a máscara tem folga embaixo (.split-line-mask), então precisa descer mais para sumir
        stagger,
        duration: 1.2,
        ease: 'hero',
        scrollTrigger: {
          trigger: trigger ?? (Array.isArray(target) ? target[0] : target),
          start,
          once: true,
        },
      }),
  })
}
