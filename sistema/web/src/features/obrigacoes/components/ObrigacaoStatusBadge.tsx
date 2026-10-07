import { useT } from '@/shared/i18n'
import { Badge, type BadgeTone } from '@/shared/ui'
import type { ObrigacaoStatus } from '../types'

const tones: Record<ObrigacaoStatus, BadgeTone> = { pendente: 'neutral', entregue: 'ok', atrasada: 'danger' }

export function ObrigacaoStatusBadge({ status }: { status: ObrigacaoStatus }) {
  const t = useT()
  return <Badge tone={tones[status]}>{t.common.status[status]}</Badge>
}
