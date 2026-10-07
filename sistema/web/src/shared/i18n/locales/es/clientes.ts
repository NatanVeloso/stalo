import type { Dictionary } from '../pt-BR'

export const clientes: Dictionary['clientes'] = {
  title: 'Clientes',
  subtitle: '{n} empresas atendidas',
  new: 'Nuevo cliente',
  searchPlaceholder: 'Buscar por nombre o CNPJ',
  filters: { regime: 'Régimen', status: 'Estado', all: 'Todos' },
  columns: {
    empresa: 'Empresa',
    cnpj: 'CNPJ',
    regime: 'Régimen',
    responsavel: 'Responsable',
    honorario: 'Honorario',
    status: 'Estado',
    desde: 'Cliente desde',
  },
  detail: {
    title: 'Detalles del cliente',
    contato: 'Contacto',
    email: 'Correo',
    telefone: 'Teléfono',
    cidade: 'Ciudad',
    responsavel: 'Contador responsable',
    honorario: 'Honorario mensual',
    obrigacoesAbertas: 'Obligaciones abiertas',
    documentos: 'Documentos',
    ultimaEntrega: 'Última entrega',
    openObrigacoes: 'Ver obligaciones',
  },
}
