import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useT, type Dictionary } from '@/shared/i18n'
import { LanguageMenu } from '@/shared/i18n/LanguageMenu'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { useAuth, type Role } from '@/shared/auth'
import { env } from '@/shared/lib/env'
import { ApiError } from '@/shared/lib/http'
import { Button, Card, Field, Input, Logo } from '@/shared/ui'
import { DemoAccounts } from '../components/DemoAccounts'

/** O schema recebe o dicionário para as mensagens saírem no idioma atual. */
const schema = (t: Dictionary['auth']['errors']) =>
  z.object({
    email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
    password: z.string().min(1, t.passwordRequired).min(6, t.passwordMin),
    remember: z.boolean(),
  })

type Form = z.infer<ReturnType<typeof schema>>

export function LoginPage() {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuth((s) => s.login)
  const [show, setShow] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<Form>({
    resolver: zodResolver(schema(t.auth.errors)),
    defaultValues: { email: '', password: '', remember: true },
  })

  const submit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values.email, values.password)
      const from = (location.state as { from?: string } | null)?.from
      void navigate(from && from !== '/login' ? from : '/', { replace: true })
    } catch (e) {
      setFormError(e instanceof ApiError && e.status === 401 ? t.auth.errors.invalid : t.common.errors.generic)
    }
  })

  const fillDemo = (role: Role) => {
    const emails: Record<Role, string> = {
      admin: 'admin@stalo.com.br',
      contador: 'contador@stalo.com.br',
      assistente: 'assistente@stalo.com.br',
      cliente: 'cliente@stalo.com.br',
    }
    form.setValue('email', emails[role], { shouldValidate: true })
    form.setValue('password', '123456', { shouldValidate: true })
    form.setFocus('password')
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="orbs" aria-hidden="true" />

      <div className="absolute top-4 right-4 flex items-center gap-1">
        <ThemeToggle variant="glass" />
        <LanguageMenu variant="glass" />
      </div>

      <Card tone="strong" padding="lg" className="animate-rise w-full max-w-[420px]">
        <Logo className="h-7 w-auto text-fg" />
        <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">{t.auth.title}</h1>
        <p className="mt-1 text-sm text-fg-muted">{t.auth.subtitle}</p>

        <form onSubmit={submit} noValidate className="mt-7 flex flex-col gap-4">
          <Field label={t.auth.email} error={form.formState.errors.email?.message}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type="email"
                autoComplete="email"
                placeholder={t.auth.emailPlaceholder}
                aria-describedby={describedBy}
                invalid={invalid}
                leading={<Mail />}
                {...form.register('email')}
              />
            )}
          </Field>
          <Field label={t.auth.password} error={form.formState.errors.password?.message}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={t.auth.passwordPlaceholder}
                aria-describedby={describedBy}
                invalid={invalid}
                leading={<Lock />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="rounded-full p-1 hover:text-fg"
                    aria-pressed={show}
                    aria-label={t.auth.password}
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
                {...form.register('password')}
              />
            )}
          </Field>

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex cursor-pointer items-center gap-2 text-fg-muted">
              <input type="checkbox" className="size-4 accent-(--accent)" {...form.register('remember')} />
              {t.auth.remember}
            </label>
            <a href="#" className="font-medium text-fg-muted hover:text-fg">
              {t.auth.forgot}
            </a>
          </div>

          {formError && (
            <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-2.5 text-[13px] text-danger">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" loading={form.formState.isSubmitting} className="mt-1 w-full">
            {form.formState.isSubmitting ? t.auth.submitting : t.auth.submit}
          </Button>
        </form>

        {env.mock && <DemoAccounts onPick={fillDemo} />}
      </Card>

      <p className="mt-6 text-xs text-fg-subtle">{t.auth.footer}</p>
    </div>
  )
}
