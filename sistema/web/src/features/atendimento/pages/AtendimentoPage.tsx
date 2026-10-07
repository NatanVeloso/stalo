import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { useT } from '@/shared/i18n'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Card, Drawer } from '@/shared/ui'
import { useCanais, useConversas, useMarcarLida } from '../queries'
import type { ConversaEstado } from '../types'
import { ConversaList } from '../components/ConversaList'
import { ConversaView } from '../components/ConversaView'
import { ContatoPanel } from '../components/ContatoPanel'

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

  const canais = useCanais()
  const todas = useConversas({})
  const lista = useConversas({ canalId, estado, search: debounced })
  const marcarLida = useMarcarLida()

  const conversa = todas.data?.find((c) => c.id === selectedId) ?? null
  const canal = canais.data?.find((c) => c.id === conversa?.canalId)

  const abertasPorCanal: Record<string, number> = {}
  todas.data?.forEach((c) => {
    if (c.estado !== 'resolvida') abertasPorCanal[c.canalId] = (abertasPorCanal[c.canalId] ?? 0) + 1
  })

  // abrir a conversa zera as não lidas
  useEffect(() => {
    if (conversa?.naoLidas) marcarLida.mutate(conversa.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só quando muda a conversa aberta
  }, [conversa?.id])

  return (
    <>
      <Card
        padding="none"
        className="animate-rise -mb-8 h-[calc(100dvh-6.25rem)] overflow-hidden md:h-[calc(100dvh-6.75rem)]"
      >
        <div className="grid h-full grid-cols-1 lg:grid-cols-[21rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)_18rem]">
          <aside className={cn('h-full min-h-0 border-line lg:border-r', selectedId && 'hidden lg:block')}>
            <ConversaList
              canais={canais.data ?? []}
              conversas={lista.data}
              loading={lista.isPending}
              canalId={canalId}
              onCanal={setCanalId}
              estado={estado}
              onEstado={setEstado}
              search={search}
              onSearch={setSearch}
              selectedId={selectedId}
              onSelect={setSelectedId}
              abertasPorCanal={abertasPorCanal}
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

          <aside className="hidden h-full min-h-0 border-l border-line xl:block">
            {conversa && <ContatoPanel conversa={conversa} canais={canais.data ?? []} />}
          </aside>
        </div>
      </Card>

      {/* abaixo de xl o painel do contato abre como drawer */}
      {conversa && (
        <Drawer open={panelOpen} onClose={() => setPanelOpen(false)} title={t.atendimento.actions.openPanel}>
          <ContatoPanel conversa={conversa} canais={canais.data ?? []} />
        </Drawer>
      )}
    </>
  )
}
