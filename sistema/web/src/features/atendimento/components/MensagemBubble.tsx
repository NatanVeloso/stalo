import { Check, CheckCheck, FileText, StickyNote, LayoutTemplate } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatTime } from '@/shared/lib/format'
import type { Mensagem } from '../types'

export function MensagemBubble({ m }: { m: Mensagem }) {
  const t = useT()
  const locale = useLocale()

  if (m.de === 'sistema') {
    // o back manda o evento e os nomes; o texto sai no idioma de quem lê
    const modelo = m.evento ? t.atendimento.message.eventos[m.evento] : m.texto
    return (
      <li className="flex justify-center">
        <span className="rounded-full bg-fg/[0.05] px-3 py-(--list-gap) text-caption text-fg-subtle">
          {fmt(modelo, {
            atendente: m.dados?.atendente ?? '',
            canal: m.dados?.canal ?? '',
            cliente: m.dados?.cliente ?? '',
          })}
        </span>
      </li>
    )
  }

  const mine = m.de === 'atendente'
  const note = m.tipo === 'nota'
  return (
    <li className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-(--list-gap) text-sm',
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
              'mb-0.5 flex items-center gap-1 text-caption font-medium',
              note ? 'text-warn' : mine ? 'text-accent-fg/70' : 'text-fg-muted',
            )}
          >
            {note && <StickyNote className="size-3" aria-hidden="true" />}
            {m.tipo === 'template' && <LayoutTemplate className="size-3" aria-hidden="true" />}
            {note
              ? fmt(t.atendimento.message.noteBy, { autor: m.autor ?? '' })
              : m.tipo === 'template'
                ? fmt(t.atendimento.message.templateBy, { autor: m.autor ?? '' })
                : m.autor}
          </p>
        )}
        {m.tipo === 'midia' && m.midia ? (
          <span
            className={cn('flex items-center gap-2 rounded-xl px-2 py-1.5', mine ? 'bg-accent-fg/10' : 'bg-fg/[0.05]')}
          >
            <FileText className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block truncate text-small font-medium">{m.midia.nome}</span>
              <span className={cn('block text-caption', mine ? 'text-accent-fg/70' : 'text-fg-muted')}>
                {fmt(t.atendimento.message.attachmentSize, { tamanho: m.midia.tamanho })}
              </span>
            </span>
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{m.texto}</p>
        )}
        <p
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-micro',
            note ? 'text-warn/80' : mine ? 'text-accent-fg/60' : 'text-fg-subtle',
          )}
        >
          <time dateTime={m.em}>{formatTime(m.em, locale)}</time>
          {m.status && (
            <>
              {/* lida = check duplo em cor cheia; enviada/entregue ficam no tom esmaecido da linha */}
              {m.status === 'enviada' ? (
                <Check className="size-3" />
              ) : (
                <CheckCheck className={cn('size-3', m.status === 'lida' && 'text-accent-fg')} />
              )}
              <span className="sr-only">{t.atendimento.message.status[m.status]}</span>
            </>
          )}
        </p>
      </div>
    </li>
  )
}
