/** Campos de auditoria que todo recurso da API traz (ISO). */
type Carimbo = { criadoEm: string; atualizadoEm: string }

/** Setor/fila de atendimento. Nome é dado (configurável pelo admin), não tradução. */
export type Canal = Carimbo & {
  id: string
  nome: string
  /** Atendentes na fila. */
  atendentes: number
}

/** Quem pode receber conversas (usuário interno com `atendimento:responder`). */
export type Atendente = Carimbo & {
  id: string
  nome: string
}

/** Mensagem pré-aprovada pela Meta. Nome e texto são dado (não se traduzem). */
export type Template = Carimbo & {
  id: string
  nome: string
  texto: string
}

export type ConversaEstado = 'aberta' | 'em_atendimento' | 'aguardando_cliente' | 'resolvida'

export type Conversa = Carimbo & {
  id: string
  contato: { nome: string; telefone: string }
  /** Preenchido quando o telefone é reconhecido como contato de um cliente. */
  clienteId: string | null
  cliente: string | null
  canalId: string
  estado: ConversaEstado
  atendenteId: string | null
  /** Nome do atendente, só para exibir (o back já manda junto para a lista não depender de outra chamada). */
  atendente: string | null
  ultimaMensagem: string
  ultimaEm: string
  naoLidas: number
  /** Fim da janela de 24 h desde a última mensagem do contato; `null` = contato nunca escreveu. */
  janelaExpiraEm: string | null
  etiquetas: string[]
}

/** Abertas (não resolvidas) no total e por canal, e não lidas no total: alimenta as abas e o som. */
export type ConversasContagem = {
  total: number
  porCanal: Record<string, number>
  naoLidas: number
}

export type MensagemDe = 'contato' | 'atendente' | 'sistema'
export type MensagemTipo = 'texto' | 'nota' | 'midia' | 'template'

/** Eventos que geram mensagem de sistema. O front monta o texto no idioma do usuário. */
export type MensagemEvento = 'atribuida' | 'transferida' | 'resolvida' | 'reaberta' | 'vinculada'

export type Mensagem = Carimbo & {
  id: string
  conversaId: string
  de: MensagemDe
  tipo: MensagemTipo
  /** Vazio em mensagem de sistema (o texto sai de `evento` + `dados`). */
  texto: string
  /** Nome do atendente (quando `de === 'atendente'`). */
  autor: string | null
  em: string
  /** Status de entrega do WhatsApp, só para mensagens enviadas pelo escritório. */
  status: 'enviada' | 'entregue' | 'lida' | null
  /** Nome do arquivo/mídia quando `tipo === 'midia'`. */
  midia: { nome: string; tamanho: string } | null
  /** Só em `de === 'sistema'`. */
  evento: MensagemEvento | null
  /** Valores do evento (nomes vindos da API, não traduzidos). */
  dados: { atendente?: string; canal?: string; cliente?: string } | null
  /** Quando `tipo === 'template'`. */
  templateId: string | null
}

export type ConversasFiltro = {
  canalId?: string | ''
  estado?: ConversaEstado | ''
  search?: string
}

/** `autor` só serve ao mock: o back sabe quem envia pelo token. */
export type EnviarMensagemInput = { conversaId: string; autor: string } & (
  { tipo: 'texto' | 'nota'; texto: string } | { tipo: 'template'; templateId: string }
)
