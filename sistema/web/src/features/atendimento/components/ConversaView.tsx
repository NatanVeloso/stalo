import { Eye, MessageSquareDashed } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { useCurrentUser, usePermission } from '@/shared/auth'
import { EmptyState } from '@/shared/ui'
import { useEnviarMensagem } from '../queries'
import type { Canal, Conversa } from '../types'
import { janelaFechada } from '../lib/janela'
import { Composer } from './Composer'
import { ConversaHeader } from './ConversaHeader'
import { MensagensLista } from './MensagensLista'

type Props = {
  conversa: Conversa | null
  canal: Canal | undefined
  onBack?: () => void
  onOpenPanel?: () => void
}

/** Coluna do meio: cabeçalho da conversa, mensagens e composer. */
export function ConversaView({ conversa, canal, onBack, onOpenPanel }: Props) {
  const t = useT()
  const user = useCurrentUser()
  const podeResponder = usePermission('atendimento:responder')
  const enviar = useEnviarMensagem()

  if (!conversa) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<MessageSquareDashed />}
          title={t.atendimento.select.title}
          description={t.atendimento.select.hint}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ConversaHeader conversa={conversa} canal={canal} onBack={onBack} onOpenPanel={onOpenPanel} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <MensagensLista key={conversa.id} conversaId={conversa.id} />
      </div>

      {podeResponder ? (
        <Composer
          key={conversa.id}
          windowClosed={janelaFechada(conversa.janelaExpiraEm)}
          sending={enviar.isPending}
          onSend={(texto, nota) =>
            user && enviar.mutate({ conversaId: conversa.id, autor: user.nome, tipo: nota ? 'nota' : 'texto', texto })
          }
          onTemplate={(templateId) =>
            user && enviar.mutate({ conversaId: conversa.id, autor: user.nome, tipo: 'template', templateId })
          }
        />
      ) : (
        <p className="flex items-center gap-2 border-t border-line px-4 py-3 text-small text-fg-muted">
          <Eye className="size-4 shrink-0" aria-hidden="true" />
          {t.atendimento.readOnly}
        </p>
      )}
    </div>
  )
}
