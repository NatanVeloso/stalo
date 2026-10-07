import type { Dictionary } from '../pt-BR'

export const auth: Dictionary['auth'] = {
  title: 'Sign in',
  subtitle: 'Access the Stalo system with your account.',
  email: 'Email',
  emailPlaceholder: 'you@company.com',
  password: 'Password',
  passwordPlaceholder: 'Your password',
  remember: 'Keep me signed in',
  forgot: 'Forgot password',
  submit: 'Sign in',
  submitting: 'Signing in...',
  demoTitle: 'Sign in as (demo)',
  demoHint: 'Pick a role to fill in the credentials.',
  errors: {
    emailRequired: 'Enter your email.',
    emailInvalid: 'Invalid email.',
    passwordRequired: 'Enter your password.',
    passwordMin: 'Password has at least 6 characters.',
    invalid: 'Wrong email or password.',
  },
  footer: 'Restricted access. Activity is logged.',
}
