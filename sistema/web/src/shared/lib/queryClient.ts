import { MutationCache, QueryClient } from '@tanstack/react-query'
import { getDictionary } from '@/shared/i18n'
import { errorMessage } from '@/shared/i18n/errorMessage'
import { toast } from '@/shared/ui/toast.store'

/**
 * Cliente único do TanStack Query. Fica aqui (e não dentro do Provider) para o store de sessão
 * conseguir limpar o cache no logout: sem isso, quem entra em seguida na mesma aba vê os dados
 * do usuário anterior até vencer o `staleTime`.
 *
 * Erro de **mutação** vira toast traduzido pelo `code` da API (DOMINIO.md → Erros). A mutação que
 * trata o próprio erro (ex.: formulário que mostra o erro no campo) passa `meta: { silent: true }`.
 * Erro de **query** é mostrado pela tela (`ErrorState`/`DataTable error`), não por toast.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.silent) return
      toast(errorMessage(error, getDictionary()), 'danger')
    },
  }),
})

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: { silent?: boolean }
  }
}
