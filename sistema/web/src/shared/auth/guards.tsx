import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth.store'
import { can, type Permission } from './permissions'
import { SplashScreen } from '@/shared/ui/SplashScreen'
import { ForbiddenPage } from '@/shared/ui/ErrorPages'

/** Rotas filhas só para quem está logado; anônimo vai para /login e volta depois. */
export function RequireAuth() {
  const status = useAuth((s) => s.status)
  const location = useLocation()
  if (status === 'booting') return <SplashScreen />
  if (status === 'anonymous') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Rotas filhas só para quem tem a permissão; os outros veem a página de sem acesso. */
export function RequirePermission({ permission }: { permission: Permission }) {
  const role = useAuth((s) => s.user?.role)
  if (!can(role, permission)) return <ForbiddenPage />
  return <Outlet />
}

/** /login com sessão ativa manda para a home. */
export function RedirectIfAuthenticated() {
  const status = useAuth((s) => s.status)
  if (status === 'booting') return <SplashScreen />
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <Outlet />
}
