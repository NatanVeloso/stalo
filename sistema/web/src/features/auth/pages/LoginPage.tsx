import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useT, fmt, type Dictionary } from '@/shared/i18n'
import { errorMessage } from '@/shared/i18n/errorMessage'
import { LanguageMenu } from '@/shared/i18n/LanguageMenu'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { useResolvedTheme } from '@/shared/theme/useTheme'
import { useAuth } from '@/shared/auth'
import { env } from '@/shared/lib/env'
import { useIsDesktop } from '@/shared/hooks/useMediaQuery'
import { Button, Card, Field, IconButton, Input, Logo, toast } from '@/shared/ui'
import { CosmosBackground } from '../components/CosmosBackground'
import { DemoAccounts } from '../components/DemoAccounts'
import { useEsqueciSenha } from '../queries'

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
  // guarda o erro, não o texto: a mensagem é traduzida no render e acompanha a troca de idioma
  const [formError, setFormError] = useState<unknown>(null)
  const esqueci = useEsqueciSenha()
  // fundo de galáxia só no desktop e, por enquanto, só no tema escuro; fora disso nem monta o canvas
  const isDesktop = useIsDesktop()
  const showCosmos = useResolvedTheme() === 'dark' && isDesktop

  const form = useForm<Form>({
    resolver: zodResolver(schema(t.auth.errors)),
    defaultValues: { email: '', password: '', remember: true },
  })

  const submit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values.email, values.password, values.remember)
      const from = (location.state as { from?: string } | null)?.from
      void navigate(from && from !== '/login' ? from : '/', { replace: true })
    } catch (e) {
      setFormError(e)
    }
  })

  const fillDemo = ({ email, password }: { email: string; password: string }) => {
    form.setValue('email', email, { shouldValidate: true })
    form.setValue('password', password, { shouldValidate: true })
    form.setFocus('password')
  }

  // usa o e-mail já digitado; vazio ou inválido, mostra o erro no campo e leva o foco até ele
  const pedirLink = async () => {
    if (!(await form.trigger('email'))) {
      form.setFocus('email')
      return
    }
    const email = form.getValues('email')
    esqueci.mutate(email, { onSuccess: () => toast(fmt(t.auth.forgotSent, { email }), 'ok') })
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="orbs" aria-hidden="true" />
      {/* galáxia + logo em partículas, atrás do card (o vidro desfoca o que passa por trás) */}
      {showCosmos && <CosmosBackground className="absolute inset-0 size-full" />}

      <div className="absolute top-4 right-4 flex items-center gap-1">
        <ThemeToggle variant="glass" />
        <LanguageMenu variant="glass" />
      </div>

      <Card padding="lg" className="animate-rise w-full max-w-[26.25rem]">
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
                  <IconButton
                    size="xs"
                    label={show ? t.auth.hidePassword : t.auth.showPassword}
                    onClick={() => setShow((s) => !s)}
                  >
                    {show ? <EyeOff /> : <Eye />}
                  </IconButton>
                }
                {...form.register('password')}
              />
            )}
          </Field>

          <div className="flex items-center justify-between text-small">
            <label className="flex cursor-pointer items-center gap-2 text-fg-muted">
              <input type="checkbox" className="size-4 accent-(--accent)" {...form.register('remember')} />
              {t.auth.remember}
            </label>
            <button
              type="button"
              onClick={() => void pedirLink()}
              disabled={esqueci.isPending}
              aria-busy={esqueci.isPending || undefined}
              className="rounded-full font-medium text-fg-muted hover:text-fg disabled:opacity-60"
            >
              {t.auth.forgot}
            </button>
          </div>

          {formError !== null && (
            <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-2.5 text-small text-danger">
              {errorMessage(formError, t)}
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
