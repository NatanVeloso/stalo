/** Setor/fila de atendimento. Nome é dado (configurável pelo admin), não tradução. */
export type Canal = {
  id: string
  nome: string
  /** Atendentes na fila. */
  atendentes: number
}

export type ConversaEstado = 'aberta' | 'em_atendimento' | 'aguardando_cliente' | 'resolvida'

export type Conversa = {
  id: string
  contato: { nome: string; telefone: string }
  /** Preenchido quando o telefone é reconhecido como contato de um cliente. */
  clienteId: string | null
  cliente: string | null
  canalId: string
  estado: ConversaEstado
  atendente: string | null
  ultimaMensagem: string
  ultimaEm: string
  naoLidas: number
  /** Fim da janela de 24 h desde a última mensagem do contato; `null` = contato nunca escreveu. */
  janelaExpiraEm: string | null
  tags: string[]
}

export type MensagemDe = 'contato' | 'atendente' | 'sistema'
export type MensagemTipo = 'texto' | 'nota' | 'midia' | 'template'

export type Mensagem = {
  id: string
  conversaId: string
  de: MensagemDe
  tipo: MensagemTipo
  texto: string
  /** Nome do atendente (quando `de === 'atendente'`). */
  autor: string | null
  em: string
  /** Status de entrega do WhatsApp, só para mensagens enviadas pelo escritório. */
  status: 'enviada' | 'entregue' | 'lida' | null
  /** Nome do arquivo/mídia quando `tipo === 'midia'`. */
  midia: { nome: string; tamanho: string } | null
}

export type ConversasFiltro = {
  canalId?: string | ''
  estado?: ConversaEstado | ''
  search?: string
}

export type EnviarMensagemInput = { conversaId: string; texto: string; nota: boolean; autor: string }
