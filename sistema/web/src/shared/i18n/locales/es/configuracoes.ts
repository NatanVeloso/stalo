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
  sessions: { title: 'Sesiones activas', current: 'Esta sesión', revoke: 'Cerrar', revokeAll: 'Cerrar las demás' },
  changePassword: 'Cambiar contraseña',
}
