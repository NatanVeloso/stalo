import { AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n'
import { Button } from './Button'

type Props = { onRetry?: () => void; title?: string; description?: string; className?: string }

/**
 * Erro ao carregar dado, no lugar do conteúdo (lista, card, painel). Mesma forma do `EmptyState`
 * para a tela não pular; o botão refaz a query. Textos padrão vêm do dicionário.
 */
export function ErrorState({ onRetry, title, description, className }: Props) {
  const t = useT()
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center gap-2 px-6 py-14 text-center', className)}
    >
      <span className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-danger-soft text-danger [&>svg]:size-5">
        <AlertTriangle aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-fg">{title ?? t.common.errors.loadTitle}</p>
      <p className="max-w-xs text-small text-fg-muted">{description ?? t.common.errors.loadHint}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          {t.common.actions.retry}
        </Button>
      )}
    </div>
  )
}
