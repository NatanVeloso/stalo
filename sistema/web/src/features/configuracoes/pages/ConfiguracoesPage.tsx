import { Monitor, Moon, Sun, Laptop, Smartphone, AlignJustify, Rows3 } from 'lucide-react'
import { useT, locales, localeLabels } from '@/shared/i18n'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { useThemePref } from '@/shared/theme/useTheme'
import { useCurrentUser } from '@/shared/auth'
import { PageHeader } from '@/shared/layout'
import { Avatar, Button, Card, CardHeader, Field, Flag, Input, Segmented } from '@/shared/ui'

export function ConfiguracoesPage() {
  const t = useT()
  const user = useCurrentUser()
  const [theme, setTheme] = useThemePref()
  const locale = usePrefs((s) => s.locale)
  const setLocale = usePrefs((s) => s.setLocale)
  const fontSize = usePrefs((s) => s.fontSize)
  const setFontSize = usePrefs((s) => s.setFontSize)
  const density = usePrefs((s) => s.density)
  const setDensity = usePrefs((s) => s.setDensity)

  return (
    <>
      <PageHeader title={t.configuracoes.title} description={t.configuracoes.subtitle} />

      <div className="animate-rise grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title={t.configuracoes.sections.perfil.title}
            description={t.configuracoes.sections.perfil.description}
          />
          {user && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar name={user.nome} size="lg" />
                <div>
                  <p className="font-medium">{user.nome}</p>
                  <p className="text-[13px] text-fg-muted">{t.common.roles[user.role]}</p>
                </div>
              </div>
              <Field label={t.configuracoes.fields.nome}>
                {({ id }) => <Input id={id} defaultValue={user.nome} />}
              </Field>
              <Field label={t.configuracoes.fields.email}>
                {({ id }) => <Input id={id} type="email" defaultValue={user.email} />}
              </Field>
              <div className="flex justify-end">
                <Button>{t.common.actions.save}</Button>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title={t.configuracoes.sections.aparencia.title}
              description={t.configuracoes.sections.aparencia.description}
            />
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.common.theme.label}</span>
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
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.common.language}</span>
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
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.common.fontSize.label}</span>
                <Segmented
                  label={t.common.fontSize.label}
                  value={fontSize}
                  onChange={setFontSize}
                  options={[
                    { value: 'sm', label: <span className="text-xs">{t.common.fontSize.sm}</span> },
                    { value: 'md', label: t.common.fontSize.md },
                    { value: 'lg', label: <span className="text-[15px]">{t.common.fontSize.lg}</span> },
                  ]}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.common.density.label}</span>
                <Segmented
                  label={t.common.density.label}
                  value={density}
                  onChange={setDensity}
                  options={[
                    { value: 'comfortable', label: t.common.density.comfortable, icon: <Rows3 /> },
                    { value: 'compact', label: t.common.density.compact, icon: <AlignJustify /> },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title={t.configuracoes.sections.seguranca.title}
              description={t.configuracoes.sections.seguranca.description}
              actions={
                <Button variant="secondary" size="sm">
                  {t.configuracoes.changePassword}
                </Button>
              }
            />
            <p className="mb-2 text-[13px] font-medium text-fg-muted">{t.configuracoes.sessions.title}</p>
            <ul className="flex flex-col divide-y divide-line">
              <li className="flex items-center gap-3 py-3">
                <Laptop className="size-4 text-fg-muted" aria-hidden="true" />
                <span className="flex-1 text-sm">Windows · Chrome</span>
                <span className="text-xs text-ok">{t.configuracoes.sessions.current}</span>
              </li>
              <li className="flex items-center gap-3 py-3">
                <Smartphone className="size-4 text-fg-muted" aria-hidden="true" />
                <span className="flex-1 text-sm">iPhone · Safari</span>
                <Button variant="ghost" size="sm">
                  {t.configuracoes.sessions.revoke}
                </Button>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
