import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { Avatar, Card, CardHeader, Skeleton } from '@/shared/ui'
import { useAtividades } from '../queries'

export function AtividadeRecente() {
  const t = useT()
  const locale = useLocale()
  const query = useAtividades()

  return (
    <Card>
      <CardHeader title={t.dashboard.activity.title} description={t.dashboard.activity.subtitle} />
      <ol className="flex flex-col gap-1">
        {query.isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-4 w-72" />
              </li>
            ))
          : query.data?.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-fg/[0.04]"
              >
                <Avatar name={a.user ?? a.client} size="sm" />
                <p className="min-w-0 flex-1 truncate text-sm text-fg-muted">
                  {fmt(t.dashboard.activityKinds[a.kind], { user: a.user ?? '', what: a.what, client: a.client })}
                </p>
                <time dateTime={a.at} className="shrink-0 text-xs text-fg-subtle">
                  {formatRelative(a.at, locale)}
                </time>
              </li>
            ))}
      </ol>
    </Card>
  )
}
