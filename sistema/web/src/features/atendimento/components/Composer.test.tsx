import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { getDictionary } from '@/shared/i18n'
import { TooltipProvider } from '@/shared/ui'
import { Composer } from './Composer'

// o menu de templates busca na API; aqui só interessa o bloqueio do texto livre
vi.mock('../queries', () => ({ useTemplates: () => ({ isPending: true }) }))

const t = getDictionary()

function setup(windowClosed: boolean) {
  const onSend = vi.fn()
  render(
    <TooltipProvider>
      <Composer windowClosed={windowClosed} sending={false} onSend={onSend} onTemplate={vi.fn()} />
    </TooltipProvider>,
  )
  return { onSend, textarea: () => screen.getByRole('textbox') }
}

describe('Composer', () => {
  it('janela fechada bloqueia texto livre e oferece template', () => {
    const { textarea } = setup(true)
    expect(textarea()).toBeDisabled()
    expect(screen.getByRole('button', { name: t.atendimento.composer.template })).toBeInTheDocument()
  })

  it('janela fechada libera nota interna', () => {
    const { onSend, textarea } = setup(true)
    fireEvent.click(screen.getByRole('button', { name: t.atendimento.composer.note }))
    expect(textarea()).toBeEnabled()
    fireEvent.change(textarea(), { target: { value: 'conferir protocolo' } })
    fireEvent.keyDown(textarea(), { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('conferir protocolo', true)
  })

  it('janela aberta envia texto livre', () => {
    const { onSend, textarea } = setup(false)
    fireEvent.change(textarea(), { target: { value: 'oi' } })
    fireEvent.keyDown(textarea(), { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('oi', false)
  })
})
