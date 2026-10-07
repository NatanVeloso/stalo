import type { Atividade, ReceitaMes } from '@/features/dashboard'
import { hoursFromNow, monthsAgo } from '../util'

const valores = [31200, 32800, 30950, 34100, 35600, 33900, 36400, 37250, 36800, 38900, 39600, 41250]

/** Do mais antigo (11 meses atrás) ao mês atual. */
export const mockReceitaMensal: ReceitaMes[] = valores.map((valor, i) => ({ mes: monthsAgo(11 - i), valor }))

export const mockAtividades: Atividade[] = [
  { id: 'a1', kind: 'entrega', user: 'Walex Mateus', what: 'DAS 09/2026', client: 'Cutly', at: hoursFromNow(-0.4) },
  { id: 'a2', kind: 'pagamento', user: null, what: 'honorário de outubro', client: 'Lissen', at: hoursFromNow(-2) },
  {
    id: 'a3',
    kind: 'documento',
    user: 'Júlia Ramos',
    what: 'extratos bancários',
    client: 'Café Idiomas',
    at: hoursFromNow(-3.5),
  },
  { id: 'a4', kind: 'entrega', user: 'Emanoel Oliveira', what: 'eSocial', client: 'Verde Vale', at: hoursFromNow(-6) },
  { id: 'a5', kind: 'cliente', user: 'Ana Souza', what: '', client: 'Brainrot', at: hoursFromNow(-26) },
  { id: 'a6', kind: 'usuario', user: 'Ana Souza', what: 'Rafael Nunes', client: '', at: hoursFromNow(-30) },
  {
    id: 'a7',
    kind: 'entrega',
    user: 'Walex Mateus',
    what: 'folha de setembro',
    client: 'Supriloc',
    at: hoursFromNow(-50),
  },
]
