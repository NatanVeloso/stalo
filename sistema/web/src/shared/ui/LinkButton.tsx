import { forwardRef, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

type Props = Omit<LinkProps, 'className'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}

/** Link com cara de botão, para navegação ("Ver tudo", "Ir para a visão geral", "Abrir cliente"). */
export const LinkButton = forwardRef<HTMLAnchorElement, Props>(function LinkButton(
  { variant = 'primary', size = 'md', leading, trailing, className, children, ...rest },
  ref,
) {
  return (
    <Link ref={ref} className={buttonClass({ variant, size, className })} {...rest}>
      {leading}
      {children}
      {trailing}
    </Link>
  )
})
