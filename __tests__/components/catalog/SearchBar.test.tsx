/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchBar } from '@/components/catalog/SearchBar'

// Valores controlados pelos mocks
let mockReplace = jest.fn()
let mockPathname = '/produtos'
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  SearchIcon: () => <svg data-testid="search-icon" />,
}))

beforeEach(() => {
  mockReplace = jest.fn()
  mockPathname = '/produtos'
  mockSearchParams = new URLSearchParams()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('SearchBar', () => {
  it('renderiza o input de busca', () => {
    render(<SearchBar />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })

  it('usa o placeholder padrão', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText('Buscar produtos...')).toBeInTheDocument()
  })

  it('aceita placeholder personalizado', () => {
    render(<SearchBar placeholder="Digite aqui..." />)
    expect(screen.getByPlaceholderText('Digite aqui...')).toBeInTheDocument()
  })

  it('chama router.replace com ?busca= após debounce de 300ms', () => {
    render(<SearchBar />)
    const input = screen.getByTestId('search-input')

    fireEvent.change(input, { target: { value: 'inox' } })

    // Antes do debounce, não deve ter chamado
    expect(mockReplace).not.toHaveBeenCalled()

    // Avança o timer para disparar o debounce
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockReplace).toHaveBeenCalledWith('/produtos?busca=inox')
  })

  it('remove ?busca= da URL quando o input é limpo', () => {
    mockSearchParams = new URLSearchParams('busca=inox')
    render(<SearchBar />)
    const input = screen.getByTestId('search-input')

    fireEvent.change(input, { target: { value: '' } })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    // replace deve ser chamado sem o param busca
    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('busca=')
  })

  it('mantém outros query params ao buscar', () => {
    mockSearchParams = new URLSearchParams('categoria=parafusos')
    render(<SearchBar />)
    const input = screen.getByTestId('search-input')

    fireEvent.change(input, { target: { value: 'inox' } })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockReplace).toHaveBeenCalledWith('/produtos?categoria=parafusos&busca=inox')
  })

  it('remove page da URL ao buscar (reinicia paginação)', () => {
    mockSearchParams = new URLSearchParams('page=3')
    render(<SearchBar />)
    const input = screen.getByTestId('search-input')

    fireEvent.change(input, { target: { value: 'x' } })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    const calledUrl = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('page=')
  })
})
