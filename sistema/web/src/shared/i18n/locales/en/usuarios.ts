import type { Dictionary } from '../pt-BR'

export const usuarios: Dictionary['usuarios'] = {
  title: 'Users',
  subtitle: 'Who accesses the system and with which role.',
  invite: 'Invite user',
  columns: { usuario: 'User', perfil: 'Role', ultimoAcesso: 'Last access', status: 'Status' },
  never: 'Never signed in',
  searchPlaceholder: 'Search by name or email',
  filters: { role: 'Filter by role', allRoles: 'All roles' },
  rolesHelp: {
    admin: 'Everything, including users and firm settings.',
    contador: 'Clients, obligations and finance.',
    assistente: 'Clients and obligations, no finance.',
    cliente: 'Only their own obligations and documents.',
  },
}
