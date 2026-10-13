import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/shared/auth/auth.api'

/** Pede o link de redefinição de senha. Erro vira toast global (queryClient). */
export const useEsqueciSenha = () => useMutation({ mutationFn: (email: string) => authApi.esqueciSenha(email) })
