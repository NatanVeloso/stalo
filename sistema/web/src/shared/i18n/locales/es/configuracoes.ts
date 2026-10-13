import type { Dictionary } from '../pt-BR'

export const configuracoes: Dictionary['configuracoes'] = {
  title: 'Configuración',
  subtitle: 'Tu cuenta y la apariencia del sistema.',
  sections: {
    perfil: { title: 'Perfil', description: 'Nombre y correo que ve el equipo.' },
    aparencia: {
      title: 'Apariencia',
      description: 'El tema, el idioma, la fuente y la densidad valen solo en este navegador.',
    },
    seguranca: { title: 'Seguridad', description: 'Sesiones activas y contraseña.' },
  },
  fields: { nome: 'Nombre', email: 'Correo', cargo: 'Perfil' },
  sessions: {
    title: 'Sesiones activas',
    current: 'Esta sesión',
    revoke: 'Cerrar',
    revokeAll: 'Cerrar las demás',
    revoked: 'Sesión cerrada.',
    empty: 'No hay sesiones activas',
    device: '{dispositivo} · {navegador}',
    meta: 'Activa {quando} · desde {data}',
  },
  saved: 'Perfil guardado.',
  errors: {
    nomeRequired: 'Ingresa el nombre.',
    emailRequired: 'Ingresa el correo.',
    emailInvalid: 'Correo inválido.',
  },
  changePassword: 'Cambiar contraseña',
}
