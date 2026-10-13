import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from '@/shared/lib/queryClient'
import { http } from '@/shared/lib/http'
import { env } from '@/shared/lib/env'
import { mockSession } from '@/mocks'
import { useAuth, type AuthUser } from './auth.store'

const PERSIST_KEY = 'stalo-sistema:auth'
const ana: AuthUser = { id: 'u1', nome: 'Ana', email: 'admin@stalo.com.br', role: 'admin' }

/** Promessa que avança os timers falsos até resolver (o mock de auth usa `fakeDelay`). */
async function run<T>(promise: Promise<T>) {
  const settled = promise.then(
    (v) => ({ ok: true as const, v }),
    (e: unknown) => ({ ok: false as const, e }),
  )
  await vi.runAllTimersAsync()
  const r = await settled
  if (!r.ok) throw r.e
  return r.v
}

function seedCache() {
  queryClient.setQueryData(['clientes', 'lista'], [{ id: 'c1' }])
  expect(queryClient.getQueryCache().getAll()).toHaveLength(1)
}

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  queryClient.clear()
  useAuth.setState({ status: 'anonymous', user: null, accessToken: null })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useAuth', () => {
  it('o teste roda em modo mock (sem VITE_API_URL)', () => {
    expect(env.mock).toBe(true)
  })

  it('login com credencial certa autentica, guarda o token em memória e limpa o cache', async () => {
    seedCache()
    await run(useAuth.getState().login('admin@stalo.com.br', '123456', true))

    const s = useAuth.getState()
    expect(s.status).toBe('authenticated')
    expect(s.user).toMatchObject({ email: 'admin@stalo.com.br', role: 'admin' })
    expect(s.accessToken).toMatch(/^mock\./)
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
    expect(mockSession.read()).toBe(s.user?.id)
  })

  it('login com senha errada lança ApiError e não autentica', async () => {
    await expect(run(useAuth.getState().login('admin@stalo.com.br', 'errada', false))).rejects.toMatchObject({
      code: 'auth/invalid-credentials',
    })
    expect(useAuth.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null })
  })

  it('login com e-mail desconhecido lança', async () => {
    await expect(run(useAuth.getState().login('ninguem@x.com', '123456', false))).rejects.toMatchObject({
      code: 'auth/invalid-credentials',
    })
  })

  it('logout limpa estado e cache das queries na hora (antes da resposta da API)', async () => {
    useAuth.setState({ status: 'authenticated', user: ana, accessToken: 'tok' })
    seedCache()

    const pending = useAuth.getState().logout()
    expect(useAuth.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null })
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
    await run(pending)
  })

  it('onUnauthorized do http (refresh falhou) encerra a sessão e limpa o cache', async () => {
    // a API responde 401 a tudo, inclusive ao /auth/refresh: o http chama o onUnauthorized do store
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 401 })),
    )
    useAuth.setState({ status: 'authenticated', user: ana, accessToken: 'tok' })
    seedCache()

    await expect(http.get('/x')).rejects.toMatchObject({ status: 401 })
    expect(useAuth.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null })
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
  })

  it('o http lê o access token do store', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    useAuth.setState({ accessToken: 'abc' })
    await http.get('/y')
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer abc')
  })

  it('persist guarda só o user, nunca o accessToken', () => {
    useAuth.setState({ status: 'authenticated', user: ana, accessToken: 'segredo' })
    const raw = localStorage.getItem(PERSIST_KEY)
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('segredo')
    const saved = JSON.parse(raw!) as { state: Record<string, unknown> }
    expect(Object.keys(saved.state)).toEqual(['user'])
    expect(saved.state.user).toEqual(ana)
  })

  it('bootstrap sem usuário lembrado fica anônimo sem chamar o refresh', async () => {
    useAuth.setState({ status: 'booting', user: null })
    await run(useAuth.getState().bootstrap())
    expect(useAuth.getState().status).toBe('anonymous')
  })

  it('bootstrap com usuário lembrado e sessão mock válida autentica', async () => {
    await run(useAuth.getState().login('admin@stalo.com.br', '123456', true))
    useAuth.setState({ status: 'booting', accessToken: null })
    await run(useAuth.getState().bootstrap())
    expect(useAuth.getState().status).toBe('authenticated')
    expect(useAuth.getState().accessToken).toMatch(/^mock\./)
  })

  it('bootstrap com sessão expirada vira anônimo e esquece o usuário', async () => {
    mockSession.clear()
    useAuth.setState({ status: 'booting', user: ana })
    await run(useAuth.getState().bootstrap())
    expect(useAuth.getState()).toMatchObject({ status: 'anonymous', user: null })
  })

  it('setUser troca o usuário sem mexer na sessão', () => {
    useAuth.setState({ status: 'authenticated', user: ana, accessToken: 'tok' })
    useAuth.getState().setUser({ ...ana, nome: 'Ana Souza' })
    expect(useAuth.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'tok',
      user: { nome: 'Ana Souza' },
    })
  })
})
