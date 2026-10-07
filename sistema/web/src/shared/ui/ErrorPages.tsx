import { Link } from 'react-router'
import { ShieldOff, Compass, AlertTriangle } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { Button } from './Button'
import { Card } from './Card'

type Props = { title: string; description: string; icon: React.ReactNode; retry?: () => void }

function ErrorShell({ title, description, icon, retry }: Props) {
  const t = useT()
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" padding="lg">
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
          <Link to="/">
            <Button>{t.common.errors.goHome}</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export function ForbiddenPage() {
  const t = useT()
  return (
    <ErrorShell title={t.common.errors.forbiddenTitle} description={t.common.errors.forbidden} icon={<ShieldOff />} />
  )
}

export function NotFoundPage() {
  const t = useT()
  return <ErrorShell title={t.common.errors.notFoundTitle} description={t.common.errors.notFound} icon={<Compass />} />
}

export function ErrorFallback({ retry }: { retry?: () => void }) {
  const t = useT()
  return (
    <ErrorShell
      title={t.common.errors.title}
      description={t.common.errors.generic}
      icon={<AlertTriangle />}
      retry={retry}
    />
  )
}
