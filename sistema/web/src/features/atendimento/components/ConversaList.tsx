import { cn } from '@/shared/lib/cn'
import { useT, useLocale, fmt } from '@/shared/i18n'
import { formatRelative } from '@/shared/lib/format'
import { Avatar, EmptyState, SearchInput, Segmented, Select, Skeleton } from '@/shared/ui'
import type { Canal, Conversa, ConversaEstado } from '../types'

type Props = {
  canais: Canal[]
  conversas: Conversa[] | undefined
  loading: boolean
  canalId: string
  onCanal: (id: string) => void
  estado: ConversaEstado | ''
  onEstado: (e: ConversaEstado | '') => void
  search: string
  onSearch: (s: string) => void
  selectedId: string | null
  onSelect: (id: string) => void
  /** Contagem de conversas abertas por setor (para os contadores das abas). */
  abertasPorCanal: Record<string, number>
}

/** Coluna da esquerda: setores, filtros e lista de conversas. */
export function ConversaList({
  canais,
  conversas,
  loading,
  canalId,
  onCanal,
  estado,
  onEstado,
  search,
  onSearch,
  selectedId,
  onSelect,
  abertasPorCanal,
}: Props) {
  const t = useT()
  const locale = useLocale()
  const totalAbertas = Object.values(abertasPorCanal).reduce((s, n) => s + n, 0)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-3 p-3">
        <SearchInput value={search} onChange={onSearch} placeholder={t.atendimento.searchPlaceholder} />
        <Segmented
          size="sm"
          label={t.atendimento.setores}
          value={canalId}
          onChange={onCanal}
          className="max-w-full"
          options={[
            { value: '', label: t.atendimento.all, count: totalAbertas },
            ...canais.map((c) => ({ value: c.id, label: c.nome, count: abertasPorCanal[c.id] ?? 0 })),
          ]}
        />
        <Select
          size="sm"
          aria-label={t.atendimento.filters.label}
          value={estado}
          onChange={(v) => onEstado(v as ConversaEstado | '')}
          options={[
            { value: '', label: `${t.atendimento.filters.label}: ${t.atendimento.all}` },
            ...(Object.keys(t.atendimento.estados) as ConversaEstado[]).map((e) => ({
              value: e,
              label: t.atendimento.estados[e],
            })),
          ]}
        />
      </div>

      <ul
        className="min-h-0 flex-1 overflow-y-auto border-t border-line"
        role="listbox"
        aria-label={t.atendimento.title}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex gap-3 px-3 py-(--list-y)">
                <Skeleton className="size-9 rounded-full" />
                <span className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-4/5" />
                </span>
              </li>
            ))
          : conversas?.map((c) => {
              const active = c.id === selectedId
              const canal = canais.find((k) => k.id === c.canalId)
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => onSelect(c.id)}
                    className={cn(
                      'flex w-full items-start gap-3 px-3 py-(--list-y) text-left transition-colors',
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
                        <time dateTime={c.ultimaEm} className="shrink-0 text-[11px] text-fg-subtle">
                          {formatRelative(c.ultimaEm, locale)}
                        </time>
                      </span>
                      <span className="block truncate text-xs text-fg-muted">
                        {c.cliente ?? t.atendimento.noClient}
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate text-[13px]',
                            c.naoLidas ? 'text-fg' : 'text-fg-muted',
                          )}
                        >
                          {c.ultimaMensagem}
                        </span>
                        {c.naoLidas > 0 && (
                          <span
                            className="shrink-0 rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-fg tabular"
                            aria-label={fmt(t.atendimento.unread, { n: c.naoLidas })}
                          >
                            {c.naoLidas}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-fg-subtle">
                        <span className="rounded-full bg-fg/[0.06] px-1.5 py-0.5">{canal?.nome ?? c.canalId}</span>
                        {c.estado === 'aberta' && (
                          <span className="size-1.5 rounded-full bg-warn" aria-label={t.atendimento.estados.aberta} />
                        )}
                        {c.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-line px-1.5 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
        {!loading && conversas?.length === 0 && (
          <li>
            <EmptyState title={t.atendimento.empty.title} description={t.atendimento.empty.hint} />
          </li>
        )}
      </ul>
    </div>
  )
}
