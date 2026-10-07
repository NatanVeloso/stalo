import type { Dictionary } from '../pt-BR'

export const clientes: Dictionary['clientes'] = {
  title: 'Clients',
  subtitle: '{n} companies served',
  new: 'New client',
  searchPlaceholder: 'Search by name or CNPJ',
  filters: { regime: 'Tax regime', status: 'Status', all: 'All' },
  columns: {
    empresa: 'Company',
    cnpj: 'CNPJ',
    regime: 'Regime',
    responsavel: 'Owner',
    honorario: 'Fee',
    status: 'Status',
    desde: 'Client since',
  },
  detail: {
    title: 'Client details',
    contato: 'Contact',
    email: 'Email',
    telefone: 'Phone',
    cidade: 'City',
    responsavel: 'Accountant in charge',
    honorario: 'Monthly fee',
    obrigacoesAbertas: 'Open obligations',
    documentos: 'Documents',
    ultimaEntrega: 'Last filing',
    openObrigacoes: 'View obligations',
  },
}
