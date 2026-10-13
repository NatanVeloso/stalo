import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { daysFromNow, fakeDelay, hoursFromNow, monthsAgo, paginate } from './util'

const rows = Array.from({ length: 45 }, (_, i) => i + 1)

describe('paginate', () => {
  it('devolve a página no formato do contrato', () => {
    expect(paginate(rows, 2, 20)).toEqual({ items: rows.slice(20, 40), page: 2, pageSize: 20, total: 45 })
  })

  it('última página parcial', () => {
    const p = paginate(rows, 3, 20)
    expect(p.items).toEqual([41, 42, 43, 44, 45])
    expect(p.total).toBe(45)
  })

  it('página além do fim vem vazia, mas com o total', () => {
    expect(paginate(rows, 9, 20)).toEqual({ items: [], page: 9, pageSize: 20, total: 45 })
  })

  it('usa página 1 e 20 por página por padrão', () => {
    const p = paginate(rows)
    expect(p.page).toBe(1)
    expect(p.pageSize).toBe(20)
    expect(p.items).toHaveLength(20)
  })

  it('página menor que 1 vira 1', () => {
    expect(paginate(rows, 0, 10)).toMatchObject({ page: 1, items: rows.slice(0, 10) })
    expect(paginate(rows, -3, 10).page).toBe(1)
  })

  it('pageSize fica entre 1 e 100, como o back', () => {
    expect(paginate(rows, 1, 0).pageSize).toBe(1)
    expect(paginate(rows, 1, 500).pageSize).toBe(100)
    expect(paginate(rows, 1, 500).items).toHaveLength(45)
  })

  it('lista vazia', () => {
    expect(paginate([], 1, 20)).toEqual({ items: [], page: 1, pageSize: 20, total: 0 })
  })
})

describe('datas relativas dos mocks', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 10, 9, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('daysFromNow devolve o dia (YYYY-MM-DD) a N dias de hoje', () => {
    expect(daysFromNow(0)).toBe('2026-10-10')
    expect(daysFromNow(5)).toBe('2026-10-15')
    expect(daysFromNow(-10)).toBe('2026-09-30')
  })

  it('monthsAgo devolve o primeiro dia do mês', () => {
    expect(monthsAgo(0)).toBe('2026-10-01')
    expect(monthsAgo(10)).toBe('2025-12-01')
  })

  it('hoursFromNow soma horas ao agora', () => {
    expect(new Date(hoursFromNow(2)).getTime() - Date.now()).toBe(2 * 3_600_000)
  })

  it('fakeDelay resolve depois do tempo pedido', async () => {
    const done = vi.fn()
    void fakeDelay(300).then(done)
    await vi.advanceTimersByTimeAsync(299)
    expect(done).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(done).toHaveBeenCalled()
  })
})
