import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { Mensagem } from '../types'
import type * as Sons from '../lib/sons'
import { useSomNovasConversas, useSomNovasMensagens } from './useSomRecebimento'

const tocar = vi.hoisted(() => vi.fn())
vi.mock('../lib/sons', async (importOriginal) => ({
  ...(await importOriginal<typeof Sons>()),
  tocarSomRecebimento: tocar,
}))

const msg = (id: string, de: Mensagem['de'], em: string) => ({ id, de, em }) as Mensagem

beforeEach(() => tocar.mockClear())

describe('useSomNovasConversas', () => {
  it('primeira carga não toca; nova não lida toca', () => {
    const { rerender } = renderHook(({ n }: { n: number | undefined }) => useSomNovasConversas(n), {
      initialProps: { n: undefined as number | undefined },
    })
    rerender({ n: 3 })
    expect(tocar).not.toHaveBeenCalled()
    rerender({ n: 4 })
    expect(tocar).toHaveBeenCalledTimes(1)
  })
  it('conversa lida (total cai) não toca', () => {
    const { rerender } = renderHook(({ n }) => useSomNovasConversas(n), { initialProps: { n: 2 } })
    rerender({ n: 0 })
    expect(tocar).not.toHaveBeenCalled()
  })
})

describe('useSomNovasMensagens', () => {
  const base = [msg('1', 'contato', '2026-10-10T10:00:00.000Z'), msg('2', 'atendente', '2026-10-10T10:05:00.000Z')]

  it('primeira carga não toca; mensagem nova do contato toca', () => {
    const { rerender } = renderHook(({ id, ms }) => useSomNovasMensagens(id, ms), {
      initialProps: { id: 'cv1', ms: base },
    })
    expect(tocar).not.toHaveBeenCalled()
    rerender({ id: 'cv1', ms: [...base, msg('3', 'contato', '2026-10-10T10:10:00.000Z')] })
    expect(tocar).toHaveBeenCalledTimes(1)
  })
  it('mensagem do próprio atendente não toca', () => {
    const { rerender } = renderHook(({ id, ms }) => useSomNovasMensagens(id, ms), {
      initialProps: { id: 'cv1', ms: base },
    })
    rerender({ id: 'cv1', ms: [...base, msg('3', 'atendente', '2026-10-10T10:10:00.000Z')] })
    expect(tocar).not.toHaveBeenCalled()
  })
  it('trocar de conversa não toca', () => {
    const { rerender } = renderHook(({ id, ms }) => useSomNovasMensagens(id, ms), {
      initialProps: { id: 'cv1', ms: base },
    })
    rerender({ id: 'cv2', ms: [msg('9', 'contato', '2026-10-10T11:00:00.000Z')] })
    expect(tocar).not.toHaveBeenCalled()
  })
})
