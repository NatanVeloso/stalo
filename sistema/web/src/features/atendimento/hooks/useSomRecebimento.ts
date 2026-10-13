import { useEffect, useRef } from 'react'
import { chegouMensagem, chegouNaoLida, tocarSomRecebimento } from '../lib/sons'
import type { Mensagem } from '../types'

/**
 * Toca o som de recebimento quando o total de não lidas (da contagem, que cobre todos os canais,
 * não só a página carregada da lista) cresce entre duas cargas. A primeira carga não toca.
 * Quando o WebSocket existir, a invalidação da query dispara o mesmo caminho.
 */
export function useSomNovasConversas(naoLidas: number | undefined) {
  const antes = useRef<number | null>(null)
  useEffect(() => {
    if (naoLidas === undefined) return
    if (chegouNaoLida(antes.current, naoLidas)) tocarSomRecebimento()
    antes.current = naoLidas
  }, [naoLidas])
}

/**
 * Idem para a conversa aberta: mensagem nova do contato entre duas cargas da mesma conversa.
 * Se a mesma chegada também subir as não lidas, os dois disparos caem no dedupe de 500 ms.
 */
export function useSomNovasMensagens(conversaId: string | null, mensagens: Mensagem[] | undefined) {
  const antes = useRef<{ id: string; itens: Mensagem[] } | null>(null)
  useEffect(() => {
    if (!conversaId || !mensagens) return
    const a = antes.current
    if (a && a.id === conversaId && chegouMensagem(a.itens, mensagens)) tocarSomRecebimento()
    antes.current = { id: conversaId, itens: mensagens }
  }, [conversaId, mensagens])
}
