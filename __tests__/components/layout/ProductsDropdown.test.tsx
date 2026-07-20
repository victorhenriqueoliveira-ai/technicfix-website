/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductsDropdown } from '@/components/layout/ProductsDropdown'
import { ProductNavItem } from '@/lib/types'

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

// ---- Helpers ----

function makeProduct(name: string, slug: string): ProductNavItem {
  return { name, slug }
}

const produto1 = makeProduct('Parafuso Sextavado', 'parafuso-sextavado')
const produto2 = makeProduct('Porca Hexagonal', 'porca-hexagonal')
const produto3 = makeProduct('Arruela Lisa', 'arruela-lisa')

const tresProducts: ProductNavItem[] = [produto1, produto2, produto3]

// Gera 30 produtos
const trintaProducts: ProductNavItem[] = Array.from({ length: 30 }, (_, i) => ({
  name: `Produto ${i + 1}`,
  slug: `produto-${i + 1}`,
}))

// ---- Testes unitários ----

describe('ProductsDropdown — renderização', () => {
  it('com products=[] renderiza apenas o link "Ver todos os produtos"', () => {
    render(<ProductsDropdown products={[]} />)

    // Abre o dropdown
    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    // Só o link "Ver todos os produtos" deve aparecer
    const verTodos = screen.getByTestId('ver-todos-link')
    expect(verTodos).toBeInTheDocument()

    // Nenhum outro menuitem além do "Ver todos"
    const menuitems = screen.getAllByRole('menuitem')
    expect(menuitems).toHaveLength(1)
    expect(menuitems[0]).toHaveAttribute('href', '/produtos')
  })

  it('com 3 produtos renderiza 3 links de produto + link "Ver todos os produtos" (total 4 links)', () => {
    render(<ProductsDropdown products={tresProducts} />)

    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    const menuitems = screen.getAllByRole('menuitem')
    expect(menuitems).toHaveLength(4)

    expect(screen.getByText('Parafuso Sextavado')).toBeInTheDocument()
    expect(screen.getByText('Porca Hexagonal')).toBeInTheDocument()
    expect(screen.getByText('Arruela Lisa')).toBeInTheDocument()
    expect(screen.getByTestId('ver-todos-link')).toBeInTheDocument()
  })

  it('com 30 produtos renderiza 30 links de produto + link "Ver todos os produtos"', () => {
    render(<ProductsDropdown products={trintaProducts} />)

    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    const menuitems = screen.getAllByRole('menuitem')
    expect(menuitems).toHaveLength(31) // 30 produtos + 1 "Ver todos"
  })

  it('link "Ver todos os produtos" sempre aponta para /produtos', () => {
    render(<ProductsDropdown products={tresProducts} />)

    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    const verTodos = screen.getByTestId('ver-todos-link')
    expect(verTodos).toHaveAttribute('href', '/produtos')
  })

  it('link do primeiro produto aponta para /produtos/[slug] correto', () => {
    render(<ProductsDropdown products={tresProducts} />)

    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    const linkPrimeiro = screen.getByRole('menuitem', { name: /parafuso sextavado/i })
    expect(linkPrimeiro).toHaveAttribute('href', '/produtos/parafuso-sextavado')
  })
})

describe('ProductsDropdown — comportamento de hover', () => {
  it('dropdown não é visível por padrão (estado inicial isOpen = false)', () => {
    render(<ProductsDropdown products={tresProducts} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('onMouseEnter no elemento raiz abre o dropdown (isOpen = true)', () => {
    render(<ProductsDropdown products={tresProducts} />)

    const root = screen.getByTestId('products-dropdown-root')
    fireEvent.mouseEnter(root)

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('onMouseLeave no elemento raiz fecha o dropdown (isOpen = false)', () => {
    render(<ProductsDropdown products={tresProducts} />)

    const root = screen.getByTestId('products-dropdown-root')

    // Abre
    fireEvent.mouseEnter(root)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Fecha
    fireEvent.mouseLeave(root)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('ProductsDropdown — integração em Header mockado', () => {
  it('inserido em um Header mockado renderiza sem erro', () => {
    const MockHeader = () => (
      <header>
        <nav>
          <ProductsDropdown products={tresProducts} />
        </nav>
      </header>
    )

    render(<MockHeader />)

    // O componente raiz deve estar no DOM
    expect(screen.getByTestId('products-dropdown-root')).toBeInTheDocument()
  })
})
