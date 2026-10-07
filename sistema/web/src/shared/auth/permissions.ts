/**
 * Perfis e permissões. Espelho do back (sistema/DOMINIO.md → Perfis): o front
 * só esconde e bloqueia rota; quem garante de verdade é a API.
 *
 * Permissão nova: adicione aqui e no back no mesmo PR.
 */
export const roles = ['admin', 'contador', 'assistente', 'cliente'] as const
export type Role = (typeof roles)[number]

const all: readonly Role[] = roles

export const permissions = {
  'dashboard:ver': all,
  'clientes:ver': ['admin', 'contador', 'assistente'],
  'clientes:editar': ['admin', 'contador'],
  'obrigacoes:ver': all,
  'obrigacoes:editar': ['admin', 'contador', 'assistente'],
  'financeiro:ver': ['admin', 'contador'],
  'financeiro:editar': ['admin'],
  'usuarios:gerenciar': ['admin'],
  'configuracoes:ver': all,
  'atendimento:ver': ['admin', 'contador', 'assistente'],
  'atendimento:responder': ['admin', 'contador', 'assistente'],
  'atendimento:gerenciar': ['admin'],
  'bancos:ver': ['admin', 'contador', 'cliente'],
  'bancos:vincular': ['admin', 'cliente'],
  'bancos:conciliar': ['admin', 'contador'],
} as const satisfies Record<string, readonly Role[]>

export type Permission = keyof typeof permissions

export function can(role: Role | null | undefined, permission: Permission) {
  if (!role) return false
  return (permissions[permission] as readonly Role[]).includes(role)
}
