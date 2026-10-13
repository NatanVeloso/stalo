import { afterEach, describe, expect, it, vi } from 'vitest'

async function loadEnv() {
  vi.resetModules()
  const mod = await import('./env')
  return mod.env
}

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('sem VITE_API_URL roda em modo mock', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const env = await loadEnv()
    expect(env.apiUrl).toBe('')
    expect(env.mock).toBe(true)
  })

  it('com VITE_API_URL sai do mock e remove a barra final', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.stalo.com.br/')
    const env = await loadEnv()
    expect(env.apiUrl).toBe('https://api.stalo.com.br')
    expect(env.mock).toBe(false)
  })

  it('URL sem barra final fica como está', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000/v1')
    const env = await loadEnv()
    expect(env.apiUrl).toBe('http://localhost:3000/v1')
  })
})
