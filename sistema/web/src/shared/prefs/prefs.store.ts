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
/** Densidade: média e compacta reduzem paddings, altura de linha e de gráfico (tokens em styles/index.css);
 * a compacta encolhe também a fonte raiz. */
export type DensityPref = 'comfortable' | 'medium' | 'compact'

export const fontSizePx: Record<FontSizePref, number> = { sm: 14, md: 16, lg: 18 }
/** No modo compacto a fonte raiz encolhe este tanto (mesmo valor no script do index.html). */
export const compactFontScale = 0.92

/** Tamanho da fonte raiz em px para a combinação de preferências. */
export function rootFontPx(fontSize: FontSizePref, density: DensityPref) {
  return Math.round(fontSizePx[fontSize] * (density === 'compact' ? compactFontScale : 1) * 10) / 10
}

/** Sons do atendimento: ao enviar uma mensagem e ao chegar mensagem do contato. */
export type SomPref = 'somAoEnviar' | 'somAoReceber'

type PrefsState = {
  theme: ThemePref
  locale: Locale
  fontSize: FontSizePref
  density: DensityPref
  somAoEnviar: boolean
  somAoReceber: boolean
  setTheme: (theme: ThemePref) => void
  setLocale: (locale: Locale) => void
  setFontSize: (fontSize: FontSizePref) => void
  setDensity: (density: DensityPref) => void
  setSom: (som: SomPref, on: boolean) => void
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
      somAoEnviar: true,
      somAoReceber: true,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setFontSize: (fontSize) => set({ fontSize }),
      setDensity: (density) => set({ density }),
      setSom: (som, on) => set({ [som]: on }),
    }),
    { name: 'stalo-sistema:prefs' },
  ),
)
