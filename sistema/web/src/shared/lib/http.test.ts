import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, configureHttp, http, refreshSession } from './http'

/** Resposta mínima no formato que o `http` lê (status, ok, json). */
function reply(status: number, body?: unknown) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    statusText: `status ${status}`,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
  })
}

type Handler = (url: string, init: RequestInit) => Response | Promise<Response>

let fetchMock: ReturnType<typeof vi.fn<(url: string, init: RequestInit) => Promise<Response>>>
let token: string | null
let onUnauthorized: ReturnType<typeof vi.fn>

function route(handler: Handler) {
  fetchMock.mockImplementation(async (url, init) => handler(url, init))
}

const authHeader = (init: RequestInit) => (init.headers as Record<string, string>).Authorization
const callsTo = (path: string) => fetchMock.mock.calls.filter(([url]) => url.endsWith(path))

beforeEach(() => {
  token = 'velho'
  onUnauthorized = vi.fn()
  configureHttp({
    getAccessToken: () => token,
    setAccessToken: (t) => {
      token = t
    },
    onUnauthorized: onUnauthorized as () => void,
  })
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** API fake: aceita só o token "novo"; o refresh troca o token depois de um tique. */
function apiQueAceitaSo(novo: string, refreshOk = true) {
  route(async (url, init) => {
    if (url.endsWith('/auth/refresh')) {
      await Promise.resolve()
      return refreshOk ? reply(200, { accessToken: novo, user: { id: 'u1' } }) : reply(401, { code: 'auth/no-session' })
    }
    return authHeader(init) === `Bearer ${novo}` ? reply(200, { url }) : reply(401, { code: 'auth/no-session' })
  })
}

describe('http', () => {
  it('injeta o Bearer do configureHttp, credentials e JSON', async () => {
    route(() => reply(200, { ok: true }))
    await expect(http.post('/clientes', { nome: 'A' })).resolves.toEqual({ ok: true })

    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('/clientes')
    expect(init.method).toBe('POST')
    expect(init.credentials).toBe('include')
    expect(init.body).toBe(JSON.stringify({ nome: 'A' }))
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer velho',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  })

  it('sem token não manda Authorization; sem corpo não manda Content-Type', async () => {
    token = null
    route(() => reply(200, []))
    await http.get('/clientes')
    const headers = fetchMock.mock.calls[0]![1].headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
    expect(headers['Content-Type']).toBeUndefined()
  })

  it('401 → chama /auth/refresh uma vez e repete com o token novo', async () => {
    apiQueAceitaSo('novo')
    await expect(http.get('/clientes')).resolves.toEqual({ url: '/clientes' })

    expect(callsTo('/auth/refresh')).toHaveLength(1)
    const refreshInit = callsTo('/auth/refresh')[0]![1]
    expect(refreshInit.method).toBe('POST')
    expect(refreshInit.credentials).toBe('include')

    const tentativas = callsTo('/clientes')
    expect(tentativas).toHaveLength(2)
    expect(authHeader(tentativas[0]![1])).toBe('Bearer velho')
    expect(authHeader(tentativas[1]![1])).toBe('Bearer novo')
    expect(token).toBe('novo')
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('single-flight: três requisições paralelas com 401 disparam UM refresh', async () => {
    apiQueAceitaSo('novo')
    const results = await Promise.all([http.get('/a'), http.get('/b'), http.get('/c')])

    expect(results).toEqual([{ url: '/a' }, { url: '/b' }, { url: '/c' }])
    expect(callsTo('/auth/refresh')).toHaveLength(1)
  })

  it('refreshSession() chamado junto com uma requisição 401 compartilha o mesmo refresh', async () => {
    apiQueAceitaSo('novo')
    const bootstrap = refreshSession()
    const [body, data] = await Promise.all([bootstrap, http.get('/clientes')])

    expect(body).toEqual({ accessToken: 'novo', user: { id: 'u1' } })
    expect(data).toEqual({ url: '/clientes' })
    expect(callsTo('/auth/refresh')).toHaveLength(1)
  })

  it('depois que o refresh termina, um 401 novo pode renovar de novo', async () => {
    apiQueAceitaSo('novo')
    await refreshSession()
    await refreshSession()
    expect(callsTo('/auth/refresh')).toHaveLength(2)
  })

  it('refresh falhou → onUnauthorized e lança ApiError do 401 original', async () => {
    apiQueAceitaSo('novo', false)
    const err = await http.get('/clientes').catch((e: unknown) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 401, code: 'auth/no-session' })
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
    expect(callsTo('/clientes')).toHaveLength(1)
  })

  it('refresh com erro de rede também desloga', async () => {
    route((url) => {
      if (url.endsWith('/auth/refresh')) throw new TypeError('Failed to fetch')
      return reply(401)
    })
    await expect(http.get('/clientes')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('erro com corpo { code, message, details } vira ApiError com esses campos', async () => {
    const details = [{ campo: 'cnpj', erro: 'inválido' }]
    route(() => reply(422, { code: 'validation/invalid-body', message: 'Corpo inválido', details }))
    const err = await http.post('/clientes', {}).catch((e: unknown) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({
      name: 'ApiError',
      status: 422,
      code: 'validation/invalid-body',
      message: 'Corpo inválido',
      details,
    })
    expect(callsTo('/auth/refresh')).toHaveLength(0)
  })

  it('erro sem corpo JSON vira ApiError "unknown" com o statusText', async () => {
    route(() => new Response('<html>502</html>', { status: 502, statusText: 'Bad Gateway' }))
    await expect(http.get('/x')).rejects.toMatchObject({ status: 502, code: 'unknown', message: 'Bad Gateway' })
  })

  it('204 devolve undefined', async () => {
    route(() => new Response(null, { status: 204 }))
    await expect(http.delete('/clientes/1')).resolves.toBeUndefined()
  })

  it('retry: false não tenta refresh', async () => {
    route(() => reply(401, { code: 'auth/invalid-credentials', message: 'x' }))
    await expect(http.post('/auth/login', {}, { retry: false })).rejects.toMatchObject({
      status: 401,
      code: 'auth/invalid-credentials',
    })
    expect(callsTo('/auth/refresh')).toHaveLength(0)
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('a repetição depois do refresh não entra em laço: segundo 401 lança sem novo refresh', async () => {
    route((url) => (url.endsWith('/auth/refresh') ? reply(200, { accessToken: 'novo' }) : reply(401)))
    await expect(http.get('/clientes')).rejects.toMatchObject({ status: 401 })
    expect(callsTo('/auth/refresh')).toHaveLength(1)
    expect(callsTo('/clientes')).toHaveLength(2)
  })
})
