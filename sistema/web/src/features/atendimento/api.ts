import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import { fakeDelay, mockCanais, mockConversas, mockMensagens } from '@/mocks'
import type { Canal, Conversa, ConversasFiltro, EnviarMensagemInput, Mensagem } from './types'

/** Endpoints do atendimento (DOMINIO.md → fase 2). Em produção os eventos chegam por WebSocket. */
export const atendimentoApi = {
  async canais(): Promise<Canal[]> {
    if (!env.mock) return http.get('/atendimento/canais')
    await fakeDelay(300)
    return mockCanais
  },

  async conversas(f: ConversasFiltro = {}): Promise<Conversa[]> {
    if (!env.mock) {
      const qs = new URLSearchParams()
      if (f.canalId) qs.set('canal', f.canalId)
      if (f.estado) qs.set('estado', f.estado)
      if (f.search) qs.set('search', f.search)
      return http.get(`/atendimento/conversas?${qs}`)
    }
    await fakeDelay(350)
    const term = f.search?.trim().toLowerCase() ?? ''
    return mockConversas
      .filter(
        (c) =>
          (!f.canalId || c.canalId === f.canalId) &&
          (!f.estado || c.estado === f.estado) &&
          (!term ||
            c.contato.nome.toLowerCase().includes(term) ||
            c.cliente?.toLowerCase().includes(term) ||
            c.contato.telefone.includes(term)),
      )
      .sort((a, b) => b.ultimaEm.localeCompare(a.ultimaEm))
  },

  async mensagens(conversaId: string): Promise<Mensagem[]> {
    if (!env.mock) return http.get(`/atendimento/conversas/${conversaId}/mensagens`)
    await fakeDelay(300)
    return mockMensagens.filter((m) => m.conversaId === conversaId).sort((a, b) => a.em.localeCompare(b.em))
  },

  async enviar({ conversaId, texto, nota, autor }: EnviarMensagemInput): Promise<Mensagem> {
    if (!env.mock)
      return http.post(`/atendimento/conversas/${conversaId}/mensagens`, { tipo: nota ? 'nota' : 'texto', texto })
    await fakeDelay(400)
    const m: Mensagem = {
      id: `${conversaId}-m${Date.now()}`,
      conversaId,
      de: 'atendente',
      tipo: nota ? 'nota' : 'texto',
      texto,
      autor,
      em: new Date().toISOString(),
      status: nota ? null : 'enviada',
      midia: null,
    }
    mockMensagens.push(m)
    const c = mockConversas.find((c) => c.id === conversaId)
    if (c && !nota) {
      c.ultimaMensagem = texto
      c.ultimaEm = m.em
      c.naoLidas = 0
      if (c.estado === 'aberta' || c.estado === 'resolvida') c.estado = 'em_atendimento'
      if (c.estado === 'em_atendimento') c.estado = 'aguardando_cliente'
      c.atendente ??= autor
    }
    return m
  },

  async atribuir(conversaId: string, atendente: string): Promise<Conversa> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/atribuir`, { atendente })
    await fakeDelay(300)
    const c = mockConversas.find((c) => c.id === conversaId)!
    c.atendente = atendente
    if (c.estado === 'aberta') c.estado = 'em_atendimento'
    mockMensagens.push(sistema(conversaId, `Conversa atribuída a ${atendente}`))
    return { ...c }
  },

  async resolver(conversaId: string, autor: string): Promise<Conversa> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/resolver`)
    await fakeDelay(300)
    const c = mockConversas.find((c) => c.id === conversaId)!
    c.estado = 'resolvida'
    c.naoLidas = 0
    mockMensagens.push(sistema(conversaId, `Conversa resolvida por ${autor}`))
    return { ...c }
  },

  async marcarLida(conversaId: string): Promise<void> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/lida`)
    const c = mockConversas.find((c) => c.id === conversaId)
    if (c) c.naoLidas = 0
  },
}

function sistema(conversaId: string, texto: string): Mensagem {
  return {
    id: `${conversaId}-s${Date.now()}`,
    conversaId,
    de: 'sistema',
    tipo: 'texto',
    texto,
    autor: null,
    em: new Date().toISOString(),
    status: null,
    midia: null,
  }
}
