import { useAuth } from './auth.store'
import { can, type Permission } from './permissions'

/** `const podeEditar = usePermission('clientes:editar')` — para esconder botões e colunas. */
export function usePermission(permission: Permission) {
  return useAuth((s) => can(s.user?.role, permission))
}
