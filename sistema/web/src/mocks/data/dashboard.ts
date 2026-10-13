import type { Atividade, ReceitaMes } from '@/features/dashboard'
import { hoursFromNow, monthsAgo } from '../util'

const valores = [31200, 32800, 30950, 34100, 35600, 33900, 36400, 37250, 36800, 38900, 39600, 41250]

/** Do mais antigo (11 meses atrás) ao mês atual. */
export const mockReceitaMensal: ReceitaMes[] = valores.map((valor, i) => ({ mes: monthsAgo(11 - i), valor }))

type Seed = [tipo: Atividade['tipo'], usuario: string | null, descricao: string, cliente: string, horasAtras: number]

const seeds: Seed[] = [
  ['entrega', 'Walex Mateus', 'DAS 09/2026', 'Cutly', 0.4],
  ['pagamento', null, 'honorário de outubro', 'Lissen', 2],
  ['documento', 'Júlia Ramos', 'extratos bancários', 'Café Idiomas', 3.5],
  ['entrega', 'Emanoel Oliveira', 'eSocial', 'Verde Vale', 6],
  ['cliente', 'Ana Souza', '', 'Brainrot', 26],
  ['usuario', 'Ana Souza', 'Rafael Nunes', '', 30],
  ['entrega', 'Walex Mateus', 'folha de setembro', 'Supriloc', 50],
]

// log é imutável: criado e atualizado no mesmo instante do evento
export const mockAtividades: Atividade[] = seeds.map(([tipo, usuario, descricao, cliente, horas], i) => {
  const em = hoursFromNow(-horas)
  return { id: `a${i + 1}`, tipo, usuario, descricao, cliente, em, criadoEm: em, atualizadoEm: em }
})
