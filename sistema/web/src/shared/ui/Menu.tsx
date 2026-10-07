import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  /** Recebe o estado e os atributos ARIA para colocar no botão que abre. */
  trigger: (props: {
    open: boolean
    toggle: () => void
    'aria-expanded': boolean
    'aria-controls': string
    'aria-haspopup': 'menu'
  }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  className?: string
}

/** Menu suspenso simples: fecha no clique fora e no Esc. Itens: `MenuItem`. */
export function Menu({ trigger, children, align = 'right', className }: Props) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div ref={root} className={cn('relative', className)}>
      {trigger({
        open,
        toggle: () => setOpen((o) => !o),
        'aria-expanded': open,
        'aria-controls': id,
        'aria-haspopup': 'menu',
      })}
      {open && (
        <div
          id={id}
          role="menu"
          className={cn(
            'animate-rise absolute top-full z-30 mt-2 flex min-w-48 flex-col gap-0.5 rounded-2xl p-1.5 glass-strong',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

type ItemProps = {
  onSelect: () => void
  icon?: ReactNode
  active?: boolean
  tone?: 'default' | 'danger'
  children: ReactNode
}

export function MenuItem({ onSelect, icon, active, tone = 'default', children }: ItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors [&>svg]:size-4',
        tone === 'danger' ? 'text-danger hover:bg-danger-soft' : 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
        active && 'bg-fg/[0.08] text-fg',
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
    </button>
  )
}

export function MenuSeparator() {
  return <hr className="my-1 border-line" />
}
