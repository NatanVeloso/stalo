export const configuracoes = {
  title: 'Configurações',
  subtitle: 'Sua conta e a aparência do sistema.',
  sections: {
    perfil: { title: 'Perfil', description: 'Nome e e-mail que aparecem para a equipe.' },
    aparencia: { title: 'Aparência', description: 'Tema, idioma, fonte e densidade valem só neste navegador.' },
    seguranca: { title: 'Segurança', description: 'Sessões ativas e senha.' },
  },
  fields: { nome: 'Nome', email: 'E-mail', cargo: 'Perfil' },
  sessions: {
    title: 'Sessões ativas',
    current: 'Esta sessão',
    revoke: 'Encerrar',
    revokeAll: 'Encerrar as outras',
    revoked: 'Sessão encerrada.',
    empty: 'Nenhuma sessão ativa',
    device: '{dispositivo} · {navegador}',
    meta: 'Ativa {quando} · desde {data}',
  },
  saved: 'Perfil salvo.',
  errors: {
    nomeRequired: 'Informe o nome.',
    emailRequired: 'Informe o e-mail.',
    emailInvalid: 'E-mail inválido.',
  },
  changePassword: 'Alterar senha',
}
