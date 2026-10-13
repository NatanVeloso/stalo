import { ArrowRight, Pencil } from 'lucide-react'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { formatCnpj, formatCurrency, formatDate, formatNumber } from '@/shared/lib/format'
import { Avatar, Badge, Button, Drawer, ErrorState, LinkButton, Skeleton } from '@/shared/ui'
import { useCliente } from '../queries'

type Props = { id: string | null; onClose: () => void }

/** Detalhe rápido do cliente num painel lateral; a página completa vem depois. */
export function ClienteDrawer({ id, onClose }: Props) {
  const t = useT()
  const locale = useLocale()
  const podeEditar = usePermission('clientes:editar')
  const query = useCliente(id)
  const c = query.data

  return (
    <Drawer
      open={!!id}
      onClose={onClose}
      title={c?.nomeFantasia ?? t.clientes.detail.title}
      description={
        c ? fmt(t.clientes.detail.description, { razaoSocial: c.razaoSocial, cnpj: formatCnpj(c.cnpj) }) : undefined
      }
      footer={
        <>
          {podeEditar && c && (
            <Button variant="secondary" leading={<Pencil className="size-4" />}>
              {t.common.actions.edit}
            </Button>
          )}
          <LinkButton to="/obrigacoes" trailing={<ArrowRight className="size-4" />}>
            {t.clientes.detail.openObrigacoes}
          </LinkButton>
        </>
      }
    >
      {query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : !c ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={c.nomeFantasia} size="lg" className="bg-fg/[0.08] text-fg" />
            <div className="flex flex-wrap gap-2">
              <Badge tone={c.status === 'ativo' ? 'ok' : 'neutral'}>{t.common.status[c.status]}</Badge>
              <Badge dot={false}>{t.common.regime[c.regime]}</Badge>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <Stat label={t.clientes.detail.honorario} value={formatCurrency(c.honorario, locale)} />
            <Stat label={t.clientes.detail.obrigacoesAbertas} value={formatNumber(c.obrigacoesAbertas, locale)} />
            <Stat label={t.clientes.detail.documentos} value={formatNumber(c.documentos, locale)} />
            <Stat
              label={t.clientes.detail.ultimaEntrega}
              value={c.ultimaEntrega ? formatDate(c.ultimaEntrega, locale) : t.common.noValue}
            />
          </dl>

          <section className="rounded-2xl p-4 glass-inset">
            <h3 className="mb-3 text-small font-semibold text-fg-muted">{t.clientes.detail.contato}</h3>
            <dl className="flex flex-col gap-2 text-sm">
              <Row label={t.clientes.detail.email} value={c.email} />
              <Row label={t.clientes.detail.telefone} value={c.telefone} />
              <Row label={t.clientes.detail.cidade} value={c.cidade} />
              <Row label={t.clientes.detail.responsavel} value={c.responsavel} />
              <Row label={t.clientes.columns.desde} value={formatDate(c.desde, locale, 'long')} />
            </dl>
          </section>
        </div>
      )}
    </Drawer>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-3 glass-inset">
      <dt className="text-caption text-fg-subtle">{label}</dt>
      <dd className="mt-0.5 text-base font-semibold tabular">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="truncate text-right font-medium">{value}</dd>
    </div>
  )
}
