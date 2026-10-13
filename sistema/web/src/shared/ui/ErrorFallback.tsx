import { AlertTriangle } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { ErrorShell } from './ErrorShell'

/** Falha que derrubou a página inteira (erro de render da rota). Erro de dado numa lista: `ErrorState`. */
export function ErrorFallback({ retry }: { retry?: () => void }) {
  const t = useT()
  return (
    <ErrorShell
      title={t.common.errors.title}
      description={t.common.errors.generic}
      icon={<AlertTriangle />}
      retry={retry}
    />
  )
}
