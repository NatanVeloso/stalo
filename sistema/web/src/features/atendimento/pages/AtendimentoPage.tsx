import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Card, Drawer } from '@/shared/ui'
import { useCanais, useContagem, useConversa, useConversas, useMarcarLida } from '../queries'
import type { ConversaEstado } from '../types'
import { ConversaList } from '../components/ConversaList'
import { ConversaView } from '../components/ConversaView'
import { ContatoPanel } from '../components/ContatoPanel'
import { useSomNovasConversas } from '../hooks/useSomRecebimento'

/**
 * Inbox do WhatsApp em três colunas: setores + conversas · conversa · contato.
 * No mobile mostra uma coluna por vez; abaixo de `xl` o painel do contato vira drawer.
 */
export function AtendimentoPage() {
  const t = useT()
  const [canalId, setCanalId] = useState('')
  const [estado, setEstado] = useState<ConversaEstado | ''>('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const debounced = useDebounce(search)
  const isXl = useMediaQuery('(min-width: 80rem)')

  const canais = useCanais()
  const contagem = useContagem()
  const lista = useConversas({ canalId, estado, search: debounced })
  const marcarLida = useMarcarLida()
  useSomNovasConversas(contagem.data?.naoLidas)

  const conversas = useMemo(() => lista.data?.pages.flatMap((p) => p.items), [lista.data])
  const naLista = conversas?.find((c) => c.id === selectedId)
  const detalhe = useConversa(selectedId, naLista)
  const conversa = detalhe.data ?? null
  const canal = canais.data?.find((c) => c.id === conversa?.canalId)

  // abrir a conversa zera as não lidas; e de novo se chegar mensagem com ela aberta
  const naoLidas = conversa?.naoLidas ?? 0
  const marcar = marcarLida.mutate
  useEffect(() => {
    if (conversa && naoLidas > 0) marcar(conversa.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só quando muda a conversa aberta ou as não lidas dela
  }, [conversa?.id, naoLidas])

  // o drawer só existe abaixo de xl: se a janela crescer com ele aberto, fecha (ajuste no render,
  // sem efeito, para não renderizar duas vezes)
  const [eraXl, setEraXl] = useState(isXl)
  if (eraXl !== isXl) {
    setEraXl(isXl)
    if (isXl) setPanelOpen(false)
  }

  return (
    <>
      {/*
        Ocupa a altura que sobra: 100dvh menos o respiro da casca (py-3 / md:py-4, dos dois lados),
        a Topbar (3.5rem) e o espaço entre Topbar e conteúdo, que muda com a densidade.
        O -mb-8 anula o pb-8 do <main>, que é fixo.
      */}
      <Card
        padding="none"
        className="animate-rise -mb-8 h-[calc(100dvh_-_5rem_-_var(--shell-gap))] overflow-hidden md:h-[calc(100dvh_-_5.5rem_-_var(--shell-gap))]"
      >
        <div className="grid h-full grid-cols-1 lg:grid-cols-[21rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)_18rem]">
          <aside className={cn('h-full min-h-0 border-line lg:border-r', selectedId && 'hidden lg:block')}>
            <ConversaList
              canais={{
                data: canais.data,
                loading: canais.isPending,
                error: canais.isError,
                onRetry: () => void canais.refetch(),
              }}
              conversas={{
                data: conversas,
                loading: lista.isPending,
                error: lista.isError,
                onRetry: () => void lista.refetch(),
                hasMore: lista.hasNextPage,
                loadingMore: lista.isFetchingNextPage,
                onLoadMore: () => void lista.fetchNextPage(),
              }}
              contagem={contagem.data}
              canalId={canalId}
              onCanal={setCanalId}
              estado={estado}
              onEstado={setEstado}
              search={search}
              onSearch={setSearch}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </aside>

          <section className={cn('h-full min-h-0', !selectedId && 'hidden lg:block')}>
            <ConversaView
              conversa={conversa}
              canal={canal}
              onBack={() => setSelectedId(null)}
              onOpenPanel={() => setPanelOpen(true)}
            />
          </section>

          <aside className={cn('hidden h-full min-h-0 border-l border-line xl:block', conversa && 'bg-bg-sunken')}>
            {conversa && isXl && <ContatoPanel conversa={conversa} canais={canais.data ?? []} />}
          </aside>
        </div>
      </Card>

      {/* abaixo de xl o painel do contato abre como drawer */}
      {conversa && !isXl && (
        <Drawer open={panelOpen} onClose={() => setPanelOpen(false)} title={t.atendimento.actions.openPanel}>
          <ContatoPanel conversa={conversa} canais={canais.data ?? []} />
        </Drawer>
      )}
    </>
  )
}
