import type { Lancamento } from '@/features/financeiro'
import { daysFromNow } from '../util'
import { mockClientes } from './clientes'

const honorarios: Lancamento[] = mockClientes
  .filter((c) => c.status === 'ativo')
  .map((c, i) => {
    // vencimento no dia 10: parte paga, parte em aberto, duas vencidas
    const status: Lancamento['status'] = i % 4 === 3 ? 'vencido' : i % 3 === 0 ? 'emAberto' : 'pago'
    const dias = status === 'vencido' ? -12 : status === 'emAberto' ? 3 : -5
    return {
      id: `l-h-${c.id}`,
      tipo: 'receita',
      descricao: `Honorário ${c.nomeFantasia}`,
      clienteId: c.id,
      cliente: c.nomeFantasia,
      categoria: 'honorario',
      vencimento: daysFromNow(dias),
      valor: c.honorario,
      status,
    }
  })

const extras: Lancamento[] = [
  {
    id: 'l-x1',
    tipo: 'receita',
    descricao: 'Abertura de empresa — Brainrot',
    clienteId: 'c11',
    cliente: 'Brainrot',
    categoria: 'abertura',
    vencimento: daysFromNow(-15),
    valor: 1500,
    status: 'pago',
  },
  {
    id: 'l-x2',
    tipo: 'receita',
    descricao: 'Consultoria tributária — Verde Vale',
    clienteId: 'c13',
    cliente: 'Verde Vale',
    categoria: 'consultoria',
    vencimento: daysFromNow(6),
    valor: 4800,
    status: 'emAberto',
  },
  {
    id: 'l-x3',
    tipo: 'receita',
    descricao: 'Consultoria de enquadramento — Cutly',
    clienteId: 'c8',
    cliente: 'Cutly',
    categoria: 'consultoria',
    vencimento: daysFromNow(-40),
    valor: 2200,
    status: 'pago',
  },
  {
    id: 'l-d1',
    tipo: 'despesa',
    descricao: 'Domínio Sistemas (licença mensal)',
    clienteId: null,
    cliente: null,
    categoria: 'software',
    vencimento: daysFromNow(-3),
    valor: 1890,
    status: 'pago',
  },
  {
    id: 'l-d2',
    tipo: 'despesa',
    descricao: 'Aluguel da sala 1204',
    clienteId: null,
    cliente: null,
    categoria: 'aluguel',
    vencimento: daysFromNow(4),
    valor: 3200,
    status: 'emAberto',
  },
  {
    id: 'l-d3',
    tipo: 'despesa',
    descricao: 'Folha interna — outubro',
    clienteId: null,
    cliente: null,
    categoria: 'folha',
    vencimento: daysFromNow(-2),
    valor: 14600,
    status: 'pago',
  },
  {
    id: 'l-d4',
    tipo: 'despesa',
    descricao: 'Certificados digitais (lote)',
    clienteId: null,
    cliente: null,
    categoria: 'outros',
    vencimento: daysFromNow(9),
    valor: 640,
    status: 'emAberto',
  },
  {
    id: 'l-d5',
    tipo: 'despesa',
    descricao: 'Google Workspace',
    clienteId: null,
    cliente: null,
    categoria: 'software',
    vencimento: daysFromNow(-1),
    valor: 420,
    status: 'pago',
  },
]

export const mockLancamentos: Lancamento[] = [...honorarios, ...extras].sort((a, b) =>
  b.vencimento.localeCompare(a.vencimento),
)
