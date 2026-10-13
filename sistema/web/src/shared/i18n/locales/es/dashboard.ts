import type { Dictionary } from '../pt-BR'

export const dashboard: Dictionary['dashboard'] = {
  title: 'Visión general',
  greeting: { morning: 'Buenos días, {name}', afternoon: 'Buenas tardes, {name}', evening: 'Buenas noches, {name}' },
  subtitle: 'Resumen de la oficina hoy.',
  kpis: {
    clientes: 'Clientes activos',
    obrigacoes: 'Obligaciones abiertas',
    receber: 'Honorarios por cobrar',
    vencendo: 'Vencen en 7 días',
    vsLastMonth: 'vs. mes anterior',
    error: 'No se pudieron cargar los indicadores.',
  },
  chart: {
    title: 'Honorarios recibidos',
    subtitle: 'Últimos 12 meses',
    total: 'Total del período',
    table: 'Ver como tabla',
    chart: 'Ver como gráfico',
    month: 'Mes',
    value: 'Valor',
    label: '{title}. {subtitle}',
    empty: 'Ningún honorario recibido en el período.',
  },
  deadlines: {
    title: 'Próximos vencimientos',
    subtitle: 'Obligaciones de los próximos 15 días',
    empty: 'Sin vencimientos próximos.',
  },
  activity: {
    title: 'Actividad reciente',
    subtitle: 'Lo último que hizo el equipo',
    empty: 'Todavía no hay actividad registrada.',
  },
  activityKinds: {
    entrega: '{usuario} entregó {descricao} de {cliente}',
    documento: '{usuario} adjuntó {descricao} en {cliente}',
    cliente: '{usuario} registró {cliente}',
    pagamento: '{cliente} pagó {descricao}',
    usuario: '{usuario} invitó a {descricao}',
  },
}
