/**
 * Dados de demonstração. Só são usados quando VITE_API_URL está vazio (ver
 * shared/lib/env.ts). Quando o back existir, as `api.ts` das features param
 * de importar daqui e esta pasta some.
 */
export { fakeDelay, daysFromNow, monthsAgo, hoursFromNow } from './util'
export { mockUsers } from './data/usuarios'
export { mockClientes } from './data/clientes'
export { mockObrigacoes } from './data/obrigacoes'
export { mockLancamentos } from './data/financeiro'
export { mockAtividades, mockReceitaMensal } from './data/dashboard'
export { mockCanais, mockConversas, mockMensagens } from './data/atendimento'
