import { useT, fmt } from '@/shared/i18n'
import { Button, EmptyState, ErrorState, SearchInput, Segmented, Select, Skeleton } from '@/shared/ui'
import type { Canal, Conversa, ConversaEstado, ConversasContagem } from '../types'
import { ConversaItem } from './ConversaItem'
import { SomMenu } from './SomMenu'

type Estado<T> = { data: T | undefined; loading: boolean; error: boolean; onRetry: () => void }

type Props = {
  canais: Estado<Canal[]>
  conversas: Estado<Conversa[]> & { hasMore: boolean; loadingMore: boolean; onLoadMore: () => void }
  /** Abertas por setor (contadores das abas), vindas de `/conversas/contagem`. */
  contagem: ConversasContagem | undefined
  canalId: string
  onCanal: (id: string) => void
  estado: ConversaEstado | ''
  onEstado: (e: ConversaEstado | '') => void
  search: string
  onSearch: (s: string) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

/** Coluna da esquerda: setores, filtros e lista de conversas. */
export function ConversaList({
  canais,
  conversas,
  contagem,
  canalId,
  onCanal,
  estado,
  onEstado,
  search,
  onSearch,
  selectedId,
  onSelect,
}: Props) {
  const t = useT()
  const lista = conversas.data

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={onSearch}
            placeholder={t.atendimento.searchPlaceholder}
            className="min-w-0 flex-1"
          />
          <SomMenu />
        </div>
        {canais.loading ? (
          <Skeleton className="h-8 w-full rounded-full" />
        ) : canais.error ? (
          <ErrorState onRetry={canais.onRetry} className="py-4" />
        ) : (
          <Segmented
            size="sm"
            label={t.atendimento.setores}
            value={canalId}
            onChange={onCanal}
            className="max-w-full"
            options={[
              { value: '', label: t.atendimento.all, count: contagem?.total },
              ...(canais.data ?? []).map((c) => ({
                value: c.id,
                label: c.nome,
                count: contagem ? (contagem.porCanal[c.id] ?? 0) : undefined,
              })),
            ]}
          />
        )}
        <Select
          size="sm"
          aria-label={t.atendimento.filters.label}
          value={estado}
          onChange={(v) => onEstado(v as ConversaEstado | '')}
          options={[
            {
              value: '',
              label: fmt(t.atendimento.filters.all, { label: t.atendimento.filters.label, all: t.atendimento.all }),
            },
            ...(Object.keys(t.atendimento.estados) as ConversaEstado[]).map((e) => ({
              value: e,
              label: t.atendimento.estados[e],
            })),
          ]}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-line">
        {conversas.loading ? (
          <ul className="p-2" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex gap-3 px-3 py-(--list-y)">
                <Skeleton className="size-9 rounded-full" />
                <span className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-4/5" />
                </span>
              </li>
            ))}
          </ul>
        ) : conversas.error ? (
          <ErrorState onRetry={conversas.onRetry} />
        ) : !lista?.length ? (
          <EmptyState title={t.atendimento.empty.title} description={t.atendimento.empty.hint} />
        ) : (
          <>
            <ul className="p-2" aria-label={t.atendimento.title}>
              {lista.map((c) => (
                <ConversaItem
                  key={c.id}
                  conversa={c}
                  canalNome={canais.data?.find((k) => k.id === c.canalId)?.nome}
                  active={c.id === selectedId}
                  onSelect={() => onSelect(c.id)}
                />
              ))}
            </ul>
            {conversas.hasMore && (
              <div className="flex justify-center px-3 pb-3">
                <Button size="sm" variant="secondary" loading={conversas.loadingMore} onClick={conversas.onLoadMore}>
                  {t.atendimento.loadMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
