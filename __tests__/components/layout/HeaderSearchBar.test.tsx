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

  it('aplica a prop className ao elemento form', () => {
    const { container } = render(<HeaderSearchBar className="minha-classe-custom" />)
    const form = container.querySelector('form')
    expect(form).toHaveClass('minha-classe-custom')
  })
})
