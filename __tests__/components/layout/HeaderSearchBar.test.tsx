/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeaderSearchBar } from '@/components/layout/HeaderSearchBar'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('HeaderSearchBar', () => {
  it('renderiza o input e o botão de lupa', () => {
    render(<HeaderSearchBar />)
    expect(screen.getByRole('textbox', { name: /buscar produtos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
  })

  it('chama router.push com a URL correta ao submeter um termo válido', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: 'parafuso' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).toHaveBeenCalledWith('/produtos?busca=parafuso')
  })

  it('não chama router.push quando o input está vazio', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('não chama router.push quando o input contém apenas espaços', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('limpa o input após submit com valor válido', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i }) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'parafuso' } })
    fireEvent.submit(input.closest('form')!)
    expect(input.value).toBe('')
  })

  it('encoda corretamente termos com caracteres especiais', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: 'parafuso M8 inox' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).toHaveBeenCalledWith('/produtos?busca=parafuso%20M8%20inox')
  })

  it('aplica a prop className ao elemento container', () => {
    const { container } = render(<HeaderSearchBar className="minha-classe-custom" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('minha-classe-custom')
  })

  // Testes da nova prop onSearch

  it('renderiza sem erros quando onSearch não é fornecida (retrocompatibilidade)', () => {
    expect(() => render(<HeaderSearchBar />)).not.toThrow()
  })

  it('renderiza sem erros quando onSearch é uma função mock', () => {
    const onSearch = jest.fn()
    expect(() => render(<HeaderSearchBar onSearch={onSearch} />)).not.toThrow()
  })

  it('chama onSearch exatamente uma vez antes de router.push ao submeter busca válida', () => {
    const onSearch = jest.fn()
    const callOrder: string[] = []
    onSearch.mockImplementation(() => callOrder.push('onSearch'))
    mockPush.mockImplementation(() => callOrder.push('push'))

    render(<HeaderSearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: 'parafuso' } })
    fireEvent.submit(input.closest('form')!)

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledTimes(1)
    // onSearch deve ser chamada antes de router.push
    expect(callOrder).toEqual(['onSearch', 'push'])
  })

  it('não chama onSearch quando o campo está vazio', () => {
    const onSearch = jest.fn()
    render(<HeaderSearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.submit(input.closest('form')!)
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('não chama onSearch quando o campo contém apenas espaços', () => {
    const onSearch = jest.fn()
    render(<HeaderSearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(input.closest('form')!)
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('router.push é chamado com a URL correta após onSearch ser chamada', () => {
    const onSearch = jest.fn()
    render(<HeaderSearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: 'parafuso' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockPush).toHaveBeenCalledWith('/produtos?busca=parafuso')
  })

  it('não chama onSearch ao submeter sem a prop (sem erros de runtime)', () => {
    render(<HeaderSearchBar />)
    const input = screen.getByRole('textbox', { name: /buscar produtos/i })
    fireEvent.change(input, { target: { value: 'parafuso' } })
    // Não deve lançar erro mesmo sem onSearch
    expect(() => fireEvent.submit(input.closest('form')!)).not.toThrow()
    expect(mockPush).toHaveBeenCalledWith('/produtos?busca=parafuso')
  })
})
