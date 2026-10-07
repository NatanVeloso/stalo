import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultLocale, locales, type Locale } from '@/shared/i18n/locales'

/**
 * Preferências do navegador (não vão para o back): tema e idioma.
 * A chave do localStorage é lida também pelo script inline do index.html,
 * que aplica o tema antes do primeiro paint.
 */
export type ThemePref = 'light' | 'dark' | 'system'
/** Escala da fonte raiz: tudo em rem acompanha (texto, espaçamento, raios). */
export type FontSizePref = 'sm' | 'md' | 'lg'
/** Densidade: compacta reduz paddings, altura de linha e de gráfico (tokens em styles/index.css). */
export type DensityPref = 'comfortable' | 'compact'

export const fontSizePx: Record<FontSizePref, number> = { sm: 14, md: 16, lg: 18 }

type PrefsState = {
  theme: ThemePref
  locale: Locale
  fontSize: FontSizePref
  density: DensityPref
  setTheme: (theme: ThemePref) => void
  setLocale: (locale: Locale) => void
  setFontSize: (fontSize: FontSizePref) => void
  setDensity: (density: DensityPref) => void
}

function browserLocale(): Locale {
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('pt')) return 'pt-BR'
  const found = locales.find((l) => lang.startsWith(l.toLowerCase().slice(0, 2)))
  return found ?? defaultLocale
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      theme: 'system',
      locale: browserLocale(),
      fontSize: 'md',
      density: 'comfortable',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setFontSize: (fontSize) => set({ fontSize }),
      setDensity: (density) => set({ density }),
    }),
    { name: 'stalo-sistema:prefs' },
  ),
)
