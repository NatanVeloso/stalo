import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useToasts } from './toast.store'

const icons = { neutral: Info, ok: CheckCircle2, danger: XCircle }

/** Montar uma vez no App. Mensagens vêm de `toast()` / `useToasts().push`. */
export function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  const dismiss = useToasts((s) => s.dismiss)
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = icons[t.tone]
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className={cn(
              'animate-rise pointer-events-auto flex items-center gap-2.5 rounded-full py-2.5 pr-4 pl-3 text-sm glass-strong',
              t.tone === 'ok' && 'text-ok',
              t.tone === 'danger' && 'text-danger',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="text-fg">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
