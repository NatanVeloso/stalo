import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { TooltipProvider } from '@/shared/ui/TooltipProvider'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { useAuth, type AuthUser } from './auth.store'
import { RedirectIfAuthenticated, RequireAuth, RequirePermission } from './guards'
import type { Role } from './permissions'

const user = (role: Role): AuthUser => ({ id: 'u1', nome: 'Ana', email: 'a@stalo.com.br', role })

/** Mostra a rota atual e o `from` guardado no state, para conferir o redirecionamento. */
function LoginProbe() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? ''
  return <p>login from={from}</p>
}

/** Mesmo aninhamento do `app/router.tsx`: RequireAuth → RequirePermission por módulo. */
function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        element: <RedirectIfAuthenticated />,
        children: [{ path: '/login', element: <LoginProbe /> }],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: '/', element: <p>home</p> },
          {
            element: <RequirePermission permission="financeiro:ver" />,
            children: [{ path: '/financeiro', element: <p>financeiro</p> }],
          },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  render(
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>,
  )
  return router
}

beforeEach(() => {
  usePrefs.setState({ locale: 'pt-BR' })
})

afterEach(() => {
  useAuth.setState({ status: 'anonymous', user: null, accessToken: null })
})

describe('RequireAuth', () => {
  it('booting → splash, sem renderizar a página', () => {
    useAuth.setState({ status: 'booting', user: null })
    renderAt('/financeiro')
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('financeiro')).not.toBeInTheDocument()
  })

  it('anonymous → redireciona para /login guardando de onde veio', () => {
    useAuth.setState({ status: 'anonymous', user: null })
    const router = renderAt('/financeiro')
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByText('login from=/financeiro')).toBeInTheDocument()
  })

  it('authenticated → renderiza a rota filha (Outlet)', () => {
    useAuth.setState({ status: 'authenticated', user: user('contador') })
    renderAt('/')
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('sessão encerrada com a página aberta manda para o login', () => {
    useAuth.setState({ status: 'authenticated', user: user('admin') })
    const router = renderAt('/financeiro')
    expect(screen.getByText('financeiro')).toBeInTheDocument()
    act(() => useAuth.setState({ status: 'anonymous', user: null }))
    expect(router.state.location.pathname).toBe('/login')
  })
})

describe('RequirePermission', () => {
  it('com permissão renderiza a página', () => {
    useAuth.setState({ status: 'authenticated', user: user('contador') })
    renderAt('/financeiro')
    expect(screen.getByText('financeiro')).toBeInTheDocument()
  })

  it('sem permissão mostra a página Sem acesso, na mesma URL', () => {
    useAuth.setState({ status: 'authenticated', user: user('assistente') })
    const router = renderAt('/financeiro')
    expect(screen.queryByText('financeiro')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sem acesso' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/financeiro')
  })
})

describe('RedirectIfAuthenticated', () => {
  it('anônimo vê o /login', () => {
    useAuth.setState({ status: 'anonymous', user: null })
    renderAt('/login')
    expect(screen.getByText(/^login/)).toBeInTheDocument()
  })

  it('logado em /login vai para a home', () => {
    useAuth.setState({ status: 'authenticated', user: user('admin') })
    const router = renderAt('/login')
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('booting → splash', () => {
    useAuth.setState({ status: 'booting', user: null })
    renderAt('/login')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
