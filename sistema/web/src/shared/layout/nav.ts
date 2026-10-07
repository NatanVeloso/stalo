import {
  LayoutDashboard,
  Building2,
  CalendarCheck2,
  MessageCircle,
  Wallet,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { Dictionary } from '@/shared/i18n'
import type { Permission } from '@/shared/auth'

export type NavItem = {
  to: string
  icon: LucideIcon
  /** Chave em `t.common.nav` (a label é traduzida no componente). */
  label: keyof Omit<Dictionary['common']['nav'], 'sections'>
  permission: Permission
  section: 'operacao' | 'gestao'
}

/** Menu lateral. Item some para quem não tem a permissão; a rota ainda é protegida em app/router. */
export const navItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'dashboard', permission: 'dashboard:ver', section: 'operacao' },
  { to: '/clientes', icon: Building2, label: 'clientes', permission: 'clientes:ver', section: 'operacao' },
  { to: '/obrigacoes', icon: CalendarCheck2, label: 'obrigacoes', permission: 'obrigacoes:ver', section: 'operacao' },
  { to: '/atendimento', icon: MessageCircle, label: 'atendimento', permission: 'atendimento:ver', section: 'operacao' },
  { to: '/financeiro', icon: Wallet, label: 'financeiro', permission: 'financeiro:ver', section: 'gestao' },
  { to: '/usuarios', icon: Users, label: 'usuarios', permission: 'usuarios:gerenciar', section: 'gestao' },
  { to: '/configuracoes', icon: Settings, label: 'configuracoes', permission: 'configuracoes:ver', section: 'gestao' },
]
