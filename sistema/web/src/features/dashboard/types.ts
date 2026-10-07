export type ReceitaMes = { mes: string; valor: number }

export type Atividade = {
  id: string
  kind: 'entrega' | 'documento' | 'cliente' | 'pagamento' | 'usuario'
  user: string | null
  what: string
  client: string
  at: string
}

export type DashboardResumo = {
  clientesAtivos: number
  clientesDelta: number
  obrigacoesAbertas: number
  obrigacoesDelta: number
  aReceber: number
  aReceberDelta: number
  vencendo7d: number
}
