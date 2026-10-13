/**
 * Corte diagonal entre duas sections que dividem o mesmo cartão (Serviços →
 * Sobre). Aqui fica só o espaço e a linha fina de acento: quem desenha o
 * triângulo é a section de baixo, que sobe por cima deste espaço (margem
 * negativa) recortada em diagonal por clip-path (ver About.tsx). Assim a cor
 * do triângulo é a da própria section, com grão e grade inclusos; um SVG
 * pintado à parte nunca batia exatamente. As alturas (h-14/20/28) têm que
 * casar com a margem e o clip-path do About. Decorativo: nada aqui é lido
 * por leitor de tela.
 */
export function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative z-[1] h-14 sm:h-20 md:h-28">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="divider-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ee0b0" />
            <stop offset="1" stopColor="#2f5bd6" />
          </linearGradient>
        </defs>
        <line x1="0" y1="100" x2="100" y2="0" stroke="url(#divider-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.6" />
      </svg>
    </div>
  )
}
