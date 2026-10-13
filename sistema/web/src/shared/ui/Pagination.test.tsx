import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { getDictionary } from '@/shared/i18n'
import { Pagination } from './Pagination'
import { TooltipProvider } from './TooltipProvider'

const t = getDictionary('pt-BR')

function renderPagination(page: number, total: number, pageSize = 20, onChange = vi.fn()) {
  render(
    <TooltipProvider>
      <Pagination page={page} pageSize={pageSize} total={total} onChange={onChange} />
    </TooltipProvider>,
  )
  return onChange
}

const prev = () => screen.getByRole('button', { name: t.common.table.previous })
const next = () => screen.getByRole('button', { name: t.common.table.next })

beforeEach(() => {
  usePrefs.setState({ locale: 'pt-BR' })
})

describe('Pagination', () => {
  it('na página 1 o anterior fica desabilitado', () => {
    const onChange = renderPagination(1, 100)
    expect(prev()).toBeDisabled()
    expect(next()).toBeEnabled()
    fireEvent.click(next())
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('na última página o próximo fica desabilitado', () => {
    const onChange = renderPagination(5, 100)
    expect(next()).toBeDisabled()
    expect(prev()).toBeEnabled()
    fireEvent.click(prev())
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('lista vazia: uma página só, os dois desabilitados, "0–0 de 0"', () => {
    renderPagination(1, 0)
    expect(prev()).toBeDisabled()
    expect(next()).toBeDisabled()
    expect(screen.getByText('Mostrando 0–0 de 0')).toBeInTheDocument()
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument()
  })

  it('intervalo da última página parcial', () => {
    renderPagination(3, 45)
    expect(screen.getByText('Mostrando 41–45 de 45')).toBeInTheDocument()
  })

  it('números formatados pelo idioma (milhar)', () => {
    renderPagination(2, 12_345, 1000)
    expect(screen.getByText('Mostrando 1.001–2.000 de 12.345')).toBeInTheDocument()
    expect(screen.getByText('Página 2 de 13')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Página 2 de 13' })).toBeInTheDocument()

    act(() => usePrefs.setState({ locale: 'en' }))
    expect(screen.getByText(/1,001.+2,000.+12,345/)).toBeInTheDocument()
  })
})
