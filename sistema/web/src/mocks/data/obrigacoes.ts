import type { Obrigacao, TipoObrigacao } from '@/features/obrigacoes'
import { daysFromNow } from '../util'
import { mockClientes } from './clientes'

type Seed = [
  tipo: TipoObrigacao,
  clienteId: string,
  diasAteVencer: number,
  status: Obrigacao['status'],
  responsavel: string,
]

/** Competência = mês anterior ao vencimento, no formato YYYY-MM. */
function competencia(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 7)
}

const seeds: Seed[] = [
  ['DAS', 'c4', 2, 'pendente', 'Júlia Ramos'],
  ['DAS', 'c5', 2, 'pendente', 'Júlia Ramos'],
  ['DAS', 'c8', 2, 'entregue', 'Walex Mateus'],
  ['DAS', 'c11', 2, 'pendente', 'Júlia Ramos'],
  ['DAS', 'c7', 2, 'pendente', 'Júlia Ramos'],
  ['ESOCIAL', 'c2', 3, 'pendente', 'Emanoel Oliveira'],
  ['ESOCIAL', 'c9', 3, 'pendente', 'Emanoel Oliveira'],
  ['ESOCIAL', 'c13', 3, 'entregue', 'Walex Mateus'],
  ['FOLHA', 'c1', -2, 'atrasada', 'Walex Mateus'],
  ['FOLHA', 'c6', -1, 'atrasada', 'Emanoel Oliveira'],
  ['FOLHA', 'c3', 1, 'pendente', 'Walex Mateus'],
  ['DCTF', 'c2', 8, 'pendente', 'Emanoel Oliveira'],
  ['DCTF', 'c9', 8, 'pendente', 'Emanoel Oliveira'],
  ['DCTF', 'c13', 8, 'pendente', 'Walex Mateus'],
  ['DCTF', 'c12', 8, 'pendente', 'Emanoel Oliveira'],
  ['EFD', 'c1', 10, 'pendente', 'Walex Mateus'],
  ['EFD', 'c3', 10, 'pendente', 'Walex Mateus'],
  ['EFD', 'c6', 10, 'pendente', 'Emanoel Oliveira'],
  ['SPED', 'c2', 13, 'pendente', 'Emanoel Oliveira'],
  ['SPED', 'c13', 13, 'pendente', 'Walex Mateus'],
  ['SPED', 'c9', 13, 'pendente', 'Emanoel Oliveira'],
  ['GFIP', 'c12', -6, 'atrasada', 'Emanoel Oliveira'],
  ['GFIP', 'c6', -6, 'entregue', 'Emanoel Oliveira'],
  ['DAS', 'c4', -28, 'entregue', 'Júlia Ramos'],
  ['DAS', 'c5', -28, 'entregue', 'Júlia Ramos'],
  ['DAS', 'c8', -28, 'entregue', 'Walex Mateus'],
  ['FOLHA', 'c1', -32, 'entregue', 'Walex Mateus'],
  ['FOLHA', 'c9', -32, 'entregue', 'Emanoel Oliveira'],
  ['DCTF', 'c2', -22, 'entregue', 'Emanoel Oliveira'],
  ['EFD', 'c13', -20, 'entregue', 'Walex Mateus'],
  ['DEFIS', 'c11', 24, 'pendente', 'Júlia Ramos'],
  ['ECD', 'c9', 40, 'pendente', 'Emanoel Oliveira'],
  ['DIRF', 'c1', 52, 'pendente', 'Walex Mateus'],
]

export const mockObrigacoes: Obrigacao[] = seeds.map(([tipo, clienteId, dias, status, responsavel], i) => {
  const vencimento = daysFromNow(dias)
  const cliente = mockClientes.find((c) => c.id === clienteId)
  return {
    id: `o${i + 1}`,
    tipo,
    clienteId,
    cliente: cliente?.nomeFantasia ?? clienteId,
    competencia: competencia(vencimento),
    vencimento,
    responsavel,
    status,
    entregueEm: status === 'entregue' ? daysFromNow(dias - 1) : null,
  }
})
