import { useState } from 'react'
import { usePerfLite } from '../lib/perf'

type Props = {
  /** caminho do mp4 (ver `videos` em data/content.ts); vazio = não renderiza nada */
  src: string
  className?: string
}

/**
 * Vídeo de fundo decorativo: mudo, em loop, sem controles, cobrindo o pai
 * (que deve ser `relative` e ter uma cor de fundo, visível até o vídeo
 * aparecer). Entra com um fade quando começa a tocar, para não piscar.
 * No modo leve e com "reduzir movimento" fica parado no primeiro quadro:
 * decodificar vídeo o tempo todo é justamente o que uma máquina fraca não aguenta.
 */
export function BackgroundVideo({ src, className = '' }: Props) {
  const lite = usePerfLite()
  const [ready, setReady] = useState(false)
  if (!src) return null
  const still = lite || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const show = () => setReady(true)
  return (
    <video
      src={src}
      autoPlay={!still}
      muted
      loop={!still}
      playsInline
      preload={still ? 'metadata' : 'auto'}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={show}
      onLoadedData={show}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  )
}
