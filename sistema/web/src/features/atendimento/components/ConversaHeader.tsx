import { ArrowLeft, CheckCircle2, Info, UserPlus } from 'lucide-react'
import { useT, fmt } from '@/shared/i18n'
import { useCurrentUser, usePermission } from '@/shared/auth'
import { Avatar, Button, IconButton } from '@/shared/ui'
import { useAtribuir, useResolver } from '../queries'
import type { Canal, Conversa } from '../types'
import { EstadoBadge } from './EstadoBadge'
import { JanelaBadge } from './JanelaBadge'

type Props = {
  conversa: Conversa
  canal: Canal | undefined
  onBack?: () => void
  onOpenPanel?: () => void
}

/**
 * Cabeçalho da conversa: contato, setor/atendente e ações rápidas. Transferir de setor e trocar o
 * atendente ficam no painel do contato (abaixo de `xl`, pelo botão de abrir o painel).
 */
export function ConversaHeader({ conversa, canal, onBack, onOpenPanel }: Props) {
  const t = useT()
  const user = useCurrentUser()
  const podeResponder = usePermission('atendimento:responder')
  const atribuir = useAtribuir()
  const resolver = useResolver()

  const minha = !!user && conversa.atendenteId === user.id
  const aberta = conversa.estado !== 'resolvida'
  const origem = conversa.cliente ?? conversa.contato.telefone
  const subtitulo = conversa.atendente
    ? fmt(t.atendimento.header.subtitleWithAtendente, {
        origem,
        canal: canal?.nome ?? t.atendimento.semCanal,
        atendente: minha ? t.atendimento.you : conversa.atendente,
      })
    : fmt(t.atendimento.header.subtitle, { origem, canal: canal?.nome ?? t.atendimento.semCanal })

  return (
    <header className="flex items-center gap-3 border-b border-line px-3 py-(--head-y)">
      {onBack && (
        <IconButton size="sm" label={t.atendimento.actions.backToList} onClick={onBack} className="lg:hidden">
          <ArrowLeft />
        </IconButton>
      )}
      <Avatar name={conversa.contato.nome} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{conversa.contato.nome}</p>
        <p className="truncate text-xs text-fg-muted">{subtitulo}</p>
        <div className="mt-1.5 hidden items-center gap-1.5 md:flex">
          <EstadoBadge estado={conversa.estado} />
          <JanelaBadge expiraEm={conversa.janelaExpiraEm} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {podeResponder && !minha && aberta && user && (
          <Button
            size="sm"
            variant="secondary"
            aria-label={t.atendimento.actions.assignMe}
            leading={<UserPlus className="size-3.5" />}
            loading={atribuir.isPending}
            onClick={() => atribuir.mutate({ id: conversa.id, atendenteId: user.id })}
          >
            <span className="hidden sm:inline">{t.atendimento.actions.assignMe}</span>
          </Button>
        )}
        {podeResponder && aberta && user && (
          <IconButton
            size="sm"
            label={t.atendimento.actions.resolve}
            disabled={resolver.isPending}
            onClick={() => resolver.mutate({ id: conversa.id, autor: user.nome })}
          >
            <CheckCircle2 />
          </IconButton>
        )}
        {onOpenPanel && (
          <IconButton size="sm" label={t.atendimento.actions.openPanel} onClick={onOpenPanel} className="xl:hidden">
            <Info />
          </IconButton>
        )}
      </div>
    </header>
  )
}
