import { Link } from 'react-router'
import { ArrowRight, Link2, Phone, Tag } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { Avatar, Badge, Button, Field, Select } from '@/shared/ui'
import { useCliente } from '@/features/clientes'
import type { Canal, Conversa } from '../types'
import { EstadoBadge } from './EstadoBadge'
import { JanelaBadge } from './JanelaBadge'

type Props = { conversa: Conversa; canais: Canal[] }

/** Coluna da direita: quem é o contato, cliente vinculado, setor, atendente e etiquetas. */
export function ContatoPanel({ conversa, canais }: Props) {
  const t = useT()
  const podeVerClientes = usePermission('clientes:ver')
  const cliente = useCliente(podeVerClientes ? conversa.clienteId : null)

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar name={conversa.contato.nome} size="lg" />
        <p className="mt-3 font-semibold">{conversa.contato.nome}</p>
        <p className="flex items-center gap-1 text-[13px] text-fg-muted">
          <Phone className="size-3.5" aria-hidden="true" />
          {conversa.contato.telefone}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <EstadoBadge estado={conversa.estado} />
          <JanelaBadge expiraEm={conversa.janelaExpiraEm} />
        </div>
      </div>

      <section className="rounded-2xl border border-line p-3">
        <h3 className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          {t.atendimento.panel.cliente}
        </h3>
        {conversa.cliente ? (
          <>
            <p className="text-sm font-medium">{conversa.cliente}</p>
            {cliente.data && (
              <dl className="mt-2 flex flex-col gap-1.5 text-[13px]">
                <Row label={t.atendimento.panel.regime} value={t.common.regime[cliente.data.regime]} />
                <Row label={t.atendimento.panel.responsavel} value={cliente.data.responsavel} />
                <Row label={t.atendimento.panel.obrigacoesAbertas} value={String(cliente.data.obrigacoesAbertas)} />
              </dl>
            )}
            {podeVerClientes && (
              <Link to="/clientes" className="mt-3 block">
                <Button size="sm" variant="secondary" className="w-full" trailing={<ArrowRight className="size-3.5" />}>
                  {t.atendimento.panel.openClient}
                </Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="text-[13px] text-fg-muted">{t.atendimento.noClient}</p>
            <Button size="sm" variant="secondary" className="mt-3 w-full" leading={<Link2 className="size-3.5" />}>
              {t.atendimento.panel.vincular}
            </Button>
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Field label={t.atendimento.panel.canal}>
          {({ id }) => (
            <Select
              id={id}
              size="sm"
              value={conversa.canalId}
              onChange={() => {}}
              options={canais.map((c) => ({ value: c.id, label: c.nome }))}
            />
          )}
        </Field>
        <Field label={t.atendimento.panel.atendente}>
          {({ id }) => (
            <Select
              id={id}
              size="sm"
              value={conversa.atendente ?? ''}
              onChange={() => {}}
              options={[
                { value: '', label: t.atendimento.panel.unassigned },
                ...['Ana Souza', 'Walex Mateus', 'Emanoel Oliveira', 'Júlia Ramos'].map((n) => ({
                  value: n,
                  label: n,
                })),
              ]}
            />
          )}
        </Field>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-1 text-[11px] font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          <Tag className="size-3" aria-hidden="true" />
          {t.atendimento.panel.tags}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {conversa.tags.length ? (
            conversa.tags.map((tag) => (
              <Badge key={tag} dot={false}>
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-[13px] text-fg-subtle">{t.atendimento.panel.noTags}</span>
          )}
        </div>
      </section>
    </div>
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
