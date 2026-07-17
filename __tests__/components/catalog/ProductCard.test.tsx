/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductCard } from '@/components/catalog/ProductCard'
import type { ProductSummary } from '@/lib/types'

// Mocks dos modais de lead para evitar importação transitiva do Prisma no jsdom
jest.mock('@/components/leads/LeadVarejoModal', () => ({
  LeadVarejoModal: () => null,
}))
jest.mock('@/components/leads/LeadAtacadoModal', () => ({
  LeadAtacadoModal: () => null,
}))

// Mock next/image
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
  }) => <img src={src} alt={alt} {...props} />
  MockImage.displayName = 'MockImage'
  return MockImage
})

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

const mockProduct: ProductSummary = {
  id: 'prod-1',
  name: 'Parafuso M8 Inox',
  slug: 'parafuso-m8-inox',
  price: 12.5,
  images: ['https://example.com/parafuso.jpg'],
  badge: null,
  category: { name: 'Parafusos', slug: 'parafusos' },
  featured: false,
  showPrice: true,
}

describe('ProductCard', () => {
  it('renderiza o nome do produto', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Parafuso M8 Inox')).toBeInTheDocument()
  })

  it('renderiza o badge de categoria', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByTestId('categoria-badge')).toHaveTextContent('Parafusos')
  })

  it('renderiza dois botões de CTA', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByTestId('cta-interesse')).toBeInTheDocument()
    expect(screen.getByTestId('cta-orcamento')).toBeInTheDocument()
    expect(screen.getByTestId('cta-interesse')).toHaveTextContent('Tenho interesse')
    expect(screen.getByTestId('cta-orcamento')).toHaveTextContent('Solicitar orçamento')
  })

  it('renderiza o preço formatado em BRL quando disponível', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/R\$/)).toBeInTheDocument()
  })

  it('não renderiza preço quando price é null', () => {
    const product = { ...mockProduct, price: null }
    render(<ProductCard product={product} />)
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
  })

  it('renderiza ProductImagePlaceholder quando não há imagem', () => {
    const product = { ...mockProduct, images: [] }
    render(<ProductCard product={product} />)
    expect(screen.getByTestId('product-image-placeholder')).toBeInTheDocument()
  })

  it('renderiza next/image com src correto quando images[0] existe', () => {
    render(<ProductCard product={mockProduct} />)
    const img = screen.getByRole('img', { name: mockProduct.name })
    expect(img).toHaveAttribute('src', 'https://example.com/parafuso.jpg')
  })

  it('renderiza ProductImagePlaceholder quando URL de imagem é inválida', () => {
    const product = { ...mockProduct, images: ['nao-e-url'] }
    render(<ProductCard product={product} />)
    expect(screen.getByTestId('product-image-placeholder')).toBeInTheDocument()
  })

  it('link do produto aponta para /produtos/slug', () => {
    render(<ProductCard product={mockProduct} />)
    const links = screen.getAllByRole('link')
    const produtoLinks = links.filter((l) =>
      l.getAttribute('href')?.includes('/produtos/parafuso-m8-inox'),
    )
    expect(produtoLinks.length).toBeGreaterThan(0)
  })

  it('link da categoria aponta para /produtos?categoria=slug', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByTestId('categoria-badge')).toHaveAttribute(
      'href',
      '/produtos?categoria=parafusos',
    )
  })
})
