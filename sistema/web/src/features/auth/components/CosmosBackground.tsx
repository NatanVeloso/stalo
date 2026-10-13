import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useResolvedTheme } from '@/shared/theme/useTheme'
import { cn } from '@/shared/lib/cn'
import { startCosmos, type CosmosEngine } from '../lib/cosmosEngine'

type Props = { className?: string }

/**
 * Fundo do login: galáxia de partículas, estrelas e o asterisco da Stalo; na entrada tudo parte de pontos
 * espalhados pela página e se organiza junto. O universo fica num canvas desfocado (fora de foco, atrás)
 * e o logo num canvas nítido por cima. Decorativo (aria-hidden). Com `prefers-reduced-motion` fica parado.
 */
export function CosmosBackground({ className = '' }: Props) {
  const skyRef = useRef<HTMLCanvasElement>(null)
  const logoRef = useRef<HTMLCanvasElement>(null)
  const engine = useRef<CosmosEngine | null>(null)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const theme = useResolvedTheme()

  useEffect(() => {
    const sky = skyRef.current
    const logo = logoRef.current
    if (!sky || !logo) return
    const e = startCosmos({ sky, logo }, { reducedMotion })
    engine.current = e
    return () => {
      e.destroy()
      engine.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    engine.current?.refreshColors()
  }, [theme])

  return (
    <div aria-hidden="true" className={cn('pointer-events-none', className)}>
      <canvas ref={skyRef} className="absolute inset-0 size-full blur-[0.1rem]" />
      <canvas ref={logoRef} className="absolute inset-0 size-full" />
    </div>
  )
}
