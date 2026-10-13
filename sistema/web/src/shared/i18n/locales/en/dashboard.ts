import type { Dictionary } from '../pt-BR'

export const dashboard: Dictionary['dashboard'] = {
  title: 'Overview',
  greeting: { morning: 'Good morning, {name}', afternoon: 'Good afternoon, {name}', evening: 'Good evening, {name}' },
  subtitle: "Today's summary of the firm.",
  kpis: {
    clientes: 'Active clients',
    obrigacoes: 'Open obligations',
    receber: 'Fees receivable',
    vencendo: 'Due in 7 days',
    vsLastMonth: 'vs. last month',
    error: 'Could not load the indicators.',
  },
  chart: {
    title: 'Fees received',
    subtitle: 'Last 12 months',
    total: 'Period total',
    table: 'View as table',
    chart: 'View as chart',
    month: 'Month',
    value: 'Amount',
    label: '{title}. {subtitle}',
    empty: 'No fees received in this period.',
  },
  deadlines: {
    title: 'Upcoming deadlines',
    subtitle: 'Obligations due in the next 15 days',
    empty: 'No upcoming deadlines.',
  },
  activity: {
    title: 'Recent activity',
    subtitle: 'What the team did last',
    empty: 'No activity recorded yet.',
  },
  activityKinds: {
    entrega: '{usuario} filed {descricao} for {cliente}',
    documento: '{usuario} attached {descricao} to {cliente}',
    cliente: '{usuario} registered {cliente}',
    pagamento: '{cliente} paid {descricao}',
    usuario: '{usuario} invited {descricao}',
  },
}
