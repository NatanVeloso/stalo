import type { Dictionary } from '../pt-BR'

export const obrigacoes: Dictionary['obrigacoes'] = {
  title: 'Obligations',
  subtitle: 'Tax, accounting and labor filings by period.',
  new: 'New obligation',
  tabs: { todas: 'All', pendentes: 'Pending', atrasadas: 'Overdue', entregues: 'Filed' },
  columns: {
    obrigacao: 'Obligation',
    cliente: 'Client',
    competencia: 'Period',
    vencimento: 'Due date',
    responsavel: 'Owner',
    status: 'Status',
  },
  summary: { pendentes: '{n} pending', atrasadas: '{n} overdue', entregues: '{n} filed this month' },
  markDelivered: 'Mark as filed',
  tipos: {
    DAS: 'DAS',
    DCTF: 'DCTF',
    EFD: 'EFD Contributions',
    SPED: 'SPED Fiscal',
    GFIP: 'GFIP',
    ESOCIAL: 'eSocial',
    DEFIS: 'DEFIS',
    ECD: 'ECD',
    DIRF: 'DIRF',
    FOLHA: 'Payroll',
  },
}
