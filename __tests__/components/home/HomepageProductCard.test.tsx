/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HomepageProductCard } from '@/components/home/HomepageProductCard'
import type { ProductSummary } from '@/lib/types'

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

const baseProduct: ProductSummary = {
  id: 'prod-1',
  name: 'Parafuso M8 Inox',
  slug: 'parafuso-m8-inox',
  price: 49.9,
  images: ['https://example.com/parafuso.jpg'],
  badge: null,
  category: { name: 'Parafusos', slug: 'parafusos' },
  featured: false,
  showPrice: true,
}

const WHATSAPP_NUMBER = '11999999999'

describe('HomepageProductCard', () => {
  describe('Badge', () => {
    it('exibe badge no canto superior esquerdo quando product.badge está preenchido', () => {
      const product = { ...baseProduct, badge: 'Mais Vendido' }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.getByText('Mais Vendido')).toBeInTheDocument()
    })

    it('não renderiza badge quando product.badge é null', () => {
      const product = { ...baseProduct, badge: null }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.queryByText('Mais Vendido')).not.toBeInTheDocument()
    })
  })

  describe('Preço condicional', () => {
    it('exibe preço formatado em BRL quando showPrice=true e price não é null', () => {
      const product = { ...baseProduct, showPrice: true, price: 49.9 }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.getByText(/49,90/)).toBeInTheDocument()
    })

    it('não renderiza preço quando showPrice=false', () => {
      const product = { ...baseProduct, showPrice: false, price: 49.9 }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
    })

    it('não renderiza preço quando showPrice=true mas price é null', () => {
      const product = { ...baseProduct, showPrice: true, price: null }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.queryByText(/R\$/)).not.toBeInTheDocument()
    })
  })

  describe('Link WhatsApp', () => {
    it('href do link WhatsApp contém wa.me/55 seguido do número', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      expect(link).toHaveAttribute('href', expect.stringContaining(`wa.me/55${WHATSAPP_NUMBER}`))
    })

    it('href do link WhatsApp contém o nome do produto encodado', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      const href = link.getAttribute('href') ?? ''
      expect(href).toContain(encodeURIComponent(baseProduct.name))
    })

    it('link WhatsApp tem target="_blank"', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('link WhatsApp tem rel="noopener"', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /whatsapp/i })
      expect(link).toHaveAttribute('rel', 'noopener')
    })
  })

  describe('Link Ver detalhes', () => {
    it('link "Ver detalhes" aponta para /produtos/<slug>', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const link = screen.getByRole('link', { name: /ver detalhes/i })
      expect(link).toHaveAttribute('href', `/produtos/${baseProduct.slug}`)
    })
  })

  describe('Imagem', () => {
    it('renderiza imagem com loading=lazy quando images[0] existe', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      const img = screen.getByRole('img', { name: baseProduct.name })
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('src', 'https://example.com/parafuso.jpg')
    })

    it('renderiza placeholder quando product.images é vazio (sem crash)', () => {
      const product = { ...baseProduct, images: [] }
      expect(() =>
        render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />),
      ).not.toThrow()
    })

    it('renderiza nome do produto mesmo sem imagem', () => {
      const product = { ...baseProduct, images: [] }
      render(<HomepageProductCard product={product} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.getByText(baseProduct.name)).toBeInTheDocument()
    })
  })

  describe('Estrutura geral', () => {
    it('renderiza o card com data-testid correto', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(
        screen.getByTestId(`homepage-product-card-${baseProduct.slug}`),
      ).toBeInTheDocument()
    })

    it('renderiza o nome do produto', () => {
      render(<HomepageProductCard product={baseProduct} whatsappNumber={WHATSAPP_NUMBER} />)
      expect(screen.getByText(baseProduct.name)).toBeInTheDocument()
    })
  })
})
