import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Outlet } from 'react-router'
import { X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/** Casca das páginas logadas: sidebar fixa (desktop) ou overlay (mobile), barra em pílula e conteúdo. */
export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <div className="orbs" aria-hidden="true" />

      <div className="flex w-full gap-(--shell-gap) px-3 py-3 md:px-4 md:py-4">
        <div className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-(--shell-gap)">
          <Topbar onOpenMenu={() => setMenuOpen(true)} />
          <main className="min-w-0 flex-1 pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

/**
 * Menu lateral no mobile. `<dialog>` nativo em portal: Esc fecha, o foco fica preso dentro e o
 * clique no véu fecha. Fecha também no clique de um link (Sidebar.onNavigate), sem efeito de rota.
 */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={t.common.navLabel}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-scrim backdrop:backdrop-blur-sm open:flex lg:hidden"
    >
      <div className="animate-rise relative h-full w-72 p-3" onClick={(e) => e.stopPropagation()}>
        <Sidebar onNavigate={onClose} />
        <IconButton
          label={t.common.actions.closeMenu}
          variant="glass"
          size="sm"
          onClick={onClose}
          className="absolute top-6 right-6"
        >
          <X />
        </IconButton>
      </div>
    </dialog>,
    document.body,
  )
}
