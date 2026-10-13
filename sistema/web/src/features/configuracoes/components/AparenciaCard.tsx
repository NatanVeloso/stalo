import type { ReactNode } from 'react'
import { AlignJustify, Monitor, Moon, Rows3, Rows4, Sun } from 'lucide-react'
import { useT, locales, localeLabels } from '@/shared/i18n'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { useThemePref } from '@/shared/theme/useTheme'
import { Card, CardHeader, Flag, Segmented } from '@/shared/ui'

/** Preferências deste navegador (tema, idioma, fonte, densidade). Ficam no store persistido, não na API. */
export function AparenciaCard() {
  const t = useT()
  const [theme, setTheme] = useThemePref()
  const locale = usePrefs((s) => s.locale)
  const setLocale = usePrefs((s) => s.setLocale)
  const fontSize = usePrefs((s) => s.fontSize)
  const setFontSize = usePrefs((s) => s.setFontSize)
  const density = usePrefs((s) => s.density)
  const setDensity = usePrefs((s) => s.setDensity)

  return (
    <Card>
      <CardHeader
        title={t.configuracoes.sections.aparencia.title}
        description={t.configuracoes.sections.aparencia.description}
      />
      <div className="flex flex-col gap-5">
        <Linha label={t.common.theme.label}>
          <Segmented
            label={t.common.theme.label}
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: t.common.theme.light, icon: <Sun /> },
              { value: 'dark', label: t.common.theme.dark, icon: <Moon /> },
              { value: 'system', label: t.common.theme.system, icon: <Monitor /> },
            ]}
          />
        </Linha>
        <Linha label={t.common.language}>
          <Segmented
            label={t.common.language}
            value={locale}
            onChange={setLocale}
            options={locales.map((l) => ({
              value: l,
              label: localeLabels[l].name,
              icon: <Flag locale={l} className="size-4" />,
            }))}
          />
        </Linha>
        <Linha label={t.common.fontSize.label}>
          <Segmented
            label={t.common.fontSize.label}
            value={fontSize}
            onChange={setFontSize}
            options={[
              { value: 'sm', label: <span className="text-xs">{t.common.fontSize.sm}</span> },
              { value: 'md', label: t.common.fontSize.md },
              { value: 'lg', label: <span className="text-title">{t.common.fontSize.lg}</span> },
            ]}
          />
        </Linha>
        <Linha label={t.common.density.label}>
          <Segmented
            label={t.common.density.label}
            value={density}
            onChange={setDensity}
            options={[
              { value: 'compact', label: t.common.density.compact, icon: <AlignJustify /> },
              { value: 'medium', label: t.common.density.medium, icon: <Rows4 /> },
              { value: 'comfortable', label: t.common.density.comfortable, icon: <Rows3 /> },
            ]}
          />
        </Linha>
      </div>
    </Card>
  )
}

function Linha({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  )
}
