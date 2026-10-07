import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/shared/layout'
import { RequireAuth, RequirePermission, RedirectIfAuthenticated } from '@/shared/auth'
import { NotFoundPage } from '@/shared/ui'
import { LoginPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { ClientesPage } from '@/features/clientes'
import { ObrigacoesPage } from '@/features/obrigacoes'
import { AtendimentoPage } from '@/features/atendimento'
import { FinanceiroPage } from '@/features/financeiro'
import { UsuariosPage } from '@/features/usuarios'
import { ConfiguracoesPage } from '@/features/configuracoes'

/**
 * Rotas. Toda página logada fica dentro de RequireAuth + AppShell; cada
 * módulo ainda passa por RequirePermission com a permissão do nav.ts.
 * Página nova: criar a feature, exportar a página pelo index e registrar aqui.
 */
export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthenticated />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            element: <RequirePermission permission="dashboard:ver" />,
            children: [{ index: true, element: <DashboardPage /> }],
          },
          {
            element: <RequirePermission permission="clientes:ver" />,
            children: [{ path: 'clientes', element: <ClientesPage /> }],
          },
          {
            element: <RequirePermission permission="obrigacoes:ver" />,
            children: [{ path: 'obrigacoes', element: <ObrigacoesPage /> }],
          },
          {
            element: <RequirePermission permission="atendimento:ver" />,
            children: [{ path: 'atendimento', element: <AtendimentoPage /> }],
          },
          {
            element: <RequirePermission permission="financeiro:ver" />,
            children: [{ path: 'financeiro', element: <FinanceiroPage /> }],
          },
          {
            element: <RequirePermission permission="usuarios:gerenciar" />,
            children: [{ path: 'usuarios', element: <UsuariosPage /> }],
          },
          {
            element: <RequirePermission permission="configuracoes:ver" />,
            children: [{ path: 'configuracoes', element: <ConfiguracoesPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
