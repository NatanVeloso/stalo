import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** `true` a partir do breakpoint `lg` do Tailwind (sidebar fixa). */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 64rem)')
}
