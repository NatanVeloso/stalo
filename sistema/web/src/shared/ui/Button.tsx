import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

/**
 * Botão padrão. Ícone só: use `IconButton`. Navegação: use `LinkButton` (nunca `<Link><Button>`,
 * que põe um controle dentro do outro). Texto que some no mobile (`hidden sm:inline`) exige
 * `aria-label` com o mesmo texto, senão o botão fica sem nome.
 */
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leading,
    trailing,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, className })}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leading}
      {children}
      {trailing}
    </button>
  )
})
