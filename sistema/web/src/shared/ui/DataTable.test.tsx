import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { usePrefs } from '@/shared/prefs/prefs.store'
import { getDictionary } from '@/shared/i18n'
import { DataTable, type Column, type SortState } from './DataTable'

type Row = { id: string; nome: string; valor: number }

const rows: Row[] = [
  { id: '1', nome: 'Beta', valor: 20 },
  { id: '2', nome: 'Alfa', valor: 300 },
  { id: '3', nome: 'Gama', valor: 1 },
]

const columns: Column<Row>[] = [
  { key: 'nome', header: 'Nome', sortValue: (r) => r.nome },
  { key: 'valor', header: 'Valor', sortValue: (r) => r.valor },
  { key: 'acoes', header: 'Ações', hideHeader: true, cell: () => '…' },
]

const t = getDictionary('pt-BR')

/** Primeira célula de cada linha do corpo, na ordem em que aparece. */
const firstColumn = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((tr) => within(tr).getAllByRole('cell')[0]?.textContent)

const header = (name: string) => screen.getByRole('columnheader', { name: new RegExp(name) })
const sortButton = (name: string) => screen.getByRole('button', { name: `Ordenar por ${name}` })

beforeEach(() => {
  usePrefs.setState({ locale: 'pt-BR' })
})

describe('DataTable', () => {
  it('modo local: ciclo asc → desc → sem ordenação, com aria-sort', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    expect(firstColumn()).toEqual(['Beta', 'Alfa', 'Gama'])
    expect(header('Nome')).not.toHaveAttribute('aria-sort')

    fireEvent.click(sortButton('Nome'))
    expect(firstColumn()).toEqual(['Alfa', 'Beta', 'Gama'])
    expect(header('Nome')).toHaveAttribute('aria-sort', 'ascending')

    fireEvent.click(sortButton('Nome'))
    expect(firstColumn()).toEqual(['Gama', 'Beta', 'Alfa'])
    expect(header('Nome')).toHaveAttribute('aria-sort', 'descending')

    fireEvent.click(sortButton('Nome'))
    expect(firstColumn()).toEqual(['Beta', 'Alfa', 'Gama'])
    expect(header('Nome')).not.toHaveAttribute('aria-sort')
  })

  it('ordena número como número (não como texto)', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    fireEvent.click(sortButton('Valor'))
    expect(firstColumn()).toEqual(['Gama', 'Beta', 'Alfa'])
    expect(header('Valor')).toHaveAttribute('aria-sort', 'ascending')
    expect(header('Nome')).not.toHaveAttribute('aria-sort')
  })

  it('defaultSort aplica a ordenação inicial', () => {
    render(
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} defaultSort={{ key: 'valor', order: 'desc' }} />,
    )
    expect(firstColumn()).toEqual(['Alfa', 'Beta', 'Gama'])
  })

  it('coluna sem sortValue nem sortable não tem botão de ordenar', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    expect(screen.queryByRole('button', { name: /Ações/ })).not.toBeInTheDocument()
  })

  it('modo controlado: avisa onSortChange e não reordena as linhas', () => {
    const onSortChange = vi.fn<(s: SortState) => void>()
    const serverCols: Column<Row>[] = [
      { key: 'nome', header: 'Nome', sortable: true },
      { key: 'valor', header: 'Valor' },
    ]
    const { rerender } = render(
      <DataTable columns={serverCols} rows={rows} rowKey={(r) => r.id} sort={null} onSortChange={onSortChange} />,
    )
    fireEvent.click(sortButton('Nome'))
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'nome', order: 'asc' })
    expect(firstColumn()).toEqual(['Beta', 'Alfa', 'Gama'])
    // sem o pai atualizar `sort`, a tabela continua sem ordenação
    expect(header('Nome')).not.toHaveAttribute('aria-sort')

    rerender(
      <DataTable
        columns={serverCols}
        rows={rows}
        rowKey={(r) => r.id}
        sort={{ key: 'nome', order: 'asc' }}
        onSortChange={onSortChange}
      />,
    )
    expect(header('Nome')).toHaveAttribute('aria-sort', 'ascending')
    expect(firstColumn()).toEqual(['Beta', 'Alfa', 'Gama'])

    fireEvent.click(sortButton('Nome'))
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'nome', order: 'desc' })

    rerender(
      <DataTable
        columns={serverCols}
        rows={rows}
        rowKey={(r) => r.id}
        sort={{ key: 'nome', order: 'desc' }}
        onSortChange={onSortChange}
      />,
    )
    fireEvent.click(sortButton('Nome'))
    expect(onSortChange).toHaveBeenLastCalledWith(null)
  })

  it('error mostra o ErrorState (com tentar de novo) e esconde o vazio e as linhas', () => {
    const onRetry = vi.fn()
    render(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} error onRetry={onRetry} loading />)
    expect(screen.getByRole('alert')).toHaveTextContent(t.common.errors.loadTitle)
    expect(screen.queryByText(t.common.table.empty)).not.toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: t.common.actions.retry }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('sem linhas mostra o estado vazio traduzido (ou o que a tela passou)', () => {
    const { rerender } = render(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} />)
    expect(screen.getByText(t.common.table.empty)).toBeInTheDocument()
    rerender(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} empty={{ title: 'Nenhum cliente' }} />)
    expect(screen.getByText('Nenhum cliente')).toBeInTheDocument()
  })

  it('carregando mostra skeleton e não o vazio', () => {
    render(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} loading skeletonRows={4} />)
    expect(screen.getAllByRole('row')).toHaveLength(5)
    expect(screen.queryByText(t.common.table.empty)).not.toBeInTheDocument()
  })

  it('linha clicável é focável e responde a clique e Enter', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} onRowClick={onRowClick} />)
    const linha = screen.getAllByRole('row')[2]!
    expect(linha).toHaveAttribute('tabindex', '0')

    fireEvent.keyDown(linha, { key: 'Enter' })
    expect(onRowClick).toHaveBeenLastCalledWith(rows[1])
    fireEvent.keyDown(linha, { key: 'a' })
    expect(onRowClick).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getAllByRole('row')[1]!)
    expect(onRowClick).toHaveBeenLastCalledWith(rows[0])
  })

  it('sem onRowClick a linha não entra na ordem de tab', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    expect(screen.getAllByRole('row')[1]).not.toHaveAttribute('tabindex')
  })

  it('hideHeader deixa o rótulo só para leitor de tela', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    const th = screen.getByRole('columnheader', { name: 'Ações' })
    const label = within(th).getByText('Ações')
    expect(label).toHaveClass('sr-only')
  })
})
