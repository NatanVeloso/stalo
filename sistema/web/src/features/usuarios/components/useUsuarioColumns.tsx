import { useT, useLocale } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { Avatar, Badge, type Column } from '@/shared/ui'
import type { Usuario } from '../types'

/** Colunas da lista de usuários. Ordenação é no servidor (`sortable`), por isso sem `sortValue`. */
export function useUsuarioColumns(): Column<Usuario>[] {
  const t = useT()
  const locale = useLocale()
  return [
    {
      key: 'nome',
      header: t.usuarios.columns.usuario,
      sortable: true,
      cell: (u) => (
        <span className="flex items-center gap-3">
          <Avatar name={u.nome} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{u.nome}</span>
            <span className="block truncate text-xs text-fg-muted">{u.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'role',
      header: t.usuarios.columns.perfil,
      sortable: true,
      cell: (u) => <Badge dot={false}>{t.common.roles[u.role]}</Badge>,
    },
    {
      key: 'ultimoAcesso',
      header: t.usuarios.columns.ultimoAcesso,
      hideOnMobile: true,
      sortable: true,
      cell: (u) =>
        u.ultimoAcesso ? (
          <span className="text-fg-muted">{formatRelative(u.ultimoAcesso, locale)}</span>
        ) : (
          <span className="text-fg-subtle">{t.usuarios.never}</span>
        ),
    },
    {
      key: 'status',
      header: t.usuarios.columns.status,
      sortable: true,
      cell: (u) => <Badge tone={u.status === 'ativo' ? 'ok' : 'neutral'}>{t.common.status[u.status]}</Badge>,
    },
  ]
}
