import type { Dictionary } from '../pt-BR'

export const usuarios: Dictionary['usuarios'] = {
  title: 'Usuarios',
  subtitle: 'Quién accede al sistema y con qué perfil.',
  invite: 'Invitar usuario',
  columns: { usuario: 'Usuario', perfil: 'Perfil', ultimoAcesso: 'Último acceso', status: 'Estado' },
  never: 'Nunca accedió',
  rolesHelp: {
    admin: 'Todo, incluidos usuarios y configuración de la oficina.',
    contador: 'Clientes, obligaciones y finanzas.',
    assistente: 'Clientes y obligaciones, sin finanzas.',
    cliente: 'Solo sus propias obligaciones y documentos.',
  },
}
