import { useEffect, useRef } from 'react'
import { usePerfLite } from '../lib/perf'

type Props = {
  /** caminho do mp4 (ver `videos` em data/content.ts); vazio = não renderiza nada */
  src: string
  /** versão menor (ex.: 720p) para o modo leve; sem ela vai o mesmo arquivo */
  liteSrc?: string
  /** imagem do primeiro quadro: aparece antes do vídeo carregar e no lugar dele com "reduzir movimento" */
  poster: string
  className?: string
}

/**
 * Vídeo de fundo decorativo: mudo, em loop, sem controles, cobrindo o pai
 * (que deve ser `relative`). O poster cobre a espera pelo primeiro quadro. No
 * modo leve toca a versão menor (`liteSrc`); com "reduzir movimento" fica só o
 * poster. O mp4 precisa ser H.264 (avc1), 8 bits: HEVC não toca na maioria dos Android.
 */
export function BackgroundVideo({ src, liteSrc, poster, className = '' }: Props) {
  const lite = usePerfLite()
  const video = useRef<HTMLVideoElement>(null)
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const file = lite && liteSrc ? liteSrc : src

  // O React define `muted` só como propriedade, e o autoplay no celular exige o
  // atributo no elemento; o play() explícito cobre o autoplay ignorado.
  useEffect(() => {
    const el = video.current
    if (!el || still) return
    el.muted = true
    el.defaultMuted = true
    el.setAttribute('muted', '')
    el.play().catch(() => {
      /* bloqueado (ex.: economia de bateria no iPhone): fica o poster */
    })
  }, [still, file])

  if (!src) return null
  const cover = `pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`
  if (still) return <img src={poster} alt="" className={cover} />
  return (
    <video
      ref={video}
      src={file}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className={cover}
    />
  )
}
