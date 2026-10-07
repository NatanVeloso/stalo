import { env } from '@/shared/lib/env'
import { http } from '@/shared/lib/http'
import { daysUntil } from '@/shared/lib/format'
import { fakeDelay, mockAtividades, mockClientes, mockLancamentos, mockObrigacoes, mockReceitaMensal } from '@/mocks'
import type { Obrigacao } from '@/features/obrigacoes'
import type { Atividade, DashboardResumo, ReceitaMes } from './types'

/** Endpoints do dashboard. Assinaturas ficam iguais quando o mock sair. */
export const dashboardApi = {
  async resumo(): Promise<DashboardResumo> {
    if (!env.mock) return http.get('/dashboard/resumo')
    await fakeDelay(500)
    const abertas = mockObrigacoes.filter((o) => o.status !== 'entregue')
    return {
      clientesAtivos: mockClientes.filter((c) => c.status === 'ativo').length,
      clientesDelta: 8.3,
      obrigacoesAbertas: abertas.length,
      obrigacoesDelta: -12.5,
      aReceber: mockLancamentos
        .filter((l) => l.tipo === 'receita' && l.status !== 'pago')
        .reduce((s, l) => s + l.valor, 0),
      aReceberDelta: 4.1,
      vencendo7d: abertas.filter((o) => daysUntil(o.vencimento) >= 0 && daysUntil(o.vencimento) <= 7).length,
    }
  },

  async receitaMensal(): Promise<ReceitaMes[]> {
    if (!env.mock) return http.get('/dashboard/receita-mensal')
    await fakeDelay(700)
    return mockReceitaMensal
  },

  async proximosVencimentos(): Promise<Obrigacao[]> {
    if (!env.mock) return http.get('/dashboard/vencimentos')
    await fakeDelay(450)
    return mockObrigacoes
      .filter((o) => o.status !== 'entregue' && daysUntil(o.vencimento) <= 15)
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
      .slice(0, 8)
  },

  async atividades(): Promise<Atividade[]> {
    if (!env.mock) return http.get('/dashboard/atividades')
    await fakeDelay(650)
    return mockAtividades
  },
}
