/**
 * Corte diagonal entre duas sections que dividem o mesmo cartão (Serviços →
 * Sobre). O triângulo tem a cor da section de baixo, então a diagonal é a
 * própria borda entre as duas; a linha fina no corte é o acento da marca.
 * Decorativo: nada aqui é lido por leitor de tela.
 */
export function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-14 bg-paper sm:h-20 md:h-28">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="divider-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ee0b0" />
            <stop offset="1" stopColor="#2f5bd6" />
          </linearGradient>
        </defs>
        <polygon points="0,100 100,0 100,100" fill="var(--color-paper-2)" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="url(#divider-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.6" />
      </svg>
    </div>
  )
}
