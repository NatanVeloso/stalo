import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDictionary } from '@/shared/i18n'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { useToasts } from '@/shared/ui/toast.store'
import { ApiError } from './http'
import { queryClient } from './queryClient'

function runMutation(error: unknown, meta?: { silent?: boolean }) {
  return queryClient
    .getMutationCache()
    .build(queryClient, {
      mutationFn: () => Promise.reject(error),
      retry: false,
      meta,
    })
    .execute(undefined)
    .catch(() => undefined)
}

beforeEach(() => {
  vi.useFakeTimers()
  usePrefs.setState({ locale: 'pt-BR' })
  useToasts.setState({ toasts: [] })
})

afterEach(() => {
  queryClient.clear()
  vi.useRealTimers()
})

describe('queryClient (MutationCache)', () => {
  it('mutação que falha com ApiError mostra toast traduzido pelo code', async () => {
    await runMutation(new ApiError(409, 'resource/conflict', 'Conflict'))
    expect(useToasts.getState().toasts).toEqual([
      expect.objectContaining({
        tone: 'danger',
        message: getDictionary('pt-BR').common.errors.codes['resource/conflict'],
      }),
    ])
  })

  it('o toast sai no idioma atual', async () => {
    usePrefs.setState({ locale: 'en' })
    await runMutation(new ApiError(409, 'resource/conflict', 'Conflito'))
    expect(useToasts.getState().toasts[0]?.message).toBe(getDictionary('en').common.errors.codes['resource/conflict'])
  })

  it('erro sem código conhecido mostra a mensagem genérica', async () => {
    await runMutation(new Error('boom'))
    expect(useToasts.getState().toasts[0]?.message).toBe(getDictionary('pt-BR').common.errors.actionFailed)
  })

  it('meta.silent não mostra toast', async () => {
    await runMutation(new ApiError(422, 'validation/invalid-body', 'x'), { silent: true })
    expect(useToasts.getState().toasts).toEqual([])
  })

  it('o toast some sozinho', async () => {
    await runMutation(new ApiError(500, 'internal/error', 'x'))
    expect(useToasts.getState().toasts).toHaveLength(1)
    vi.advanceTimersByTime(3500)
    expect(useToasts.getState().toasts).toHaveLength(0)
  })

  it('erro de query não vira toast (é a tela que mostra)', async () => {
    await queryClient
      .fetchQuery({
        queryKey: ['x'],
        queryFn: () => Promise.reject(new ApiError(500, 'internal/error', 'x')),
        retry: false,
      })
      .catch(() => undefined)
    expect(useToasts.getState().toasts).toEqual([])
  })
})
