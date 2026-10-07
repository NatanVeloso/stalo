import { Clock } from 'lucide-react'
import { useT, fmt } from '@/shared/i18n'
import { Badge } from '@/shared/ui'
import { janelaRestanteMin } from '../lib/janela'

export function JanelaBadge({ expiraEm }: { expiraEm: string | null }) {
  const t = useT()
  const min = janelaRestanteMin(expiraEm)
  if (min === null) return null
  const closed = min <= 0
  const label = closed
    ? t.atendimento.window.closed
    : min < 60
      ? fmt(t.atendimento.window.closing, { m: min })
      : fmt(t.atendimento.window.open, { h: Math.floor(min / 60) })
  return (
    <Badge tone={closed ? 'danger' : min < 120 ? 'warn' : 'neutral'} dot={false}>
      <Clock className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  )
}
