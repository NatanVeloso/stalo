import { ArrowRight, Link2 } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { Button, ErrorState, LinkButton, Skeleton } from '@/shared/ui'
import { useCliente } from '@/features/clientes'
import type { Conversa } from '../types'

/** Bloco "Cliente" do painel do contato: dados do cliente vinculado ou o botão de vincular. */
export function ClienteVinculado({ conversa }: { conversa: Conversa }) {
  const t = useT()
  const podeVerClientes = usePermission('clientes:ver')
  const podeResponder = usePermission('atendimento:responder')
  const cliente = useCliente(podeVerClientes ? conversa.clienteId : null)

  return (
    <section className="rounded-2xl p-3 glass-inset">
      <h3 className="mb-2 text-caption font-semibold tracking-[0.08em] text-fg-subtle uppercase">
        {t.atendimento.panel.cliente}
      </h3>
      {conversa.cliente ? (
        <>
          <p className="text-sm font-medium">{conversa.cliente}</p>
          {podeVerClientes &&
            (cliente.isPending ? (
              <div className="mt-2 flex flex-col gap-1.5" aria-hidden="true">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3.5 w-3/5" />
              </div>
            ) : cliente.isError ? (
              <ErrorState onRetry={() => void cliente.refetch()} className="px-0 py-4" />
            ) : (
              <dl className="mt-2 flex flex-col gap-1.5 text-small">
                <Row label={t.atendimento.panel.regime} value={t.common.regime[cliente.data.regime]} />
                <Row label={t.atendimento.panel.responsavel} value={cliente.data.responsavel} />
                <Row label={t.atendimento.panel.obrigacoesAbertas} value={String(cliente.data.obrigacoesAbertas)} />
              </dl>
            ))}
          {podeVerClientes && (
            <LinkButton
              to="/clientes"
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              trailing={<ArrowRight className="size-3.5" />}
            >
              {t.atendimento.panel.openClient}
            </LinkButton>
          )}
        </>
      ) : (
        <>
          <p className="text-small text-fg-muted">{t.atendimento.noClient}</p>
          {podeResponder && (
            <Button size="sm" variant="secondary" className="mt-3 w-full" leading={<Link2 className="size-3.5" />}>
              {t.atendimento.panel.vincular}
            </Button>
          )}
        </>
      )}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  )
}
