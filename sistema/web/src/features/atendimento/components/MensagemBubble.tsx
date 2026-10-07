import { Check, CheckCheck, FileText, StickyNote, LayoutTemplate } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT, useLocale } from '@/shared/i18n'
import { formatTime } from '@/shared/lib/format'
import type { Mensagem } from '../types'

export function MensagemBubble({ m }: { m: Mensagem }) {
  const t = useT()
  const locale = useLocale()

  if (m.de === 'sistema') {
    return (
      <li className="my-1 flex justify-center">
        <span className="rounded-full bg-fg/[0.05] px-3 py-1 text-[11px] text-fg-subtle">{m.texto}</span>
      </li>
    )
  }

  const mine = m.de === 'atendente'
  const note = m.tipo === 'nota'
  return (
    <li className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm',
          note
            ? 'border border-dashed border-warn/50 bg-warn-soft text-fg'
            : mine
              ? 'rounded-br-md bg-accent text-accent-fg'
              : 'rounded-bl-md border border-line bg-fg/[0.05] text-fg',
        )}
      >
        {(note || m.tipo === 'template' || (mine && m.autor)) && (
          <p
            className={cn(
              'mb-0.5 flex items-center gap-1 text-[11px] font-medium',
              note ? 'text-warn' : mine ? 'text-accent-fg/70' : 'text-fg-muted',
            )}
          >
            {note && <StickyNote className="size-3" aria-hidden="true" />}
            {m.tipo === 'template' && <LayoutTemplate className="size-3" aria-hidden="true" />}
            {note
              ? `${t.atendimento.message.note} · ${m.autor}`
              : m.tipo === 'template'
                ? `${t.atendimento.message.template} · ${m.autor}`
                : m.autor}
          </p>
        )}
        {m.tipo === 'midia' && m.midia ? (
          <span
            className={cn('flex items-center gap-2 rounded-xl px-2 py-1.5', mine ? 'bg-accent-fg/10' : 'bg-fg/[0.05]')}
          >
            <FileText className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium">{m.midia.nome}</span>
              <span className={cn('block text-[11px]', mine ? 'text-accent-fg/70' : 'text-fg-muted')}>
                {t.atendimento.message.attachment} · {m.midia.tamanho}
              </span>
            </span>
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{m.texto}</p>
        )}
        <p
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[10px]',
            note ? 'text-warn/80' : mine ? 'text-accent-fg/60' : 'text-fg-subtle',
          )}
        >
          <time dateTime={m.em}>{formatTime(m.em, locale)}</time>
          {m.status &&
            (m.status === 'enviada' ? (
              <Check className="size-3" aria-label={t.atendimento.message.status.enviada} />
            ) : (
              <CheckCheck
                className={cn('size-3', m.status === 'lida' && 'text-sky-300')}
                aria-label={t.atendimento.message.status[m.status]}
              />
            ))}
        </p>
      </div>
    </li>
  )
}
