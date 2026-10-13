import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Paginated } from '@/shared/types/api'
import { atendimentoApi } from './api'
import { tocarSomEnvio } from './lib/sons'
import type { Conversa, ConversasFiltro, EnviarMensagemInput } from './types'

const PAGE_CONVERSAS = 20
const PAGE_MENSAGENS = 30

export const atendimentoKeys = {
  all: ['atendimento'] as const,
  canais: () => [...atendimentoKeys.all, 'canais'] as const,
  atendentes: () => [...atendimentoKeys.all, 'atendentes'] as const,
  templates: () => [...atendimentoKeys.all, 'templates'] as const,
  conversas: (f: ConversasFiltro) => [...atendimentoKeys.all, 'conversas', f] as const,
  conversa: (id: string) => [...atendimentoKeys.all, 'conversa', id] as const,
  contagem: () => [...atendimentoKeys.all, 'contagem'] as const,
  mensagens: (id: string) => [...atendimentoKeys.all, 'mensagens', id] as const,
}

/** Próxima página enquanto o total não foi alcançado. */
function proxima<T>(last: Paginated<T>, pages: Paginated<T>[]) {
  const carregados = pages.reduce((s, p) => s + p.items.length, 0)
  return carregados < last.total && last.items.length > 0 ? last.page + 1 : undefined
}

export const useCanais = () => useQuery({ queryKey: atendimentoKeys.canais(), queryFn: atendimentoApi.canais })

export const useAtendentes = () =>
  useQuery({ queryKey: atendimentoKeys.atendentes(), queryFn: atendimentoApi.atendentes, staleTime: 5 * 60_000 })

export const useTemplates = (enabled = true) =>
  useQuery({ queryKey: atendimentoKeys.templates(), queryFn: atendimentoApi.templates, enabled, staleTime: 5 * 60_000 })

/** Lista paginada no servidor; "Carregar mais" pede a próxima página. */
export const useConversas = (f: ConversasFiltro) =>
  useInfiniteQuery({
    queryKey: atendimentoKeys.conversas(f),
    queryFn: ({ pageParam }) => atendimentoApi.conversas({ ...f, page: pageParam, pageSize: PAGE_CONVERSAS }),
    initialPageParam: 1,
    getNextPageParam: proxima,
  })

/**
 * A conversa aberta, buscada pelo id: continua na tela quando sai do filtro da lista. Enquanto
 * carrega, mostra o que a lista já tem (`placeholder`).
 */
export const useConversa = (id: string | null, placeholder?: Conversa) =>
  useQuery({
    queryKey: atendimentoKeys.conversa(id ?? ''),
    queryFn: () => atendimentoApi.conversa(id!),
    enabled: !!id,
    placeholderData: placeholder,
  })

export const useContagem = () => useQuery({ queryKey: atendimentoKeys.contagem(), queryFn: atendimentoApi.contagem })

/** Páginas vêm das mais recentes para as antigas; "Carregar anteriores" pede a próxima. */
export const useMensagens = (id: string | null) =>
  useInfiniteQuery({
    queryKey: atendimentoKeys.mensagens(id ?? ''),
    queryFn: ({ pageParam }) => atendimentoApi.mensagens(id!, { page: pageParam, pageSize: PAGE_MENSAGENS }),
    initialPageParam: 1,
    getNextPageParam: proxima,
    enabled: !!id,
  })

/** Toda mutação invalida o módulo inteiro: lista, contadores e mensagens mudam juntos. */
function useInvalidate() {
  const qc = useQueryClient()
  return () => void qc.invalidateQueries({ queryKey: atendimentoKeys.all })
}

export function useEnviarMensagem() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: EnviarMensagemInput) => atendimentoApi.enviar(input),
    onSuccess: (_m, input) => {
      if (input.tipo !== 'nota') tocarSomEnvio()
      invalidate()
    },
  })
}

export function useAtribuir() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (v: { id: string; atendenteId: string | null }) => atendimentoApi.atribuir(v.id, v.atendenteId),
    onSuccess: invalidate,
  })
}

export function useTransferir() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (v: { id: string; canalId: string }) => atendimentoApi.transferir(v.id, v.canalId),
    onSuccess: invalidate,
  })
}

export function useResolver() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (v: { id: string; autor: string }) => atendimentoApi.resolver(v.id, v.autor),
    onSuccess: invalidate,
  })
}

export function useMarcarLida() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (id: string) => atendimentoApi.marcarLida(id), onSuccess: invalidate })
}
