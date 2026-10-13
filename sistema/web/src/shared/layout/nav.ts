import { LayoutDashboard, Building2, CalendarCheck2, Wallet, Users, Settings } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { Dictionary } from '@/shared/i18n'
import { WhatsAppIcon } from '@/shared/ui'
import type { Permission } from '@/shared/auth'

export type NavItem = {
  to: string
  /** Ícone do lucide ou um SVG próprio de `shared/ui` (ex.: `WhatsAppIcon`); recebe `className`. */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Classe da cor do ícone quando o item está ativo (token `--nav-<modulo>` por tema). */
  activeColor: string
  /** Chave em `t.common.nav` (a label é traduzida no componente). */
  label: keyof Omit<Dictionary['common']['nav'], 'sections'>
  permission: Permission
  section: 'operacao' | 'gestao'
}

/** Menu lateral. Item some para quem não tem a permissão; a rota ainda é protegida em app/router. */
export const navItems: NavItem[] = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'dashboard',
    activeColor: 'text-nav-dashboard',
    permission: 'dashboard:ver',
    section: 'operacao',
  },
  {
    to: '/clientes',
    icon: Building2,
    label: 'clientes',
    activeColor: 'text-nav-clientes',
    permission: 'clientes:ver',
    section: 'operacao',
  },
  {
    to: '/obrigacoes',
    icon: CalendarCheck2,
    label: 'obrigacoes',
    activeColor: 'text-nav-obrigacoes',
    permission: 'obrigacoes:ver',
    section: 'operacao',
  },
  {
    to: '/atendimento',
    icon: WhatsAppIcon,
    label: 'atendimento',
    activeColor: 'text-nav-atendimento',
    permission: 'atendimento:ver',
    section: 'operacao',
  },
  {
    to: '/financeiro',
    icon: Wallet,
    label: 'financeiro',
    activeColor: 'text-nav-financeiro',
    permission: 'financeiro:ver',
    section: 'gestao',
  },
  {
    to: '/usuarios',
    icon: Users,
    label: 'usuarios',
    activeColor: 'text-nav-usuarios',
    permission: 'usuarios:gerenciar',
    section: 'gestao',
  },
  {
    to: '/configuracoes',
    icon: Settings,
    label: 'configuracoes',
    activeColor: 'text-nav-configuracoes',
    permission: 'configuracoes:ver',
    section: 'gestao',
  },
]
