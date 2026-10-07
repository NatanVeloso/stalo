import type { Dictionary } from '../pt-BR'

export const auth: Dictionary['auth'] = {
  title: 'Iniciar sesión',
  subtitle: 'Accede al sistema de Stalo con tu cuenta.',
  email: 'Correo electrónico',
  emailPlaceholder: 'tu@empresa.com',
  password: 'Contraseña',
  passwordPlaceholder: 'Tu contraseña',
  remember: 'Mantener sesión iniciada',
  forgot: 'Olvidé mi contraseña',
  submit: 'Entrar',
  submitting: 'Entrando...',
  demoTitle: 'Entrar como (demostración)',
  demoHint: 'Elige un perfil para completar las credenciales.',
  errors: {
    emailRequired: 'Ingresa el correo.',
    emailInvalid: 'Correo inválido.',
    passwordRequired: 'Ingresa la contraseña.',
    passwordMin: 'La contraseña tiene al menos 6 caracteres.',
    invalid: 'Correo o contraseña incorrectos.',
  },
  footer: 'Acceso restringido. La actividad queda registrada.',
}
