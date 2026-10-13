import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { Button } from './Button'
import { Card } from './Card'
import { LinkButton } from './LinkButton'

type Props = { title: string; description: string; icon: ReactNode; retry?: () => void }

/** Moldura das páginas de erro (sem acesso, não encontrada, falha geral). Interno de `shared/ui`. */
export function ErrorShell({ title, description, icon, retry }: Props) {
  const t = useT()
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="animate-rise w-full max-w-md text-center" padding="lg">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-fg/[0.06] text-fg-muted [&>svg]:size-6">
          {icon}
        </span>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-fg-muted">{description}</p>
        <div className="mt-6 flex justify-center gap-2">
          {retry && (
            <Button variant="secondary" onClick={retry}>
              {t.common.actions.retry}
            </Button>
          )}
          <LinkButton to="/">{t.common.errors.goHome}</LinkButton>
        </div>
      </Card>
    </div>
  )
}
