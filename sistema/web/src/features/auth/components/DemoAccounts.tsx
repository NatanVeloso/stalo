import { useT } from '@/shared/i18n'
import { authApi } from '@/shared/auth/auth.api'

type Credenciais = { email: string; password: string }

/**
 * Atalhos de demonstração: preenchem e-mail/senha de um usuário de cada perfil. A lista vem de
 * `authApi.contasDemo()` (vazia fora do modo mock), então a página não sabe nada do mock.
 */
export function DemoAccounts({ onPick }: { onPick: (credenciais: Credenciais) => void }) {
  const t = useT()
  const contas = authApi.contasDemo()
  if (contas.length === 0) return null
  return (
    <div className="mt-7 border-t border-line pt-5">
      <p className="text-small font-medium text-fg-muted">{t.auth.demoTitle}</p>
      <p className="mt-0.5 text-xs text-fg-subtle">{t.auth.demoHint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {contas.map((c) => (
          <button
            key={c.role}
            type="button"
            onClick={() => onPick({ email: c.email, password: c.password })}
            className="rounded-full px-3 py-1.5 text-small font-medium text-fg-muted glass-inset transition-colors hover:border-line-strong hover:text-fg"
          >
            {t.common.roles[c.role]}
          </button>
        ))}
      </div>
    </div>
  )
}
