import { Moon, Sun } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { useResolvedTheme, useThemePref } from './useTheme'

/** Botão de alternância rápida (claro ↔ escuro). A opção "sistema" fica nas configurações. */
export function ThemeToggle({ variant = 'ghost' }: { variant?: 'ghost' | 'glass' }) {
  const t = useT()
  const resolved = useResolvedTheme()
  const [, setTheme] = useThemePref()
  return (
    <IconButton
      label={t.common.theme.toggle}
      variant={variant}
      onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
    >
      {resolved === 'dark' ? <Sun /> : <Moon />}
    </IconButton>
  )
}
