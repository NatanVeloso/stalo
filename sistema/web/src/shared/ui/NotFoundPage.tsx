import { Compass } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { ErrorShell } from './ErrorShell'

export function NotFoundPage() {
  const t = useT()
  return <ErrorShell title={t.common.errors.notFoundTitle} description={t.common.errors.notFound} icon={<Compass />} />
}
