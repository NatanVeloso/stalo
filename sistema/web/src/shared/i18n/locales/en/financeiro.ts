import type { Dictionary } from '../pt-BR'

export const financeiro: Dictionary['financeiro'] = {
  title: 'Finance',
  subtitle: "Fees, receipts and the firm's expenses.",
  new: 'New entry',
  kpis: {
    recebido: 'Received this month',
    aReceber: 'Receivable',
    vencido: 'Past due',
    despesas: 'Expenses this month',
  },
  tabs: { todos: 'All', receitas: 'Income', despesas: 'Expenses' },
  columns: {
    descricao: 'Description',
    cliente: 'Client',
    categoria: 'Category',
    vencimento: 'Due date',
    valor: 'Amount',
    status: 'Status',
  },
  tipos: { receita: 'Income', despesa: 'Expense' },
  categorias: {
    honorario: 'Monthly fee',
    abertura: 'Company formation',
    consultoria: 'Consulting',
    software: 'Software',
    aluguel: 'Rent',
    folha: 'Internal payroll',
    outros: 'Other',
  },
}
