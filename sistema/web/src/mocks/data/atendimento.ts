import type { Canal, Conversa, Mensagem } from '@/features/atendimento'
import { hoursFromNow } from '../util'

export const mockCanais: Canal[] = [
  { id: 'fiscal', nome: 'Fiscal', atendentes: 2 },
  { id: 'dp', nome: 'Departamento Pessoal', atendentes: 1 },
  { id: 'financeiro', nome: 'Financeiro', atendentes: 1 },
  { id: 'comercial', nome: 'Comercial', atendentes: 1 },
]

type Seed = {
  id: string
  nome: string
  telefone: string
  clienteId: string | null
  cliente: string | null
  canalId: string
  estado: Conversa['estado']
  atendente: string | null
  tags?: string[]
  /** [de, texto, horas atrás, tipo?] — a última do contato define a janela de 24 h. */
  msgs: Array<[Mensagem['de'], string, number, Mensagem['tipo']?]>
}

const seeds: Seed[] = [
  {
    id: 'cv1',
    nome: 'Rafael Nunes',
    telefone: '+55 62 99888-1100',
    clienteId: 'c1',
    cliente: 'Supriloc',
    canalId: 'fiscal',
    estado: 'em_atendimento',
    atendente: 'Walex Mateus',
    tags: ['urgente'],
    msgs: [
      ['contato', 'Bom dia! Recebi uma notificação da Receita sobre a DCTF de agosto. Vocês podem verificar?', -3.2],
      ['atendente', 'Bom dia, Rafael! Vou conferir o protocolo de entrega e já te retorno.', -3.0],
      ['sistema', 'Conversa atribuída a Walex Mateus', -3.0],
      [
        'atendente',
        'Nota: protocolo 2026-08-DCTF-0912 consta como entregue em 14/09. Notificação parece ser de retificação.',
        -2.8,
        'nota',
      ],
      ['contato', 'Consegui o número da notificação aqui: 0045.2026.1192', -0.4],
      ['contato', 'Segue o PDF', -0.38, 'midia'],
    ],
  },
  {
    id: 'cv2',
    nome: 'Marina Costa',
    telefone: '+55 11 97777-2020',
    clienteId: 'c2',
    cliente: 'Lissen',
    canalId: 'dp',
    estado: 'aberta',
    atendente: null,
    msgs: [
      [
        'contato',
        'Oi, preciso incluir dois funcionários novos na folha de outubro. Qual o prazo para mandar os documentos?',
        -1.1,
      ],
      ['contato', 'Um deles é estagiário, muda alguma coisa?', -1.0],
    ],
  },
  {
    id: 'cv3',
    nome: 'Carla Mendes',
    telefone: '+55 62 98111-2233',
    clienteId: 'c4',
    cliente: 'T-Shirt White',
    canalId: 'financeiro',
    estado: 'aguardando_cliente',
    atendente: 'Ana Souza',
    msgs: [
      ['contato', 'Boa tarde, o boleto do honorário de outubro veio com valor diferente do mês passado.', -26],
      [
        'atendente',
        'Boa tarde, Carla! O valor inclui a consultoria de enquadramento que fizemos em setembro (R$ 350). Te mando o detalhamento por aqui.',
        -25.5,
      ],
      ['atendente', 'Detalhamento_honorario_out.pdf', -25.4, 'midia'],
      ['atendente', 'Qualquer dúvida é só chamar!', -25.4],
    ],
  },
  {
    id: 'cv4',
    nome: 'João Pedro Alves',
    telefone: '+55 64 99123-4567',
    clienteId: null,
    cliente: null,
    canalId: 'comercial',
    estado: 'aberta',
    atendente: null,
    tags: ['lead'],
    msgs: [
      [
        'contato',
        'Olá! Vi o site de vocês. Tenho uma transportadora em Rio Verde e quero trocar de contador. Como funciona a migração?',
        -0.2,
      ],
    ],
  },
  {
    id: 'cv5',
    nome: 'Vera Lúcia',
    telefone: '+55 62 99222-3344',
    clienteId: 'c7',
    cliente: 'Pão da Vera',
    canalId: 'fiscal',
    estado: 'em_atendimento',
    atendente: 'Júlia Ramos',
    msgs: [
      ['contato', 'Júlia, o DAS desse mês já saiu?', -5],
      ['atendente', 'Saiu sim, Vera! Vence dia 20. Vou mandar a guia aqui.', -4.8],
      ['atendente', 'DAS_10-2026_PaoDaVera.pdf', -4.7, 'midia'],
      ['contato', 'Obrigada! Pago hoje ainda.', -4.5],
    ],
  },
  {
    id: 'cv6',
    nome: 'Fernanda Ribeiro',
    telefone: '+55 61 98765-0001',
    clienteId: 'c9',
    cliente: 'Navcare',
    canalId: 'dp',
    estado: 'em_atendimento',
    atendente: 'Emanoel Oliveira',
    tags: ['rescisão'],
    msgs: [
      [
        'contato',
        'Emanoel, vamos desligar a Patrícia (CLT, 3 anos de casa) no dia 15. Preciso da simulação da rescisão.',
        -8,
      ],
      ['atendente', 'Certo, Fernanda. Aviso prévio trabalhado ou indenizado?', -7.5],
      ['contato', 'Indenizado.', -7.4],
      [
        'atendente',
        'Nota: pedir ao Pedro a ficha financeira da Patrícia para calcular médias de variáveis.',
        -7.3,
        'nota',
      ],
      ['atendente', 'Perfeito. Te mando a simulação até amanhã de manhã.', -7.2],
    ],
  },
  {
    id: 'cv7',
    nome: 'Lucas Ferreira',
    telefone: '+55 62 99555-4433',
    clienteId: 'c11',
    cliente: 'Brainrot',
    canalId: 'financeiro',
    estado: 'resolvida',
    atendente: 'Ana Souza',
    msgs: [
      ['contato', 'Conseguem mandar a 2ª via do boleto de setembro?', -50],
      ['atendente', 'Claro! Segue.', -49.8],
      ['atendente', 'Boleto_09-2026_Brainrot.pdf', -49.7, 'midia'],
      ['contato', 'Valeu!', -49.5],
      ['sistema', 'Conversa resolvida por Ana Souza', -49],
    ],
  },
  {
    id: 'cv8',
    nome: 'Roberto Carvalho',
    telefone: '+55 62 3444-2211',
    clienteId: 'c12',
    cliente: 'Horizonte',
    canalId: 'fiscal',
    estado: 'aberta',
    atendente: null,
    tags: ['atrasada'],
    msgs: [
      [
        'atendente',
        'Olá, Roberto. A GFIP de setembro da Horizonte está pendente de documentos. Pode nos enviar os recibos de frete até sexta?',
        -30,
        'template',
      ],
      ['contato', 'Oi, desculpa a demora. Mando ainda hoje.', -2.5],
    ],
  },
  {
    id: 'cv9',
    nome: 'Patrícia Gomes',
    telefone: '+55 62 99000-7788',
    clienteId: 'c5',
    cliente: 'Café Idiomas',
    canalId: 'comercial',
    estado: 'aguardando_cliente',
    atendente: 'Ana Souza',
    msgs: [
      ['contato', 'Ana, vamos abrir uma segunda unidade. Vocês fazem a abertura da filial?', -28],
      ['atendente', 'Fazemos sim! Te mandei a proposta por e-mail. Qualquer dúvida é só chamar.', -27],
    ],
  },
  {
    id: 'cv10',
    nome: 'Diego Santos',
    telefone: '+55 64 3611-0000',
    clienteId: 'c13',
    cliente: 'Verde Vale',
    canalId: 'fiscal',
    estado: 'em_atendimento',
    atendente: 'Walex Mateus',
    msgs: [
      ['contato', 'Walex, o SPED de setembro fechou? O auditor pediu o recibo.', -1.6],
      ['atendente', 'Fechou ontem. Recibo em anexo.', -1.5],
      ['atendente', 'Recibo_SPED_09-2026.pdf', -1.5, 'midia'],
    ],
  },
]

export const mockMensagens: Mensagem[] = []

export const mockConversas: Conversa[] = seeds.map((s) => {
  const msgs = s.msgs.map(([de, texto, h, tipo = 'texto'], i): Mensagem => ({
    id: `${s.id}-m${i + 1}`,
    conversaId: s.id,
    de,
    tipo,
    texto: tipo === 'midia' ? '' : texto,
    autor: de === 'atendente' ? (s.atendente ?? 'Ana Souza') : null,
    em: hoursFromNow(h),
    status: de === 'atendente' && tipo !== 'nota' ? (h < -24 ? 'lida' : 'entregue') : null,
    midia: tipo === 'midia' ? { nome: texto, tamanho: `${(120 + i * 37) % 900} KB` } : null,
  }))
  mockMensagens.push(...msgs)
  const ultima = msgs[msgs.length - 1]!
  const ultimaDoContato = [...msgs].reverse().find((m) => m.de === 'contato')
  // não lidas = mensagens do contato depois da última resposta do escritório
  let ultimaResposta = -1
  msgs.forEach((m, i) => {
    if (m.de === 'atendente') ultimaResposta = i
  })
  const naoLidas = s.estado === 'resolvida' ? 0 : msgs.filter((m, i) => m.de === 'contato' && i > ultimaResposta).length
  return {
    id: s.id,
    contato: { nome: s.nome, telefone: s.telefone },
    clienteId: s.clienteId,
    cliente: s.cliente,
    canalId: s.canalId,
    estado: s.estado,
    atendente: s.atendente,
    ultimaMensagem: ultima.tipo === 'midia' ? `📎 ${ultima.midia?.nome}` : ultima.texto,
    ultimaEm: ultima.em,
    naoLidas,
    janelaExpiraEm: ultimaDoContato
      ? new Date(new Date(ultimaDoContato.em).getTime() + 24 * 3_600_000).toISOString()
      : null,
    tags: s.tags ?? [],
  }
})
