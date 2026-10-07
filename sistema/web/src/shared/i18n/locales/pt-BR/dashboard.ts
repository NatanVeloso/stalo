export const dashboard = {
  title: 'Visão geral',
  greeting: { morning: 'Bom dia, {name}', afternoon: 'Boa tarde, {name}', evening: 'Boa noite, {name}' },
  subtitle: 'Resumo do escritório hoje.',
  kpis: {
    clientes: 'Clientes ativos',
    obrigacoes: 'Obrigações em aberto',
    receber: 'Honorários a receber',
    vencendo: 'Vencendo em 7 dias',
    vsLastMonth: 'vs. mês anterior',
  },
  chart: {
    title: 'Honorários recebidos',
    subtitle: 'Últimos 12 meses',
    total: 'Total no período',
    table: 'Ver como tabela',
    chart: 'Ver como gráfico',
    month: 'Mês',
    value: 'Valor',
  },
  deadlines: {
    title: 'Próximos vencimentos',
    subtitle: 'Obrigações dos próximos 15 dias',
    empty: 'Nenhum vencimento próximo.',
  },
  activity: { title: 'Atividade recente', subtitle: 'O que a equipe fez por último' },
  activityKinds: {
    entrega: '{user} entregou {what} de {client}',
    documento: '{user} anexou {what} em {client}',
    cliente: '{user} cadastrou {client}',
    pagamento: '{client} pagou {what}',
    usuario: '{user} convidou {what}',
  },
}
