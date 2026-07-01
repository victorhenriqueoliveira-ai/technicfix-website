/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import type { ProductSummary } from '@/lib/types'

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

const mockProducts: ProductSummary[] = [
  {
    id: '1',
    name: 'Parafuso Sextavado M8',
    slug: 'parafuso-sextavado-m8',
    price: 2.5,
    images: ['https://example.com/parafuso.jpg'],
    category: { name: 'Parafusos', slug: 'parafusos' },
    featured: true,
  },
  {
    id: '2',
    name: 'Porca Hexagonal M10',
    slug: 'porca-hexagonal-m10',
    price: null,
    images: [],
    category: { name: 'Porcas', slug: 'porcas' },
    featured: true,
  },
]

describe('FeaturedProducts', () => {
  it('nao renderiza secao quando a lista de produtos esta vazia', () => {
    const { container } = render(<FeaturedProducts products={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza a secao quando ha produtos', () => {
    render(<FeaturedProducts products={mockProducts} />)
    expect(screen.getByTestId('featured-products-section')).toBeInTheDocument()
  })

  it('renderiza o titulo Produtos em Destaque', () => {
    render(<FeaturedProducts products={mockProducts} />)
    expect(screen.getByText('Produtos em Destaque')).toBeInTheDocument()
  })

  it('renderiza um card por produto recebido', () => {
    render(<FeaturedProducts products={mockProducts} />)
    expect(screen.getByTestId('product-card-parafuso-sextavado-m8')).toBeInTheDocument()
    expect(screen.getByTestId('product-card-porca-hexagonal-m10')).toBeInTheDocument()
  })

  it('renderiza o nome de cada produto', () => {
    render(<FeaturedProducts products={mockProducts} />)
    expect(screen.getByText('Parafuso Sextavado M8')).toBeInTheDocument()
    expect(screen.getByText('Porca Hexagonal M10')).toBeInTheDocument()
  })

  it('exibe o preco formatado quando disponivel', () => {
    render(<FeaturedProducts products={mockProducts} />)
    // Regex flexivel: Intl.NumberFormat pode usar espaco nao-quebrado entre "R$" e o valor
    expect(screen.getByText(/2,50/)).toBeInTheDocument()
  })

  it('nao exibe preco quando price e null', () => {
    render(<FeaturedProducts products={[mockProducts[1]]} />)
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
  })

  it('cada card linka para /produtos/[slug]', () => {
    render(<FeaturedProducts products={[mockProducts[0]]} />)
    const card = screen.getByTestId('product-card-parafuso-sextavado-m8')
    expect(card).toHaveAttribute('href', '/produtos/parafuso-sextavado-m8')
  })

  it('exibe placeholder quando produto nao tem imagem', () => {
    render(<FeaturedProducts products={[mockProducts[1]]} />)
    expect(screen.getByText('📦')).toBeInTheDocument()
  })
})
