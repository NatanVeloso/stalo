import { NavLink } from 'react-router'
import { LogOut } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n'
import { can, useAuth } from '@/shared/auth'
import { Avatar, Logo } from '@/shared/ui'
import { navItems } from './nav'

type Props = { onNavigate?: () => void; className?: string }

/** Menu lateral. No desktop fica fixo; no mobile entra num overlay (ver AppShell). */
export function Sidebar({ onNavigate, className }: Props) {
  const t = useT()
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const visible = navItems.filter((i) => can(user?.role, i.permission))
  const sections = (['operacao', 'gestao'] as const).map((s) => ({
    key: s,
    items: visible.filter((i) => i.section === s),
  }))

  return (
    <aside
      className={cn('relative isolate flex h-full flex-col rounded-3xl p-4 glass', className)}
      aria-label={t.common.nav.dashboard}
    >
      <span className="glass-sheen -z-10" aria-hidden="true" />
      <NavLink to="/" onClick={onNavigate} className="flex items-center px-2 py-2 text-fg" aria-label={t.common.app}>
        <Logo className="h-6 w-auto" />
      </NavLink>

      <nav className="mt-6 flex flex-1 flex-col gap-5">
        {sections.map(
          ({ key, items }) =>
            items.length > 0 && (
              <div key={key}>
                <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.08em] text-fg-subtle uppercase">
                  {t.common.nav.sections[key]}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {items.map(({ to, icon: Icon, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === '/'}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-2xl px-3 py-(--nav-y) text-sm font-medium transition-colors duration-200',
                            isActive
                              ? 'bg-accent text-accent-fg shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)]'
                              : 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
                          )
                        }
                      >
                        <Icon className="size-[18px]" aria-hidden="true" />
                        {t.common.nav[label]}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </nav>

      {user && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line p-2.5">
          <Avatar name={user.nome} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user.nome}</p>
            <p className="truncate text-[11px] text-fg-subtle">{t.common.roles[user.role]}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            aria-label={t.common.actions.logout}
            title={t.common.actions.logout}
            className="rounded-full p-1.5 text-fg-subtle transition-colors hover:bg-fg/[0.06] hover:text-fg"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </aside>
  )
}
