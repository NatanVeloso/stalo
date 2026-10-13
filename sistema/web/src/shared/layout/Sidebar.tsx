import { NavLink } from 'react-router'
import { LogOut } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n'
import { can, useAuth } from '@/shared/auth'
import { Avatar, IconButton, Logo } from '@/shared/ui'
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
      className={cn('relative isolate flex h-full glass flex-col rounded-3xl p-4', className)}
      aria-label={t.common.navLabel}
    >
      <span className="glass-sheen -z-10" aria-hidden="true" />
      <NavLink to="/" onClick={onNavigate} className="flex items-center px-2 py-2 text-fg" aria-label={t.common.app}>
        <Logo className="h-6 w-auto" />
      </NavLink>

      <nav className="mt-(--stack-y) flex flex-1 flex-col gap-(--stack-y)">
        {sections.map(
          ({ key, items }) =>
            items.length > 0 && (
              <div key={key}>
                <p className="mb-1.5 px-3 text-caption font-semibold tracking-[0.08em] text-fg-subtle uppercase">
                  {t.common.nav.sections[key]}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {items.map(({ to, icon: Icon, label, activeColor }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === '/'}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-2xl px-3 py-(--nav-y) text-sm font-medium transition-colors duration-200',
                            isActive ? 'text-fg glass-inset' : 'text-fg-muted hover:bg-fg/[0.06] hover:text-fg',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={cn('size-[1.125rem] transition-colors duration-200', isActive && activeColor)}
                              aria-hidden="true"
                            />
                            {t.common.nav[label]}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </nav>

      {user && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl p-2.5 glass-inset">
          <Avatar name={user.nome} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-medium">{user.nome}</p>
            <p className="truncate text-caption text-fg-subtle">{t.common.roles[user.role]}</p>
          </div>
          <IconButton size="sm" label={t.common.actions.logout} onClick={() => void logout()}>
            <LogOut />
          </IconButton>
        </div>
      )}
    </aside>
  )
}
