import { useState, type KeyboardEvent } from 'react'
import { Paperclip, Send, StickyNote } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT, fmt } from '@/shared/i18n'
import { Button, IconButton } from '@/shared/ui'
import { TemplateMenu } from './TemplateMenu'

type Props = {
  /** Janela de 24 h fechada: só nota interna ou template. */
  windowClosed: boolean
  sending: boolean
  onSend: (texto: string, nota: boolean) => void
  onTemplate: (templateId: string) => void
}

export function Composer({ windowClosed, sending, onSend, onTemplate }: Props) {
  const t = useT()
  const [texto, setTexto] = useState('')
  const [nota, setNota] = useState(false)
  const blocked = windowClosed && !nota

  const submit = () => {
    const v = texto.trim()
    if (!v || blocked) return
    onSend(v, nota)
    setTexto('')
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border-t border-line p-3">
      {blocked && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-danger-soft px-3 py-(--list-gap) text-small text-danger">
          <span>
            {fmt(t.atendimento.window.closedBanner, {
              closed: t.atendimento.window.closed,
              hint: t.atendimento.window.hint,
            })}
          </span>
          <TemplateMenu disabled={sending} onEscolher={onTemplate} />
        </div>
      )}
      <div
        className={cn(
          'flex items-end gap-2 rounded-2xl border px-2 py-1.5 transition-colors',
          nota ? 'border-warn/50 bg-warn-soft' : 'border-line bg-fg/[0.03] focus-within:border-line-strong',
        )}
      >
        <IconButton
          size="sm"
          label={t.atendimento.composer.note}
          active={nota}
          aria-pressed={nota}
          onClick={() => setNota((n) => !n)}
          className={cn(nota && 'text-warn')}
        >
          <StickyNote />
        </IconButton>
        <IconButton size="sm" label={t.atendimento.message.attachment} disabled={blocked}>
          <Paperclip />
        </IconButton>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          disabled={blocked}
          placeholder={nota ? t.atendimento.composer.notePlaceholder : t.atendimento.composer.placeholder}
          aria-label={nota ? t.atendimento.composer.note : t.atendimento.composer.send}
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-fg-subtle disabled:opacity-50"
        />
        <Button
          size="sm"
          onClick={submit}
          loading={sending}
          disabled={!texto.trim() || blocked}
          leading={<Send className="size-3.5" />}
        >
          {t.atendimento.composer.send}
        </Button>
      </div>
      <p className="mt-1.5 px-1 text-caption text-fg-subtle">{t.atendimento.composer.hint}</p>
    </div>
  )
}
