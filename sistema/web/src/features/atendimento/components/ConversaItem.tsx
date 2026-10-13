import { cn } from '@/shared/lib/cn'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { Avatar } from '@/shared/ui'
import type { Conversa } from '../types'

type Props = { conversa: Conversa; canalNome: string | undefined; active: boolean; onSelect: () => void }

/** Uma linha da lista de conversas. Sem vidro (item repetido): o destaque é translucidez do texto. */
export function ConversaItem({ conversa: c, canalNome, active, onSelect }: Props) {
  const t = useT()
  const locale = useLocale()

  return (
    <li>
      <button
        type="button"
        aria-current={active || undefined}
        onClick={onSelect}
        className={cn(
          'flex w-full items-start gap-3 rounded-2xl px-3 py-(--list-y) text-left transition-colors',
          active ? 'bg-fg/[0.08]' : 'hover:bg-fg/[0.04]',
        )}
      >
        <Avatar
          name={c.contato.nome}
          size="md"
          className={cn(c.cliente ? 'bg-fg/[0.1] text-fg' : 'bg-fg/[0.06] text-fg-muted')}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={cn('truncate text-sm', c.naoLidas ? 'font-semibold' : 'font-medium')}>
              {c.contato.nome}
            </span>
            <time dateTime={c.ultimaEm} className="shrink-0 text-caption text-fg-subtle">
              {formatRelative(c.ultimaEm, locale)}
            </time>
          </span>
          <span className="block truncate text-xs text-fg-muted">{c.cliente ?? t.atendimento.noClient}</span>
          <span className="mt-1 flex items-center gap-2">
            <span className={cn('min-w-0 flex-1 truncate text-small', c.naoLidas ? 'text-fg' : 'text-fg-muted')}>
              {c.ultimaMensagem}
            </span>
            {c.naoLidas > 0 && (
              <span className="shrink-0 rounded-full bg-accent px-1.5 text-caption font-semibold text-accent-fg tabular">
                <span aria-hidden="true">{c.naoLidas}</span>
                <span className="sr-only">{fmt(t.atendimento.unread, { n: c.naoLidas })}</span>
              </span>
            )}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-caption text-fg-subtle">
            <span className="rounded-full bg-fg/[0.06] px-1.5 py-[calc(var(--list-gap)/4)]">
              {canalNome ?? t.atendimento.semCanal}
            </span>
            {c.estado === 'aberta' && (
              <>
                <span className="size-1.5 rounded-full bg-warn" aria-hidden="true" />
                <span className="sr-only">{t.atendimento.estados.aberta}</span>
              </>
            )}
            {c.etiquetas.map((etiqueta) => (
              <span key={etiqueta} className="rounded-full border border-line px-1.5 py-[calc(var(--list-gap)/4)]">
                {etiqueta}
              </span>
            ))}
          </span>
        </span>
      </button>
    </li>
  )
}
