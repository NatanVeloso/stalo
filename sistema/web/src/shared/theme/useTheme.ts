import { useEffect, useSyncExternalStore } from 'react'
import { fontSizePx, usePrefs, type ThemePref } from '@/shared/prefs/prefs.store'

export type ResolvedTheme = 'light' | 'dark'

const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function subscribeSystem(cb: () => void) {
  const mq = media()
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function useSystemDark() {
  return useSyncExternalStore(
    subscribeSystem,
    () => media().matches,
    () => false,
  )
}

/** Tema efetivo (claro/escuro), já resolvido quando a preferência é "sistema". */
export function useResolvedTheme(): ResolvedTheme {
  const pref = usePrefs((s) => s.theme)
  const systemDark = useSystemDark()
  return pref === 'system' ? (systemDark ? 'dark' : 'light') : pref
}

/**
 * Aplica `<html data-theme>`, `<html lang>`, `data-density` e o `font-size` raiz
 * quando a preferência muda. Montar uma vez, no App. O primeiro paint já vem
 * certo pelo script do index.html (mesma chave de localStorage).
 */
export function useApplyPrefs() {
  const theme = useResolvedTheme()
  const locale = usePrefs((s) => s.locale)
  const fontSize = usePrefs((s) => s.fontSize)
  const density = usePrefs((s) => s.density)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePx[fontSize]}px`
    document.documentElement.dataset.density = density
  }, [fontSize, density])
}

/** `true` no modo compacto: para componentes que precisam de valor em JS (altura de gráfico). */
export function useCompact() {
  return usePrefs((s) => s.density === 'compact')
}

export function useThemePref(): [ThemePref, (t: ThemePref) => void] {
  const pref = usePrefs((s) => s.theme)
  const setTheme = usePrefs((s) => s.setTheme)
  return [pref, setTheme]
}
