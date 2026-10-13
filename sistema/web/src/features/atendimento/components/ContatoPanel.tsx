import { Phone, Tag } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePermission } from '@/shared/auth'
import { Avatar, Badge, Field, Select } from '@/shared/ui'
import { useAtendentes, useAtribuir, useTransferir } from '../queries'
import type { Canal, Conversa } from '../types'
import { ClienteVinculado } from './ClienteVinculado'
import { EstadoBadge } from './EstadoBadge'
import { JanelaBadge } from './JanelaBadge'

type Props = { conversa: Conversa; canais: Canal[] }

/** Coluna da direita: quem é o contato, cliente vinculado, setor, atendente e etiquetas. */
export function ContatoPanel({ conversa, canais }: Props) {
  const t = useT()
  const podeResponder = usePermission('atendimento:responder')
  const atendentes = useAtendentes()
  const atribuir = useAtribuir()
  const transferir = useTransferir()

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar name={conversa.contato.nome} size="lg" />
        <p className="mt-3 font-semibold">{conversa.contato.nome}</p>
        <p className="flex items-center gap-1 text-small text-fg-muted">
          <Phone className="size-3.5" aria-hidden="true" />
          {conversa.contato.telefone}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <EstadoBadge estado={conversa.estado} />
          <JanelaBadge expiraEm={conversa.janelaExpiraEm} />
        </div>
      </div>

      <ClienteVinculado conversa={conversa} />

      <section className="flex flex-col gap-3">
        <Field label={t.atendimento.panel.canal}>
          {({ id }) => (
            <Select
              id={id}
              size="sm"
              value={conversa.canalId}
              disabled={!podeResponder || transferir.isPending}
              onChange={(canalId) => canalId !== conversa.canalId && transferir.mutate({ id: conversa.id, canalId })}
              options={canais.map((c) => ({ value: c.id, label: c.nome }))}
            />
          )}
        </Field>
        <Field label={t.atendimento.panel.atendente}>
          {({ id }) => (
            <Select
              id={id}
              size="sm"
              value={conversa.atendenteId ?? ''}
              disabled={!podeResponder || atendentes.isPending || atendentes.isError || atribuir.isPending}
              onChange={(atendenteId) =>
                atendenteId !== (conversa.atendenteId ?? '') &&
                atribuir.mutate({ id: conversa.id, atendenteId: atendenteId || null })
              }
              options={[
                { value: '', label: t.atendimento.panel.unassigned },
                ...(atendentes.data ?? []).map((a) => ({ value: a.id, label: a.nome })),
                // enquanto a lista não chega, o atendente atual continua visível
                ...(!atendentes.data && conversa.atendenteId && conversa.atendente
                  ? [{ value: conversa.atendenteId, label: conversa.atendente }]
                  : []),
              ]}
            />
          )}
        </Field>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-1 text-caption font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          <Tag className="size-3" aria-hidden="true" />
          {t.atendimento.panel.etiquetas}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {conversa.etiquetas.length ? (
            conversa.etiquetas.map((etiqueta) => (
              <Badge key={etiqueta} dot={false}>
                {etiqueta}
              </Badge>
            ))
          ) : (
            <span className="text-small text-fg-subtle">{t.atendimento.panel.noEtiquetas}</span>
          )}
        </div>
      </section>
    </div>
  )
}
