import { useT } from '@/shared/i18n'
import { roles } from '@/shared/auth'
import { Card, CardHeader } from '@/shared/ui'

/** Legenda dos perfis: o que cada um enxerga (texto fixo do dicionário, não vem da API). */
export function PerfisCard() {
  const t = useT()
  return (
    <Card>
      <CardHeader title={t.usuarios.columns.perfil} />
      <ul className="flex flex-col gap-(--list-gap)">
        {roles.map((r) => (
          <li key={r} className="rounded-2xl px-3 py-(--list-y) glass-inset">
            <p className="text-sm font-medium">{t.common.roles[r]}</p>
            <p className="mt-0.5 text-small text-fg-muted">{t.usuarios.rolesHelp[r]}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
