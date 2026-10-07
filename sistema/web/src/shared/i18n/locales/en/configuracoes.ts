import type { Dictionary } from '../pt-BR'

export const configuracoes: Dictionary['configuracoes'] = {
  title: 'Settings',
  subtitle: 'Your account and how the system looks.',
  sections: {
    perfil: { title: 'Profile', description: 'Name and email shown to the team.' },
    aparencia: {
      title: 'Appearance',
      description: 'Theme, language, font size and density apply to this browser only.',
    },
    seguranca: { title: 'Security', description: 'Active sessions and password.' },
  },
  fields: { nome: 'Name', email: 'Email', cargo: 'Role' },
  sessions: { title: 'Active sessions', current: 'This session', revoke: 'End', revokeAll: 'End the others' },
  changePassword: 'Change password',
}
