import type { Dictionary } from '../pt-BR'

export const obrigacoes: Dictionary['obrigacoes'] = {
  title: 'Obligaciones',
  subtitle: 'Entregas fiscales, contables y laborales por competencia.',
  new: 'Nueva obligación',
  tabs: { todas: 'Todas', pendentes: 'Pendientes', atrasadas: 'Atrasadas', entregues: 'Entregadas' },
  columns: {
    obrigacao: 'Obligación',
    cliente: 'Cliente',
    competencia: 'Competencia',
    vencimento: 'Vencimiento',
    responsavel: 'Responsable',
    status: 'Estado',
  },
  summary: { pendentes: '{n} pendientes', atrasadas: '{n} atrasadas', entregues: '{n} entregadas en el mes' },
  markDelivered: 'Marcar como entregada',
  tipos: {
    DAS: 'DAS',
    DCTF: 'DCTF',
    EFD: 'EFD Contribuciones',
    SPED: 'SPED Fiscal',
    GFIP: 'GFIP',
    ESOCIAL: 'eSocial',
    DEFIS: 'DEFIS',
    ECD: 'ECD',
    DIRF: 'DIRF',
    FOLHA: 'Nómina',
  },
}
