/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryProductSection } from '@/components/home/CategoryProductSection'
import type { CategoryWithProducts } from '@/lib/types'

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    fill,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    [key: string]: unknown
  }) => {
    void fill
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
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

// Mock HomepageProductCard
jest.mock('@/components/home/HomepageProductCard', () => ({
  HomepageProductCard: ({
    product,
    whatsappNumber,
  }: {
    product: { id: string; name: string; slug: string }
    whatsappNumber: string
  }) => (
    <div
      data-testid={`homepage-product-card-${product.slug}`}
      data-whatsapp={whatsappNumber}
    >
      {product.name}
    </div>
  ),
}))

const makeProduct = (id: string) => ({
  id,
  name: `Produto ${id}`,
  slug: `produto-${id}`,
  price: 10.0,
  images: [],
  badge: null,
  category: { name: 'Parafusos', slug: 'parafusos' },
  featured: false,
  showPrice: true,
})

const WHATSAPP_NUMBER = '11999999999'

const baseCategory: CategoryWithProducts = {
  id: 'cat-1',
  name: 'Parafusos',
  slug: 'parafusos',
  products: [makeProduct('1'), makeProduct('2'), makeProduct('3'), makeProduct('4')],
}

describe('CategoryProductSection', () => {
  describe('Guard de vazio', () => {
    it('retorna null quando category.products está vazio', () => {
      const emptyCategory: CategoryWithProducts = { ...baseCategory, products: [] }
      const { container } = render(
        <CategoryProductSection category={emptyCategory} whatsappNumber={WHATSAPP_NUMBER} />,
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Título da seção', () => {
    it('exibe o nome da categoria no título H2', () => {
      render(<CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Parafusos')
    })

    it('barra decorativa amber está presente no header', () => {
      const { container } = render(
        <CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />,
      )
      const amberBar = container.querySelector('.bg-brand-amber.w-1.h-6')
      expect(amberBar).toBeInTheDocument()
    })
  })

  describe('Grid de produtos', () => {
    it('renderiza 4 instâncias de HomepageProductCard quando há 4 produtos', () => {
      render(<CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />)
      const cards = screen.getAllByTestId(/homepage-product-card-/)
      expect(cards).toHaveLength(4)
    })

    it('grid tem classes responsive corretas', () => {
      const { container } = render(
        <CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />,
      )
      const grid = container.querySelector('.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-4')
      expect(grid).toBeInTheDocument()
    })

    it('passa whatsappNumber corretamente para cada HomepageProductCard', () => {
      render(<CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />)
      const cards = screen.getAllByTestId(/homepage-product-card-/)
      cards.forEach(card => {
        expect(card).toHaveAttribute('data-whatsapp', WHATSAPP_NUMBER)
      })
    })
  })

  describe('Link Ver todos', () => {
    it('exibe link "Ver todos" com href correto apontando para /produtos?categoria=<slug>', () => {
      render(<CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /ver todos em parafusos/i })
      expect(link).toHaveAttribute('href', `/produtos?categoria=${baseCategory.slug}`)
    })

    it('link "Ver todos" contém o nome da categoria', () => {
      render(<CategoryProductSection category={baseCategory} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /ver todos em parafusos/i })
      expect(link).toHaveTextContent(`Ver todos em ${baseCategory.name}`)
    })
  })

  describe('Integração — múltiplas seções', () => {
    it('apenas categorias com produtos são renderizadas', () => {
      const catComProdutos: CategoryWithProducts = {
        id: 'cat-2',
        name: 'Porcas',
        slug: 'porcas',
        products: [makeProduct('p1')],
      }
      const catSemProdutos: CategoryWithProducts = {
        id: 'cat-3',
        name: 'Arruelas',
        slug: 'arruelas',
        products: [],
      }

      render(
        <>
          <CategoryProductSection category={catComProdutos} whatsappNumber={WHATSAPP_NUMBER} />
          <CategoryProductSection category={catSemProdutos} whatsappNumber={WHATSAPP_NUMBER} />
        </>,
      )

      expect(screen.getByRole('heading', { name: /porcas/i })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /arruelas/i })).not.toBeInTheDocument()
    })
  })
})
