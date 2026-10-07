import { useState } from 'react'
import { Outlet } from 'react-router'
import { X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/** Casca das páginas logadas: sidebar fixa (desktop) ou overlay (mobile), barra em pílula e conteúdo. */
export function AppShell() {
  const t = useT()
  // o menu mobile fecha no próprio clique do link (Sidebar.onNavigate), sem efeito de rota
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <div className="orbs" aria-hidden="true" />

      <div className="flex w-full gap-4 px-3 py-3 md:px-4 md:py-4">
        <div className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Topbar onOpenMenu={() => setMenuOpen(true)} />
          <main className="min-w-0 flex-1 pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label={t.common.actions.closeMenu}
            onClick={() => setMenuOpen(false)}
          />
          <div className="animate-rise relative h-full w-72 p-3">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
            <IconButton
              label={t.common.actions.closeMenu}
              variant="glass"
              size="sm"
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6"
            >
              <X />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  )
}
