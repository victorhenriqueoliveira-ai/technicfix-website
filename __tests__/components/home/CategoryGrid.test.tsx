/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import type { CategoryData } from '@/components/home/CategoryGrid'

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

// Mock next/image — filtra props exclusivas do Next.js para evitar warnings no DOM
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    fill: _fill,
    unoptimized: _unoptimized,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    unoptimized?: boolean
    [key: string]: unknown
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  }
  MockImage.displayName = 'MockImage'
  return MockImage
})

const mockCategories: CategoryData[] = [
  { id: '1', name: 'Parafusos', slug: 'parafusos', imageUrl: null },
  { id: '2', name: 'Porcas', slug: 'porcas', imageUrl: 'https://example.com/porcas.jpg' },
  { id: '3', name: 'Arruelas', slug: 'arruelas', imageUrl: null },
]

describe('CategoryGrid', () => {
  it('renderiza um card por categoria recebida como prop', () => {
    render(<CategoryGrid categories={mockCategories} />)
    const grid = screen.getByTestId('category-grid')
    expect(grid.children).toHaveLength(3)
  })

  it('renderiza o nome de cada categoria', () => {
    render(<CategoryGrid categories={mockCategories} />)
    expect(screen.getByText('Parafusos')).toBeInTheDocument()
    expect(screen.getByText('Porcas')).toBeInTheDocument()
    expect(screen.getByText('Arruelas')).toBeInTheDocument()
  })

  it('cada card linka para /categorias/[slug] correto', () => {
    render(<CategoryGrid categories={mockCategories} />)
    const link = screen.getByTestId('category-card-parafusos')
    expect(link).toHaveAttribute('href', '/categorias/parafusos')
  })

  it('renderiza placeholder com inicial quando não há imagem', () => {
    render(<CategoryGrid categories={[{ id: '1', name: 'Parafusos', slug: 'parafusos', imageUrl: null }]} />)
    // Deve exibir a inicial da categoria como placeholder
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('renderiza imagem quando imageUrl está disponível', () => {
    render(<CategoryGrid categories={[{ id: '2', name: 'Porcas', slug: 'porcas', imageUrl: 'https://example.com/porcas.jpg' }]} />)
    const img = screen.getByAltText('Porcas')
    expect(img).toBeInTheDocument()
  })

  it('não renderiza nada quando a lista de categorias está vazia', () => {
    const { container } = render(<CategoryGrid categories={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza o título da seção', () => {
    render(<CategoryGrid categories={mockCategories} />)
    expect(screen.getByText('Categorias')).toBeInTheDocument()
  })
})
