/** Agregado (não é recurso): sem id nem datas de auditoria. */
export type ReceitaMes = { mes: string; valor: number }

/** Registro do log de atividade do escritório (recurso). */
export type Atividade = {
  id: string
  tipo: 'entrega' | 'documento' | 'cliente' | 'pagamento' | 'usuario'
  /** Quem fez; `null` quando o evento é do sistema (ex.: pagamento conciliado). */
  usuario: string | null
  /** Complemento do evento (obrigação entregue, documento anexado, usuário convidado...). */
  descricao: string
  cliente: string
  /** Instante do evento (ISO). */
  em: string
  criadoEm: string
  atualizadoEm: string
}

/** Agregado (não é recurso). */
export type DashboardResumo = {
  clientesAtivos: number
  clientesDelta: number
  obrigacoesAbertas: number
  obrigacoesDelta: number
  /** `null` para quem não tem `financeiro:ver` (o back omite o dado financeiro). */
  aReceber: number | null
  aReceberDelta: number | null
  vencendo7d: number
}
