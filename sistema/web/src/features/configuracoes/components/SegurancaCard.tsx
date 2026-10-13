import { Laptop, Smartphone } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatDate, formatRelative } from '@/shared/lib/format'
import { Badge, Button, Card, CardHeader, EmptyState, ErrorState, Skeleton, toast } from '@/shared/ui'
import { useEncerrarSessao, useSessoes } from '../queries'
import type { Sessao } from '../types'

/** Senha e sessões ativas do próprio usuário (`GET/DELETE /auth/sessoes`). */
export function SegurancaCard() {
  const t = useT()
  const locale = useLocale()
  const sessoes = useSessoes()
  const encerrar = useEncerrarSessao()

  const revogar = (s: Sessao) =>
    encerrar.mutate(s.id, { onSuccess: () => toast(t.configuracoes.sessions.revoked, 'ok') })

  return (
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
      <p className="mb-(--card-head-mb) text-small font-medium text-fg-muted">{t.configuracoes.sessions.title}</p>

      {sessoes.isError ? (
        <ErrorState onRetry={() => void sessoes.refetch()} />
      ) : sessoes.isPending ? (
        <ul className="flex flex-col divide-y divide-line" aria-hidden="true">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 py-(--list-y)">
              <Skeleton className="size-4 rounded-full" />
              <span className="flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-1.5 h-3 w-48" />
              </span>
            </li>
          ))}
        </ul>
      ) : sessoes.data.length === 0 ? (
        <EmptyState title={t.configuracoes.sessions.empty} />
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {sessoes.data.map((s) => {
            const Icon = movel(s) ? Smartphone : Laptop
            return (
              <li key={s.id} className="flex items-center gap-3 py-(--list-y)">
                <Icon className="size-4 shrink-0 text-fg-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">
                    {fmt(t.configuracoes.sessions.device, { dispositivo: s.dispositivo, navegador: s.navegador })}
                  </span>
                  <span className="block truncate text-xs text-fg-muted">
                    {fmt(t.configuracoes.sessions.meta, {
                      quando: formatRelative(s.ultimoAcesso, locale),
                      data: formatDate(s.criadoEm, locale),
                    })}
                  </span>
                </span>
                {s.atual ? (
                  <Badge tone="ok">{t.configuracoes.sessions.current}</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={encerrar.isPending && encerrar.variables === s.id}
                    onClick={() => revogar(s)}
                  >
                    {t.configuracoes.sessions.revoke}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

/** Só para escolher o ícone; o nome do dispositivo continua sendo o dado exibido. */
function movel(s: Sessao) {
  return /iphone|ipad|android/i.test(s.dispositivo)
}
