import { ShieldOff } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { ErrorShell } from './ErrorShell'

/** Rota existente, mas o perfil não tem a permissão (ver `RequirePermission`). */
export function ForbiddenPage() {
  const t = useT()
  return (
    <ErrorShell title={t.common.errors.forbiddenTitle} description={t.common.errors.forbidden} icon={<ShieldOff />} />
  )
}
