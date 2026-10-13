import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { IconButton } from './IconButton'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/**
 * Painel lateral (direita) para detalhe e formulários curtos. Fecha no Esc e
 * no clique fora; prende o foco dentro enquanto aberto (<dialog> nativo).
 */
export function Drawer({ open, onClose, title, description, children, footer }: Props) {
  const t = useT()
  const ref = useRef<HTMLDialogElement>(null)
  // id único: dois drawers na mesma tela não podem apontar para o mesmo título
  const titleId = useId()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return createPortal(
    <dialog
      ref={ref}
      // o evento `close` do <dialog> também dispara quando o pai fecha (open=false → el.close());
      // só repassa quando o fechamento veio do próprio dialog (Esc), senão onClose roda duas vezes
      onClose={() => open && onClose()}
      onClick={(e) => e.target === ref.current && onClose()}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-scrim backdrop:backdrop-blur-sm open:flex"
      aria-labelledby={titleId}
    >
      <div className="ml-auto flex h-full w-full max-w-lg flex-col p-3 md:p-4" onClick={(e) => e.stopPropagation()}>
        <section className="animate-rise relative flex h-full glass-strong flex-col overflow-hidden rounded-3xl">
          <span className="glass-sheen" aria-hidden="true" />
          <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-small text-fg-muted">{description}</p>}
            </div>
            <IconButton label={t.common.actions.close} onClick={onClose} variant="glass" size="sm">
              <X />
            </IconButton>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
          {footer && (
            <footer className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">{footer}</footer>
          )}
        </section>
      </div>
    </dialog>,
    document.body,
  )
}
