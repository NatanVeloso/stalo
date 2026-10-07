import { useT } from '@/shared/i18n'
import { Badge, type BadgeTone } from '@/shared/ui'
import type { ConversaEstado } from '../types'

const tones: Record<ConversaEstado, BadgeTone> = {
  aberta: 'warn',
  em_atendimento: 'neutral',
  aguardando_cliente: 'neutral',
  resolvida: 'ok',
}

export function EstadoBadge({ estado }: { estado: ConversaEstado }) {
  const t = useT()
  return <Badge tone={tones[estado]}>{t.atendimento.estados[estado]}</Badge>
}
