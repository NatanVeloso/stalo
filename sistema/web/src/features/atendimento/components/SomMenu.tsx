import { useId, type ReactNode } from 'react'
import { Bell, BellOff, MessageSquareMore, Play, Send } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { IconButton, Popover, Switch } from '@/shared/ui'
import { tocarSomEnvio, tocarSomRecebimento } from '../lib/sons'

/** Sino com painel: toggle do som ao enviar e ao receber, cada um com descrição e botão de ouvir. */
export function SomMenu() {
  const t = useT()
  const somAoEnviar = usePrefs((s) => s.somAoEnviar)
  const somAoReceber = usePrefs((s) => s.somAoReceber)
  const setSom = usePrefs((s) => s.setSom)
  const mudo = !somAoEnviar && !somAoReceber

  return (
    <Popover
      label={t.atendimento.sons.label}
      trigger={
        <IconButton size="sm" label={t.atendimento.sons.label} active={mudo}>
          {mudo ? <BellOff /> : <Bell />}
        </IconButton>
      }
    >
      <div className="flex w-[19rem] max-w-[calc(100vw-2rem)] flex-col gap-1">
        <SomLinha
          icon={<Send />}
          title={t.atendimento.sons.send}
          description={t.atendimento.sons.sendHint}
          previewLabel={t.atendimento.sons.preview}
          checked={somAoEnviar}
          onChange={(on) => setSom('somAoEnviar', on)}
          onPreview={() => tocarSomEnvio(true)}
        />
        <SomLinha
          icon={<MessageSquareMore />}
          title={t.atendimento.sons.receive}
          description={t.atendimento.sons.receiveHint}
          previewLabel={t.atendimento.sons.preview}
          checked={somAoReceber}
          onChange={(on) => setSom('somAoReceber', on)}
          onPreview={() => tocarSomRecebimento(true)}
        />
      </div>
    </Popover>
  )
}

type LinhaProps = {
  icon: ReactNode
  title: string
  description: string
  previewLabel: string
  checked: boolean
  onChange: (on: boolean) => void
  onPreview: () => void
}

function SomLinha({ icon, title, description, previewLabel, checked, onChange, onPreview }: LinhaProps) {
  const id = useId()
  return (
    <div className="flex items-center gap-3 rounded-xl px-2.5 py-(--list-gap) [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-fg-muted">
      {icon}
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-sm text-fg">
          {title}
        </label>
        <p className="text-xs leading-snug text-fg-muted">{description}</p>
      </div>
      <IconButton size="sm" label={previewLabel} onClick={onPreview}>
        <Play />
      </IconButton>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  )
}
