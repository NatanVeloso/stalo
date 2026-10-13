import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { Avatar, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/shared/ui'
import { useAtividades } from '../queries'

export function AtividadeRecente() {
  const t = useT()
  const locale = useLocale()
  const query = useAtividades()

  return (
    <Card>
      <CardHeader title={t.dashboard.activity.title} description={t.dashboard.activity.subtitle} />
      {query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : query.data?.length === 0 ? (
        <EmptyState title={t.dashboard.activity.empty} />
      ) : (
        <ol className="flex flex-col gap-(--list-gap)">
          {query.isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl px-3 py-(--list-y) glass-inset">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-4 w-72" />
                </li>
              ))
            : query.data.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl px-3 py-(--list-y) glass-inset">
                  <Avatar name={a.usuario ?? a.cliente} size="sm" />
                  <p className="min-w-0 flex-1 truncate text-sm text-fg-muted">
                    {fmt(t.dashboard.activityKinds[a.tipo], {
                      usuario: a.usuario ?? '',
                      descricao: a.descricao,
                      cliente: a.cliente,
                    })}
                  </p>
                  <time dateTime={a.em} className="shrink-0 text-xs text-fg-subtle">
                    {formatRelative(a.em, locale)}
                  </time>
                </li>
              ))}
        </ol>
      )}
    </Card>
  )
}
