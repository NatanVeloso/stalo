import { useT } from '@/shared/i18n'
import { roles, type Role } from '@/shared/auth'

/** Atalhos de demonstração: preenchem e-mail/senha de um usuário fake de cada perfil. Só no modo mock. */
export function DemoAccounts({ onPick }: { onPick: (role: Role) => void }) {
  const t = useT()
  return (
    <div className="mt-7 border-t border-line pt-5">
      <p className="text-[13px] font-medium text-fg-muted">{t.auth.demoTitle}</p>
      <p className="mt-0.5 text-xs text-fg-subtle">{t.auth.demoHint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onPick(role)}
            className="rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-fg-muted transition-colors hover:border-line-strong hover:bg-fg/[0.05] hover:text-fg"
          >
            {t.common.roles[role]}
          </button>
        ))}
      </div>
    </div>
  )
}
