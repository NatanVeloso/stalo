import type { Dictionary } from '../pt-BR'

export const financeiro: Dictionary['financeiro'] = {
  title: 'Finanzas',
  subtitle: 'Honorarios, cobros y gastos de la oficina.',
  new: 'Nuevo registro',
  kpis: { recebido: 'Recibido en el mes', aReceber: 'Por cobrar', vencido: 'Vencido', despesas: 'Gastos del mes' },
  tabs: { todos: 'Todos', receitas: 'Ingresos', despesas: 'Gastos' },
  columns: {
    descricao: 'Descripción',
    cliente: 'Cliente',
    categoria: 'Categoría',
    vencimento: 'Vencimiento',
    valor: 'Valor',
    status: 'Estado',
  },
  tipos: { receita: 'Ingreso', despesa: 'Gasto' },
  categorias: {
    honorario: 'Honorario mensual',
    abertura: 'Apertura de empresa',
    consultoria: 'Consultoría',
    software: 'Software',
    aluguel: 'Alquiler',
    folha: 'Nómina interna',
    outros: 'Otros',
  },
}
