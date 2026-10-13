import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/auth'
import { configuracoesApi } from './api'

export const configuracoesKeys = {
  all: ['configuracoes'] as const,
  sessoes: () => [...configuracoesKeys.all, 'sessoes'] as const,
}

/** Salva o perfil e troca o usuário da sessão (Topbar, avatar) sem recarregar. */
export function useAtualizarPerfil() {
  const qc = useQueryClient()
  const setUser = useAuth((s) => s.setUser)
  return useMutation({
    mutationFn: configuracoesApi.atualizarPerfil,
    onSuccess: (user) => {
      setUser(user)
      // nome/e-mail aparecem na lista de usuários (outro módulo)
      void qc.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}

export const useSessoes = () => useQuery({ queryKey: configuracoesKeys.sessoes(), queryFn: configuracoesApi.sessoes })

export function useEncerrarSessao() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: configuracoesApi.encerrarSessao,
    onSuccess: () => qc.invalidateQueries({ queryKey: configuracoesKeys.sessoes() }),
  })
}
