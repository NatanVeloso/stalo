import { useEffect, useMemo, useRef, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { formatDate, localDayKey } from '@/shared/lib/format'
import { Button, EmptyState, ErrorState, Skeleton } from '@/shared/ui'
import { useMensagens } from '../queries'
import type { Mensagem } from '../types'
import { MensagemBubble } from './MensagemBubble'
import { useSomNovasMensagens } from '../hooks/useSomRecebimento'

/**
 * Mensagens de uma conversa, em ordem cronológica, com separador de dia. Montado com
 * `key={conversa.id}`: as chaves de hoje/ontem são calculadas uma vez por abertura (render puro).
 */
export function MensagensLista({ conversaId }: { conversaId: string }) {
  const t = useT()
  const locale = useLocale()
  const query = useMensagens(conversaId)
  const [{ hoje, ontem }] = useState(chavesDoDia)
  const end = useRef<HTMLDivElement>(null)

  // a API manda as mais recentes primeiro; refetch de páginas pode repetir item, então dedupe por id
  const mensagens = useMemo(() => {
    if (!query.data) return undefined
    const vistos = new Set<string>()
    const out: Mensagem[] = []
    for (const m of query.data.pages.flatMap((p) => p.items)) {
      if (vistos.has(m.id)) continue
      vistos.add(m.id)
      out.push(m)
    }
    return out.reverse()
  }, [query.data])

  useSomNovasMensagens(conversaId, mensagens)

  // rola para o fim ao abrir e quando chega mensagem nova (não ao carregar as anteriores)
  const maisNova = mensagens?.[mensagens.length - 1]?.id
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [maisNova])

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-3 px-4 py-3">
        <Skeleton className="h-12 w-3/5" />
        <Skeleton className="ml-auto h-10 w-2/5" />
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="ml-auto h-10 w-2/5" />
      </div>
    )
  }
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />
  if (!mensagens?.length) {
    return (
      <EmptyState
        icon={<MessagesSquare />}
        title={t.atendimento.noMessages.title}
        description={t.atendimento.noMessages.hint}
      />
    )
  }

  const rotuloDia = (m: Mensagem, dia: string) =>
    dia === hoje ? t.atendimento.today : dia === ontem ? t.atendimento.yesterday : formatDate(m.em, locale, 'long')

  // separadores de dia (no fuso local) entre as mensagens
  const itens: Array<{ kind: 'day'; dia: string; label: string } | { kind: 'msg'; m: Mensagem }> = []
  let ultimoDia = ''
  mensagens.forEach((m) => {
    const dia = localDayKey(m.em)
    if (dia !== ultimoDia) {
      ultimoDia = dia
      itens.push({ kind: 'day', dia, label: rotuloDia(m, dia) })
    }
    itens.push({ kind: 'msg', m })
  })

  return (
    <div className="px-4 py-3">
      {query.hasNextPage && (
        <div className="mb-3 flex justify-center">
          <Button
            size="sm"
            variant="secondary"
            loading={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
          >
            {t.atendimento.loadOlder}
          </Button>
        </div>
      )}
      <ul className="flex flex-col gap-(--list-gap)">
        {itens.map((it) =>
          it.kind === 'day' ? (
            <li key={`d-${it.dia}`} className="my-(--list-gap) flex items-center gap-3 text-caption text-fg-subtle">
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              {it.label}
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </li>
          ) : (
            <MensagemBubble key={it.m.id} m={it.m} />
          ),
        )}
      </ul>
      <div ref={end} />
    </div>
  )
}

/** Hoje e ontem no fuso local (mesma régua de `localDayKey(m.em)`). */
function chavesDoDia() {
  const agora = new Date()
  const ontem = new Date(agora)
  ontem.setDate(agora.getDate() - 1)
  return { hoje: localDayKey(agora), ontem: localDayKey(ontem) }
}
