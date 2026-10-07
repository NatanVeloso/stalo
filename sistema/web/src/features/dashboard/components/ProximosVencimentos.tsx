import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { Button, Card, CardHeader, Skeleton } from '@/shared/ui'
import { VencimentoBadge } from '@/features/obrigacoes'
import { useProximosVencimentos } from '../queries'

export function ProximosVencimentos() {
  const t = useT()
  const query = useProximosVencimentos()

  return (
    <Card>
      <CardHeader
        title={t.dashboard.deadlines.title}
        description={t.dashboard.deadlines.subtitle}
        actions={
          <Link to="/obrigacoes">
            <Button variant="ghost" size="sm" trailing={<ArrowRight className="size-4" />}>
              {t.common.actions.viewAll}
            </Button>
          </Link>
        }
      />
      <ul className="flex flex-col divide-y divide-line">
        {query.isPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-16" />
              </li>
            ))
          : query.data?.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-(--list-y)">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.obrigacoes.tipos[o.tipo]}</p>
                  <p className="truncate text-xs text-fg-muted">{o.cliente}</p>
                </div>
                <VencimentoBadge iso={o.vencimento} />
              </li>
            ))}
        {query.data?.length === 0 && (
          <li className="py-6 text-center text-sm text-fg-muted">{t.dashboard.deadlines.empty}</li>
        )}
      </ul>
    </Card>
  )
}
