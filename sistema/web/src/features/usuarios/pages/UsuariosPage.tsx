import { UserPlus } from 'lucide-react'
import { useT, useLocale } from '@/shared/i18n'
import { roles } from '@/shared/auth'
import { formatRelative } from '@/shared/lib/format'
import { PageHeader } from '@/shared/layout'
import { Avatar, Badge, Button, Card, CardHeader, DataTable, type Column } from '@/shared/ui'
import { useUsuarios } from '../queries'
import type { Usuario } from '../types'

export function UsuariosPage() {
  const t = useT()
  const locale = useLocale()
  const query = useUsuarios()

  const columns: Column<Usuario>[] = [
    {
      key: 'nome',
      header: t.usuarios.columns.usuario,
      sortValue: (u) => u.nome,
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
      sortValue: (u) => u.role,
      cell: (u) => <Badge dot={false}>{t.common.roles[u.role]}</Badge>,
    },
    {
      key: 'ultimoAcesso',
      header: t.usuarios.columns.ultimoAcesso,
      hideOnMobile: true,
      sortValue: (u) => u.ultimoAcesso ?? '',
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
      sortValue: (u) => u.status,
      cell: (u) => <Badge tone={u.status === 'ativo' ? 'ok' : 'neutral'}>{t.common.status[u.status]}</Badge>,
    },
  ]

  return (
    <>
      <PageHeader
        title={t.usuarios.title}
        description={t.usuarios.subtitle}
        actions={<Button leading={<UserPlus className="size-4" />}>{t.usuarios.invite}</Button>}
      />

      <div className="animate-rise grid gap-4 xl:grid-cols-3">
        <Card padding="none" className="xl:col-span-2">
          <DataTable columns={columns} rows={query.data ?? []} rowKey={(u) => u.id} loading={query.isPending} />
        </Card>

        <Card>
          <CardHeader title={t.usuarios.columns.perfil} />
          <ul className="flex flex-col gap-3">
            {roles.map((r) => (
              <li key={r} className="rounded-2xl bg-fg/[0.04] p-3">
                <p className="text-sm font-medium">{t.common.roles[r]}</p>
                <p className="mt-0.5 text-[13px] text-fg-muted">{t.usuarios.rolesHelp[r]}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
