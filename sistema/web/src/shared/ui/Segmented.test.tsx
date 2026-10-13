import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { Segmented } from './Segmented'
import { TooltipProvider } from './TooltipProvider'

const options = [
  { value: 'todas', label: 'Todas', count: 1234 },
  { value: 'abertas', label: 'Abertas' },
  { value: 'resolvidas', label: 'Resolvidas' },
] as const

function renderSegmented(value: (typeof options)[number]['value'], onChange = vi.fn()) {
  render(
    <TooltipProvider>
      <Segmented value={value} onChange={onChange} options={[...options]} label="Estado" />
    </TooltipProvider>,
  )
  return onChange
}

beforeEach(() => {
  usePrefs.setState({ locale: 'pt-BR' })
})

describe('Segmented', () => {
  it('é um radiogroup rotulado e marca a ativa com aria-checked', () => {
    renderSegmented('abertas')
    expect(screen.getByRole('radiogroup', { name: 'Estado' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Abertas' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Resolvidas' })).toHaveAttribute('aria-checked', 'false')
  })

  it('clicar numa opção chama onChange com o valor', () => {
    const onChange = renderSegmented('abertas')
    fireEvent.click(screen.getByRole('radio', { name: 'Resolvidas' }))
    expect(onChange).toHaveBeenCalledWith('resolvidas')
  })

  it('contagem formatada pelo idioma', () => {
    renderSegmented('todas')
    expect(screen.getByRole('radio', { name: /Todas/ })).toHaveTextContent('1.234')
  })
})
