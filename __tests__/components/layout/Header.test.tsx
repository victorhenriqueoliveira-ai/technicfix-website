/**
 * @jest-environment jsdom
 *
 * Testes unitários e de integração para components/layout/Header.tsx
 * Header é um Server Component async — testado renderizando o JSX retornado.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// ─── Mocks de infra ─────────────────────────────────────────────────────────

jest.mock('@/lib/nav-data', () => ({
  getCategoriesForNav: jest.fn(),
  getProductsForNav: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  db: {
    category: { findMany: jest.fn() },
    product: { findMany: jest.fn() },
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}))

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

jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// ─── Imports após mocks ──────────────────────────────────────────────────────

import { Header } from '@/components/layout/Header'
import { getCategoriesForNav, getProductsForNav } from '@/lib/nav-data'
import type { CategorySummary, ProductNavItem } from '@/lib/types'

const mockGetCategories = getCategoriesForNav as jest.MockedFunction<typeof getCategoriesForNav>
const mockGetProducts = getProductsForNav as jest.MockedFunction<typeof getProductsForNav>

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeCategory(overrides: Partial<CategorySummary> = {}): CategorySummary {
  return {
    id: overrides.id ?? 'cat-1',
    name: overrides.name ?? 'Categoria 1',
    slug: overrides.slug ?? 'categoria-1',
    imageUrl: overrides.imageUrl ?? null,
    children: overrides.children ?? [],
  }
}

function makeProduct(overrides: Partial<ProductNavItem> = {}): ProductNavItem {
  return {
    name: overrides.name ?? 'Produto 1',
    slug: overrides.slug ?? 'produto-1',
  }
}

/** Renderiza o Header async e retorna o resultado do render. */
async function renderHeader() {
  const jsx = await Header()
  return render(jsx as React.ReactElement)
}

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks()
  mockGetCategories.mockResolvedValue([])
  mockGetProducts.mockResolvedValue([])
})

// ─── Testes unitários ────────────────────────────────────────────────────────

describe('Header — Server Component async', () => {
  describe('Fetch de dados', () => {
    it('chama getCategoriesForNav uma vez no render', async () => {
      await renderHeader()
      expect(mockGetCategories).toHaveBeenCalledTimes(1)
    })

    it('chama getProductsForNav uma vez no render', async () => {
      await renderHeader()
      expect(mockGetProducts).toHaveBeenCalledTimes(1)
    })

    it('renderiza sem erros com arrays vazios de categorias e produtos', async () => {
      mockGetCategories.mockResolvedValueOnce([])
      mockGetProducts.mockResolvedValueOnce([])

      await expect(renderHeader()).resolves.toBeDefined()
    })

    it('renderiza sem erros com 5 categorias e 10 produtos', async () => {
      const categories = Array.from({ length: 5 }, (_, i) =>
        makeCategory({ id: `cat-${i}`, name: `Categoria ${i}`, slug: `categoria-${i}` }),
      )
      const products = Array.from({ length: 10 }, (_, i) =>
        makeProduct({ name: `Produto ${i}`, slug: `produto-${i}` }),
      )
      mockGetCategories.mockResolvedValueOnce(categories)
      mockGetProducts.mockResolvedValueOnce(products)

      await expect(renderHeader()).resolves.toBeDefined()
    })
  })

  describe('Estrutura geral', () => {
    it('renderiza o elemento <header> com classes sticky top-0 z-40', async () => {
      const { container } = await renderHeader()
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-40')
    })

    it('renderiza sem crash', async () => {
      await expect(renderHeader()).resolves.toBeDefined()
    })
  })

  describe('TopBar — Camada 1', () => {
    it('exibe texto de atendimento via WhatsApp', async () => {
      await renderHeader()
      expect(screen.getByText(/Atendimento via WhatsApp/i)).toBeInTheDocument()
    })

    it('TopBar tem classe hidden md:block (oculto no mobile)', async () => {
      await renderHeader()
      const topBar = screen.getByText(/Atendimento via WhatsApp/i).closest('div')
      expect(topBar).toHaveClass('hidden', 'md:block')
    })
  })

  describe('MainBar — Camada 2', () => {
    it('renderiza o logo TechnicFix com link para /', async () => {
      await renderHeader()
      const logoLink = screen.getAllByRole('link').find((el) => el.getAttribute('href') === '/')
      expect(logoLink).toBeInTheDocument()
    })

    it('MainBar contém HeaderSearchBar (input de busca)', async () => {
      await renderHeader()
      const searchInput = screen.getByPlaceholderText('Buscar produtos...')
      expect(searchInput).toBeInTheDocument()
    })

    it('MainBar contém link WhatsApp com data-testid whatsapp-cta', async () => {
      await renderHeader()
      const whatsappLink = screen.getByTestId('whatsapp-cta')
      expect(whatsappLink).toBeInTheDocument()
      const href = whatsappLink.getAttribute('href') ?? ''
      expect(href === '/contato' || href.includes('wa.me')).toBe(true)
    })
  })

  describe('ProductsDropdown — presente na DOM', () => {
    it('ProductsDropdown está presente (data-testid products-dropdown-root)', async () => {
      mockGetProducts.mockResolvedValueOnce([
        makeProduct({ name: 'Parafuso', slug: 'parafuso' }),
      ])
      await renderHeader()
      expect(screen.getByTestId('products-dropdown-root')).toBeInTheDocument()
    })

    it('ProductsDropdown está presente mesmo com lista vazia de produtos', async () => {
      mockGetProducts.mockResolvedValueOnce([])
      await renderHeader()
      expect(screen.getByTestId('products-dropdown-root')).toBeInTheDocument()
    })
  })

  describe('MobileMenu — presente na DOM', () => {
    it('MobileMenu está presente (data-testid mobile-menu)', async () => {
      await renderHeader()
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    })

    it('MobileMenu está presente mesmo com categorias e produtos vazios', async () => {
      mockGetCategories.mockResolvedValueOnce([])
      mockGetProducts.mockResolvedValueOnce([])
      await renderHeader()
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    })
  })

  describe('CategoryNav — Camada 3 desktop', () => {
    it('CategoryNav está presente na DOM (nav aria-label Categorias de produtos)', async () => {
      mockGetCategories.mockResolvedValueOnce([
        makeCategory({ id: 'c1', name: 'Fixadores', slug: 'fixadores' }),
      ])
      await renderHeader()
      expect(
        screen.getByRole('navigation', { name: /Categorias de produtos/i }),
      ).toBeInTheDocument()
    })

    it('CategoryNav renderiza sem crash com lista vazia', async () => {
      mockGetCategories.mockResolvedValueOnce([])
      await expect(renderHeader()).resolves.toBeDefined()
    })
  })
})

// ─── Testes de integração ────────────────────────────────────────────────────

describe('Header — Integração', () => {
  it('Promise.all de getCategoriesForNav e getProductsForNav resolve corretamente com dados mockados', async () => {
    const categories = [makeCategory({ id: 'int-cat', name: 'Integração Cat', slug: 'int-cat' })]
    const products = [makeProduct({ name: 'Integração Prod', slug: 'int-prod' })]

    mockGetCategories.mockResolvedValueOnce(categories)
    mockGetProducts.mockResolvedValueOnce(products)

    await renderHeader()

    expect(mockGetCategories).toHaveBeenCalledTimes(1)
    expect(mockGetProducts).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    expect(screen.getByTestId('products-dropdown-root')).toBeInTheDocument()
  })

  it('Header renderiza sem erro de runtime com MobileMenu, ProductsDropdown e CategoryNav integrados', async () => {
    const categories = [
      makeCategory({ id: 'c1', name: 'Parafusos', slug: 'parafusos' }),
      makeCategory({ id: 'c2', name: 'Porcas', slug: 'porcas' }),
    ]
    const products = [
      makeProduct({ name: 'Parafuso Sextavado', slug: 'parafuso-sext' }),
      makeProduct({ name: 'Porca Hexagonal', slug: 'porca-hex' }),
    ]

    mockGetCategories.mockResolvedValueOnce(categories)
    mockGetProducts.mockResolvedValueOnce(products)

    const { container } = await renderHeader()

    expect(container.querySelector('header')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    expect(screen.getByTestId('products-dropdown-root')).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /Categorias de produtos/i }),
    ).toBeInTheDocument()
  })
})
