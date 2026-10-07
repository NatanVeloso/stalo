import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { atendimentoApi } from './api'
import type { ConversasFiltro, EnviarMensagemInput } from './types'

export const atendimentoKeys = {
  all: ['atendimento'] as const,
  canais: () => [...atendimentoKeys.all, 'canais'] as const,
  conversas: (f: ConversasFiltro) => [...atendimentoKeys.all, 'conversas', f] as const,
  mensagens: (id: string) => [...atendimentoKeys.all, 'mensagens', id] as const,
}

export const useCanais = () => useQuery({ queryKey: atendimentoKeys.canais(), queryFn: atendimentoApi.canais })

export const useConversas = (f: ConversasFiltro) =>
  useQuery({ queryKey: atendimentoKeys.conversas(f), queryFn: () => atendimentoApi.conversas(f) })

export const useMensagens = (id: string | null) =>
  useQuery({
    queryKey: atendimentoKeys.mensagens(id ?? ''),
    queryFn: () => atendimentoApi.mensagens(id!),
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
    onSuccess: invalidate,
  })
}

export function useAtribuir() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (v: { id: string; atendente: string }) => atendimentoApi.atribuir(v.id, v.atendente),
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
