import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { getDictionary } from '@/shared/i18n'
import { Drawer } from './Drawer'
import { TooltipProvider } from './TooltipProvider'

const t = getDictionary('pt-BR')

function renderDrawer(open: boolean, onClose = vi.fn()) {
  const ui = (o: boolean) => (
    <TooltipProvider>
      <Drawer open={o} onClose={onClose} title="Detalhe" description="Sub">
        <p>conteúdo</p>
      </Drawer>
    </TooltipProvider>
  )
  const result = render(ui(open))
  return { ...result, onClose, setOpen: (o: boolean) => result.rerender(ui(o)) }
}

const dialog = () => document.querySelector('dialog')!

beforeEach(() => {
  usePrefs.setState({ locale: 'pt-BR' })
})

describe('Drawer', () => {
  it('abre com showModal e fecha com close conforme `open`', () => {
    const { setOpen } = renderDrawer(false)
    expect(dialog().open).toBe(false)
    setOpen(true)
    expect(dialog().open).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Detalhe' })).toBeInTheDocument()
    setOpen(false)
    expect(dialog().open).toBe(false)
  })

  it('Esc (evento close do <dialog>) chama onClose', () => {
    const { onClose } = renderDrawer(true)
    // o navegador fecha o modal no Esc e dispara `close`; o polyfill faz o mesmo no `close()`
    dialog().close()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('botão Fechar chama onClose', () => {
    const { onClose } = renderDrawer(true)
    fireEvent.click(screen.getByRole('button', { name: t.common.actions.close }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clique fora do painel (no próprio <dialog>) fecha; clique dentro não', () => {
    const { onClose } = renderDrawer(true)
    fireEvent.click(screen.getByText('conteúdo'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(dialog())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('o título rotula o diálogo', () => {
    renderDrawer(true)
    const d = dialog()
    const titleId = d.getAttribute('aria-labelledby')!
    expect(document.getElementById(titleId)).toHaveTextContent('Detalhe')
  })

  /*
   * BUG: fechar pelo botão (ou clique fora) chama `onClose` duas vezes. O pai põe `open=false`,
   * o efeito chama `el.close()` e o <dialog> dispara `close`, que chama `onClose` de novo.
   * Inofensivo com `setOpen(false)`, mas onClose com efeito (navegar, limpar formulário, track)
   * roda duas vezes. Correção: no efeito, só chamar `close()` se ainda aberto e ignorar o evento
   * `close` quando o fechamento veio da prop (ou tratar `onCancel` + botão sem passar por `close`).
   */
  it('fechar pelo botão chama onClose uma vez só', () => {
    const onClose = vi.fn()
    function Pai() {
      const [open, setOpen] = useState(true)
      return (
        <TooltipProvider>
          <Drawer
            open={open}
            onClose={() => {
              onClose()
              setOpen(false)
            }}
            title="Detalhe"
          >
            <p>conteúdo</p>
          </Drawer>
        </TooltipProvider>
      )
    }
    render(<Pai />)
    fireEvent.click(screen.getByRole('button', { name: t.common.actions.close }))
    expect(dialog().open).toBe(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
