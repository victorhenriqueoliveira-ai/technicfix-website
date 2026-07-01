/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

const categories = [
  { name: 'Parafusos', slug: 'parafusos' },
  { name: 'Porcas', slug: 'porcas' },
  { name: 'Arruelas', slug: 'arruelas' },
]

describe('CategoryFilter', () => {
  it('renderiza o link "Todos"', () => {
    render(<CategoryFilter categories={categories} />)
    expect(screen.getByTestId('filtro-todos')).toBeInTheDocument()
    expect(screen.getByTestId('filtro-todos')).toHaveTextContent('Todos')
  })

  it('renderiza todos os links de categoria', () => {
    render(<CategoryFilter categories={categories} />)
    expect(screen.getByTestId('filtro-parafusos')).toHaveTextContent('Parafusos')
    expect(screen.getByTestId('filtro-porcas')).toHaveTextContent('Porcas')
    expect(screen.getByTestId('filtro-arruelas')).toHaveTextContent('Arruelas')
  })

  it('marca "Todos" como ativo quando nenhum activeSlug é fornecido', () => {
    render(<CategoryFilter categories={categories} />)
    const todosLink = screen.getByTestId('filtro-todos')
    expect(todosLink).toHaveAttribute('aria-current', 'page')
    // categorias não devem ter aria-current
    expect(screen.getByTestId('filtro-parafusos')).not.toHaveAttribute('aria-current')
  })

  it('marca a categoria ativa com aria-current="page" quando activeSlug é fornecido', () => {
    render(<CategoryFilter categories={categories} activeSlug="porcas" />)
    expect(screen.getByTestId('filtro-porcas')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('filtro-todos')).not.toHaveAttribute('aria-current')
    expect(screen.getByTestId('filtro-parafusos')).not.toHaveAttribute('aria-current')
  })

  it('os links apontam para a URL correta com query param ?categoria=', () => {
    render(<CategoryFilter categories={categories} activeSlug="parafusos" />)
    expect(screen.getByTestId('filtro-parafusos')).toHaveAttribute(
      'href',
      '/produtos?categoria=parafusos',
    )
    expect(screen.getByTestId('filtro-todos')).toHaveAttribute('href', '/produtos')
  })

  it('lista vazia de categorias renderiza apenas o link "Todos"', () => {
    render(<CategoryFilter categories={[]} />)
    expect(screen.getByTestId('filtro-todos')).toBeInTheDocument()
    expect(screen.queryByTestId('filtro-parafusos')).not.toBeInTheDocument()
  })
})
