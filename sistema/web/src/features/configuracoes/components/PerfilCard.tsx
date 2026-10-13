import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useT, type Dictionary } from '@/shared/i18n'
import { useCurrentUser } from '@/shared/auth'
import { Avatar, Button, Card, CardHeader, Field, Input, toast } from '@/shared/ui'
import { useAtualizarPerfil } from '../queries'

/** O schema recebe o dicionário para as mensagens saírem no idioma atual. */
const schema = (e: Dictionary['configuracoes']['errors']) =>
  z.object({
    nome: z.string().trim().min(1, e.nomeRequired),
    email: z.string().trim().min(1, e.emailRequired).email(e.emailInvalid),
  })

type Form = z.infer<ReturnType<typeof schema>>

/** Nome e e-mail do próprio usuário (`PATCH /auth/me`). */
export function PerfilCard() {
  const t = useT()
  const user = useCurrentUser()
  const salvar = useAtualizarPerfil()
  // `values` ressincroniza o formulário quando o usuário da sessão muda (ex.: depois de salvar)
  const form = useForm<Form>({
    resolver: zodResolver(schema(t.configuracoes.errors)),
    values: { nome: user?.nome ?? '', email: user?.email ?? '' },
  })
  const { errors, isDirty } = form.formState

  const submit = form.handleSubmit((values) =>
    salvar.mutate(values, { onSuccess: () => toast(t.configuracoes.saved, 'ok') }),
  )

  return (
    <Card>
      <CardHeader
        title={t.configuracoes.sections.perfil.title}
        description={t.configuracoes.sections.perfil.description}
      />
      {user && (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.nome} size="lg" />
            <div>
              <p className="font-medium">{user.nome}</p>
              <p className="text-small text-fg-muted">{t.common.roles[user.role]}</p>
            </div>
          </div>
          <Field label={t.configuracoes.fields.nome} error={errors.nome?.message}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                autoComplete="name"
                aria-describedby={describedBy}
                invalid={invalid}
                {...form.register('nome')}
              />
            )}
          </Field>
          <Field label={t.configuracoes.fields.email} error={errors.email?.message}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type="email"
                autoComplete="email"
                aria-describedby={describedBy}
                invalid={invalid}
                {...form.register('email')}
              />
            )}
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={salvar.isPending} disabled={!isDirty}>
              {t.common.actions.save}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
