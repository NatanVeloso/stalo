import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, Info, UserPlus, MessageSquareDashed, ArrowRightLeft } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { useCurrentUser } from '@/shared/auth'
import { formatDate } from '@/shared/lib/format'
import { Avatar, Button, EmptyState, IconButton, Skeleton } from '@/shared/ui'
import { useAtribuir, useEnviarMensagem, useMensagens, useResolver } from '../queries'
import type { Canal, Conversa } from '../types'
import { EstadoBadge } from './EstadoBadge'
import { JanelaBadge } from './JanelaBadge'
import { janelaRestanteMin } from '../lib/janela'
import { MensagemBubble } from './MensagemBubble'
import { Composer } from './Composer'

type Props = {
  conversa: Conversa | null
  canal: Canal | undefined
  onBack?: () => void
  onOpenPanel?: () => void
}

/** Coluna do meio: cabeçalho da conversa, mensagens e composer. */
export function ConversaView({ conversa, canal, onBack, onOpenPanel }: Props) {
  const t = useT()
  const locale = useLocale()
  const user = useCurrentUser()
  const mensagens = useMensagens(conversa?.id ?? null)
  const enviar = useEnviarMensagem()
  const atribuir = useAtribuir()
  const resolver = useResolver()
  const end = useRef<HTMLDivElement>(null)
  // chaves de hoje/ontem calculadas uma vez (fora do render, que precisa ser puro)
  const [{ today, yesterday }] = useState(dayKeys)

  // rola para a última mensagem ao abrir a conversa e ao chegar mensagem nova
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [mensagens.data?.length, conversa?.id])

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

  const minhas = conversa.atendente === user?.nome
  const closed = (janelaRestanteMin(conversa.janelaExpiraEm) ?? 1) <= 0

  // separadores de dia entre as mensagens
  const items: Array<{ kind: 'day'; label: string } | { kind: 'msg'; id: string; i: number }> = []
  let lastDay = ''
  mensagens.data?.forEach((m, i) => {
    const day = m.em.slice(0, 10)
    if (day !== lastDay) {
      lastDay = day
      items.push({
        kind: 'day',
        label:
          day === today
            ? t.atendimento.today
            : day === yesterday
              ? t.atendimento.yesterday
              : formatDate(m.em, locale, 'long'),
      })
    }
    items.push({ kind: 'msg', id: m.id, i })
  })

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        {onBack && (
          <IconButton size="sm" label={t.atendimento.actions.backToList} onClick={onBack} className="lg:hidden">
            <ArrowLeft />
          </IconButton>
        )}
        <Avatar name={conversa.contato.nome} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{conversa.contato.nome}</p>
          <p className="truncate text-xs text-fg-muted">
            {conversa.cliente ?? conversa.contato.telefone} · {canal?.nome}
            {conversa.atendente && ` · ${conversa.atendente === user?.nome ? t.atendimento.you : conversa.atendente}`}
          </p>
          <div className="mt-1.5 hidden items-center gap-1.5 md:flex">
            <EstadoBadge estado={conversa.estado} />
            <JanelaBadge expiraEm={conversa.janelaExpiraEm} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!minhas && conversa.estado !== 'resolvida' && user && (
            <Button
              size="sm"
              variant="secondary"
              leading={<UserPlus className="size-3.5" />}
              loading={atribuir.isPending}
              onClick={() => atribuir.mutate({ id: conversa.id, atendente: user.nome })}
            >
              <span className="hidden sm:inline">{t.atendimento.actions.assignMe}</span>
            </Button>
          )}
          <IconButton size="sm" label={t.atendimento.actions.transfer}>
            <ArrowRightLeft />
          </IconButton>
          {conversa.estado !== 'resolvida' && user && (
            <IconButton
              size="sm"
              label={t.atendimento.actions.resolve}
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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {mensagens.isPending ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-3/5" />
            <Skeleton className="ml-auto h-10 w-2/5" />
            <Skeleton className="h-16 w-1/2" />
            <Skeleton className="ml-auto h-10 w-2/5" />
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((it) =>
              it.kind === 'day' ? (
                <li key={`d-${it.label}`} className="my-2 flex items-center gap-3 text-[11px] text-fg-subtle">
                  <span className="h-px flex-1 bg-line" />
                  {it.label}
                  <span className="h-px flex-1 bg-line" />
                </li>
              ) : (
                <MensagemBubble key={it.id} m={mensagens.data![it.i]!} />
              ),
            )}
          </ul>
        )}
        <div ref={end} />
      </div>

      <Composer
        windowClosed={closed}
        sending={enviar.isPending}
        onSend={(texto, nota) => user && enviar.mutate({ conversaId: conversa.id, texto, nota, autor: user.nome })}
      />
    </div>
  )
}

function dayKeys() {
  const now = Date.now()
  return {
    today: new Date(now).toISOString().slice(0, 10),
    yesterday: new Date(now - 86_400_000).toISOString().slice(0, 10),
  }
}
