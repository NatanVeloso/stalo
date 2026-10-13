import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'

/** Bloco não clicável no topo de um `Menu` (ex.: "Conectado como" + nome e e-mail). */
export function MenuLabel({ children }: { children: ReactNode }) {
  return <DropdownMenu.Label className="px-3 py-2">{children}</DropdownMenu.Label>
}
