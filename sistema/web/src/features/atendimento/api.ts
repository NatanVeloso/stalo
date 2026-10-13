import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import type { Paginated } from '@/shared/types/api'
import { fakeDelay, mockCanais, mockConversas, mockMensagens, paginate, mockAtendentes, mockTemplates } from '@/mocks'
import type {
  Atendente,
  Canal,
  Conversa,
  ConversasContagem,
  ConversasFiltro,
  EnviarMensagemInput,
  Mensagem,
  MensagemEvento,
  Template,
} from './types'

export type Pagina = { page: number; pageSize: number }

/** Endpoints do atendimento (DOMINIO.md → fase 2). Em produção os eventos chegam por WebSocket. */
export const atendimentoApi = {
  async canais(): Promise<Canal[]> {
    if (!env.mock) return http.get('/atendimento/canais')
    await fakeDelay(300)
    return mockCanais
  },

  async atendentes(): Promise<Atendente[]> {
    if (!env.mock) return http.get('/atendimento/atendentes')
    await fakeDelay(250)
    return mockAtendentes
  },

  async templates(): Promise<Template[]> {
    if (!env.mock) return http.get('/atendimento/templates')
    await fakeDelay(250)
    return mockTemplates
  },

  async conversas(f: ConversasFiltro & Pagina): Promise<Paginated<Conversa>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(f.page), pageSize: String(f.pageSize) })
      if (f.canalId) qs.set('canal', f.canalId)
      if (f.estado) qs.set('estado', f.estado)
      if (f.search) qs.set('search', f.search)
      return http.get(`/atendimento/conversas?${qs}`)
    }
    await fakeDelay(350)
    const term = f.search?.trim().toLowerCase() ?? ''
    const rows = mockConversas
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
      .map((c) => ({ ...c }))
    return paginate(rows, f.page, f.pageSize)
  },

  /** Uma conversa: a aberta continua na tela mesmo quando sai do filtro da lista. */
  async conversa(id: string): Promise<Conversa> {
    if (!env.mock) return http.get(`/atendimento/conversas/${id}`)
    await fakeDelay(200)
    return { ...conversaMock(id) }
  },

  async contagem(): Promise<ConversasContagem> {
    if (!env.mock) return http.get('/atendimento/conversas/contagem')
    await fakeDelay(200)
    const porCanal: Record<string, number> = {}
    let total = 0
    let naoLidas = 0
    mockConversas.forEach((c) => {
      naoLidas += c.naoLidas
      if (c.estado === 'resolvida') return
      total++
      porCanal[c.canalId] = (porCanal[c.canalId] ?? 0) + 1
    })
    return { total, porCanal, naoLidas }
  },

  /** Mais recentes primeiro (contrato); quem exibe inverte para a ordem cronológica. */
  async mensagens(conversaId: string, p: Pagina): Promise<Paginated<Mensagem>> {
    if (!env.mock) {
      const qs = new URLSearchParams({ page: String(p.page), pageSize: String(p.pageSize) })
      return http.get(`/atendimento/conversas/${conversaId}/mensagens?${qs}`)
    }
    await fakeDelay(300)
    const rows = mockMensagens.filter((m) => m.conversaId === conversaId).sort((a, b) => b.em.localeCompare(a.em))
    return paginate(rows, p.page, p.pageSize)
  },

  async enviar(input: EnviarMensagemInput): Promise<Mensagem> {
    const { conversaId, autor } = input
    const corpo =
      input.tipo === 'template'
        ? { tipo: 'template' as const, templateId: input.templateId }
        : { tipo: input.tipo, texto: input.texto }
    if (!env.mock) return http.post(`/atendimento/conversas/${conversaId}/mensagens`, corpo)
    await fakeDelay(400)
    const nota = input.tipo === 'nota'
    const texto =
      input.tipo === 'template' ? (mockTemplates.find((tp) => tp.id === input.templateId)?.texto ?? '') : input.texto
    const em = new Date().toISOString()
    const m: Mensagem = {
      id: `${conversaId}-m${Date.now()}`,
      conversaId,
      de: 'atendente',
      tipo: input.tipo,
      texto,
      autor,
      em,
      status: nota ? null : 'enviada',
      midia: null,
      evento: null,
      dados: null,
      templateId: input.tipo === 'template' ? input.templateId : null,
      criadoEm: em,
      atualizadoEm: em,
    }
    mockMensagens.push(m)
    const c = mockConversas.find((c) => c.id === conversaId)
    if (c && !nota) {
      c.ultimaMensagem = texto
      c.ultimaEm = em
      c.atualizadoEm = em
      c.naoLidas = 0
      if (c.estado === 'aberta' || c.estado === 'resolvida') c.estado = 'em_atendimento'
      if (c.estado === 'em_atendimento') c.estado = 'aguardando_cliente'
      if (!c.atendenteId) {
        const a = mockAtendentes.find((a) => a.nome === autor)
        c.atendenteId = a?.id ?? null
        c.atendente = a?.nome ?? null
      }
    }
    return m
  },

  /** `atendenteId: null` tira o atendente (a conversa volta para a fila). */
  async atribuir(conversaId: string, atendenteId: string | null): Promise<Conversa> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/atribuir`, { atendenteId })
    await fakeDelay(300)
    const c = conversaMock(conversaId)
    const a = mockAtendentes.find((a) => a.id === atendenteId) ?? null
    c.atendenteId = a?.id ?? null
    c.atendente = a?.nome ?? null
    c.atualizadoEm = new Date().toISOString()
    if (a && c.estado === 'aberta') c.estado = 'em_atendimento'
    if (!a && c.estado === 'em_atendimento') c.estado = 'aberta'
    if (a) mockMensagens.push(sistema(conversaId, 'atribuida', { atendente: a.nome }))
    return { ...c }
  },

  async transferir(conversaId: string, canalId: string): Promise<Conversa> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/transferir`, { canalId })
    await fakeDelay(300)
    const c = conversaMock(conversaId)
    c.canalId = canalId
    c.atualizadoEm = new Date().toISOString()
    const canal = mockCanais.find((k) => k.id === canalId)
    mockMensagens.push(sistema(conversaId, 'transferida', { canal: canal?.nome ?? canalId }))
    return { ...c }
  },

  /** `autor` só serve ao mock (o back sabe pelo token). */
  async resolver(conversaId: string, autor: string): Promise<Conversa> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/resolver`)
    await fakeDelay(300)
    const c = conversaMock(conversaId)
    c.estado = 'resolvida'
    c.naoLidas = 0
    c.atualizadoEm = new Date().toISOString()
    mockMensagens.push(sistema(conversaId, 'resolvida', { atendente: autor }))
    return { ...c }
  },

  async marcarLida(conversaId: string): Promise<void> {
    if (!env.mock) return http.patch(`/atendimento/conversas/${conversaId}/lida`)
    const c = mockConversas.find((c) => c.id === conversaId)
    if (c) c.naoLidas = 0
  },
}

function conversaMock(id: string) {
  const c = mockConversas.find((c) => c.id === id)
  if (!c) throw new Error('not_found')
  return c
}

function sistema(conversaId: string, evento: MensagemEvento, dados: NonNullable<Mensagem['dados']>): Mensagem {
  const em = new Date().toISOString()
  return {
    id: `${conversaId}-s${Date.now()}`,
    conversaId,
    de: 'sistema',
    tipo: 'texto',
    texto: '',
    autor: null,
    em,
    status: null,
    midia: null,
    evento,
    dados,
    templateId: null,
    criadoEm: em,
    atualizadoEm: em,
  }
}
