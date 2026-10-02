import type { ReactNode } from 'react'

type Props = {
  id?: string
  /** Ordem de empilhamento — cada section cobre a anterior. */
  z: number
  /** Primeira section (hero) não tem borda arredondada. */
  rounded?: boolean
  className?: string
  innerClassName?: string
  children: ReactNode
}

/**
 * Section "empilhável": o App fixa (pin) cada uma quando o fundo encosta no
 * viewport e a próxima desliza por cima como um cartão. O wrapper interno é o
 * que encolhe/escurece durante a transição — o pin usa transform na section,
 * então o scale precisa ficar em outro elemento.
 */
export function StackSection({ id, z, rounded = true, className = '', innerClassName = '', children }: Props) {
  const radius = rounded ? 'rounded-t-[28px] md:rounded-t-[40px]' : ''
  return (
    <section
      id={id}
      data-stack
      style={{ zIndex: z }}
      className={`relative overflow-hidden ${radius} ${rounded ? 'shadow-[0_-24px_80px_rgba(0,0,0,0.45)]' : ''} ${className}`}
    >
      {/* min-h-screen é obrigatório: uma section mais baixa que o viewport encosta no fundo
          antes do pin anterior terminar e as duas ficam presas ao mesmo tempo */}
      <div
        data-stack-inner
        className={`relative flex min-h-screen flex-col overflow-hidden will-change-transform ${radius} ${innerClassName}`}
      >
        {children}
        <div data-stack-shade className="pointer-events-none absolute inset-0 z-40 bg-ink opacity-0" />
      </div>
    </section>
  )
}
