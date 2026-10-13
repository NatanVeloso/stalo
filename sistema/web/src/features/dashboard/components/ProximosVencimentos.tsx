import { ArrowRight, CalendarCheck2 } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { useRole } from '@/shared/auth'
import { Card, CardHeader, EmptyState, ErrorState, LinkButton, Skeleton } from '@/shared/ui'
import { VencimentoBadge } from '@/features/obrigacoes'
import { useProximosVencimentos } from '../queries'

/** Só montar com `obrigacoes:ver` (o endpoint exige; a página decide). */
export function ProximosVencimentos() {
  const t = useT()
  // perfil cliente só vê as próprias obrigações: o nome do cliente seria repetido em toda linha
  const isCliente = useRole() === 'cliente'
  const query = useProximosVencimentos()

  return (
    <Card>
      <CardHeader
        title={t.dashboard.deadlines.title}
        description={t.dashboard.deadlines.subtitle}
        actions={
          <LinkButton to="/obrigacoes" variant="ghost" size="sm" trailing={<ArrowRight className="size-4" />}>
            {t.common.actions.viewAll}
          </LinkButton>
        }
      />
      {query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : query.data?.length === 0 ? (
        <EmptyState title={t.dashboard.deadlines.empty} icon={<CalendarCheck2 />} />
      ) : (
        <ul className="flex flex-col gap-(--list-gap)">
          {query.isPending
            ? Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-2xl px-4 py-(--list-y) glass-inset"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-16" />
                </li>
              ))
            : query.data.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 rounded-2xl px-4 py-(--list-y) glass-inset"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.obrigacoes.tipos[o.tipo]}</p>
                    {!isCliente && <p className="truncate text-xs text-fg-muted">{o.cliente}</p>}
                  </div>
                  <VencimentoBadge iso={o.vencimento} />
                </li>
              ))}
        </ul>
      )}
    </Card>
  )
}
