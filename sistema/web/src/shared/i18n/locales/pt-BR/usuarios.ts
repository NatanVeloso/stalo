export const usuarios = {
  title: 'Usuários',
  subtitle: 'Quem acessa o sistema e com qual perfil.',
  invite: 'Convidar usuário',
  columns: { usuario: 'Usuário', perfil: 'Perfil', ultimoAcesso: 'Último acesso', status: 'Status' },
  never: 'Nunca acessou',
  searchPlaceholder: 'Buscar por nome ou e-mail',
  filters: { role: 'Filtrar por perfil', allRoles: 'Todos os perfis' },
  rolesHelp: {
    admin: 'Tudo, inclusive usuários e configurações do escritório.',
    contador: 'Clientes, obrigações e financeiro.',
    assistente: 'Clientes e obrigações, sem financeiro.',
    cliente: 'Só as próprias obrigações e documentos.',
  },
}
