/**
 * Testes de integração — página de detalhe de produto.
 *
 * Verifica: 404 para slug inválido, exibição de preço vs. "Sob consulta",
 * propagação correta de whatsappNumber, novas props de ProductCTAs e RelatedProducts.
 */
import type React from 'react'

// ── Mocks do Prisma ──────────────────────────────────────────────────────────
const mockFindFirst = jest.fn()
const mockSiteConfigFindUnique = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
    siteConfig: {
      findUnique: (...args: unknown[]) => mockSiteConfigFindUnique(...args),
    },
  },
}))

// ── Mock next/navigation ─────────────────────────────────────────────────────
const notFoundError = new Error('NEXT_NOT_FOUND')
jest.mock('next/navigation', () => ({
  notFound: () => { throw notFoundError },
  redirect: jest.fn(),
}))

// ── Mock de UI ───────────────────────────────────────────────────────────────
jest.mock('@/components/catalog/ProductGallery', () => ({ ProductGallery: jest.fn(() => null) }))
jest.mock('next/link', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))

// ProductCTAs: jest.fn() exposto para capturar props via JSX traversal
jest.mock('@/components/catalog/ProductCTAs', () => ({ ProductCTAs: jest.fn(() => null) }))

// RelatedProducts: jest.fn() exposto para capturar props via JSX traversal
jest.mock('@/components/catalog/RelatedProducts', () => ({ RelatedProducts: jest.fn(() => null) }))

// ── Helpers de travessia JSX ─────────────────────────────────────────────────
type AnyNode = React.ReactNode

function findJSXElement(
  node: AnyNode,
  predicate: (el: React.ReactElement) => boolean,
): React.ReactElement | null {
  if (node === null || node === undefined) return null
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return null
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findJSXElement(child, predicate)
      if (found) return found
    }
    return null
  }
  const el = node as React.ReactElement
  if (typeof el !== 'object' || !('type' in el)) return null
  if (predicate(el)) return el
  const children: AnyNode = el?.props?.children
  if (children !== undefined && children !== null) {
    return findJSXElement(children, predicate)
  }
  return null
}

/** Encontra elemento pelo data-testid */
function findByTestId(node: AnyNode, testId: string): React.ReactElement | null {
  return findJSXElement(node, (el) => el?.props?.['data-testid'] === testId)
}

/** Encontra elemento cujo type é a função fornecida */
function findByType(node: AnyNode, type: unknown): React.ReactElement | null {
  return findJSXElement(node, (el) => el?.type === type)
}

// ── Fixtures ─────────────────────────────────────────────────────────────────
const produtoBase = {
  id: 'prod-1',
  name: 'Parafuso M8 Inox',
  slug: 'parafuso-m8-inox',
  description: 'Excelente parafuso',
  technicalDetails: 'Aço inox 304',
  price: 99.9,
  sku: 'SKU-001',
  stock: 50,
  images: ['https://example.com/img.jpg'],
  featured: true,
  status: 'ativo' as const,
  showPrice: true,
  productType: 'ambos' as const,
  relatedProductIds: [] as string[],
  categoryId: 'cat-1',
  category: { name: 'Parafusos', slug: 'parafusos' },
  createdAt: new Date(),
  updatedAt: new Date(),
  leads: [],
}

const siteConfigComNumero = {
  id: 'singleton',
  storeName: 'Technicfix',
  whatsappNumber: '11999998888',
  contactEmail: '',
  technocalhasUrl: '',
  technocalhasDescription: '',
  updatedAt: new Date(),
}

// ── Setup ────────────────────────────────────────────────────────────────────
beforeEach(() => {
  mockFindFirst.mockReset()
  mockSiteConfigFindUnique.mockReset()
  mockSiteConfigFindUnique.mockResolvedValue(siteConfigComNumero)
  // Limpa contadores dos mocks de componentes
  ;(jest.requireMock('@/components/catalog/ProductCTAs').ProductCTAs as jest.Mock).mockClear()
  ;(jest.requireMock('@/components/catalog/RelatedProducts').RelatedProducts as jest.Mock).mockClear()
})

// ── Testes ───────────────────────────────────────────────────────────────────
describe('Página de detalhe — /produtos/[slug]', () => {
  // ── notFound ──────────────────────────────────────────────────────────────
  describe('notFound()', () => {
    it('chama notFound() quando slug não existe no banco', async () => {
      mockFindFirst.mockResolvedValue(null)
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      await expect(
        ProductPage({ params: Promise.resolve({ slug: 'slug-inexistente' }) }),
      ).rejects.toThrow(notFoundError)
    })

    it('produto com status inativo provoca notFound() (filtro status: ativo retorna null)', async () => {
      mockFindFirst.mockResolvedValue(null)
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      await expect(
        ProductPage({ params: Promise.resolve({ slug: 'porca-m6' }) }),
      ).rejects.toThrow(notFoundError)
    })
  })

  // ── Renderização base ─────────────────────────────────────────────────────
  describe('renderização bem-sucedida', () => {
    it('não lança erro quando produto ativo existe', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      await expect(
        ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) }),
      ).resolves.not.toThrow()
    })

    it('busca produto com where: { slug, status: "ativo" } e include: { category: true }', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const callArgs = mockFindFirst.mock.calls[0][0]
      expect(callArgs.where.slug).toBe('parafuso-m8-inox')
      expect(callArgs.where.status).toBe('ativo')
      expect(callArgs.include?.category).toBe(true)
    })
  })

  // ── Exibição de preço ─────────────────────────────────────────────────────
  describe('exibição de preço', () => {
    it('exibe preço formatado em BRL quando showPrice=true', async () => {
      mockFindFirst.mockResolvedValue({ ...produtoBase, showPrice: true, price: 99.9 })
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const priceEl = findByTestId(result, 'product-price')
      expect(priceEl).not.toBeNull()
      const text = String(priceEl?.props?.children ?? '')
      expect(text).toMatch(/R\$/)
      expect(text).not.toContain('Sob consulta')
    })

    it('exibe "Sob consulta" quando showPrice=false', async () => {
      mockFindFirst.mockResolvedValue({ ...produtoBase, showPrice: false, price: 99.9 })
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const priceEl = findByTestId(result, 'product-price')
      expect(priceEl).not.toBeNull()
      expect(priceEl?.props?.children).toBe('Sob consulta')
    })

    it('não exibe bloco de preço quando showPrice=true e price=null', async () => {
      mockFindFirst.mockResolvedValue({ ...produtoBase, showPrice: true, price: null })
      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const priceEl = findByTestId(result, 'product-price')
      expect(priceEl).toBeNull()
    })
  })

  // ── Propagação de whatsappNumber ──────────────────────────────────────────
  describe('propagação de whatsappNumber', () => {
    it('passa whatsappNumber do SiteConfig para ProductCTAs via props do elemento JSX', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      mockSiteConfigFindUnique.mockResolvedValue(siteConfigComNumero)

      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const { ProductCTAs: MockedProductCTAs } = jest.requireMock('@/components/catalog/ProductCTAs')
      const ctasEl = findByType(result, MockedProductCTAs)
      expect(ctasEl).not.toBeNull()
      expect(ctasEl?.props?.whatsappNumber).toBe('11999998888')
    })

    it('passa whatsappNumber="" quando SiteConfig não existe no banco', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      mockSiteConfigFindUnique.mockResolvedValue(null)

      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      // whatsappNumber vazio → ProductCTAs não renderiza botões WhatsApp (responsabilidade do componente)
      const { ProductCTAs: MockedProductCTAs } = jest.requireMock('@/components/catalog/ProductCTAs')
      const ctasEl = findByType(result, MockedProductCTAs)
      expect(ctasEl).not.toBeNull()
      expect(ctasEl?.props?.whatsappNumber).toBe('')
    })

    it('passa whatsappNumber="" quando SiteConfig.whatsappNumber é string vazia', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      mockSiteConfigFindUnique.mockResolvedValue({ ...siteConfigComNumero, whatsappNumber: '' })

      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const { ProductCTAs: MockedProductCTAs } = jest.requireMock('@/components/catalog/ProductCTAs')
      const ctasEl = findByType(result, MockedProductCTAs)
      expect(ctasEl).not.toBeNull()
      expect(ctasEl?.props?.whatsappNumber).toBe('')
    })
  })

  // ── Novas props de ProductCTAs ────────────────────────────────────────────
  describe('props do ProductCTAs', () => {
    it('passa productId, productName, productType, showPrice e stock para ProductCTAs', async () => {
      const produto = { ...produtoBase, productType: 'varejo' as const, showPrice: true, stock: 5 }
      mockFindFirst.mockResolvedValue(produto)

      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const { ProductCTAs: MockedProductCTAs } = jest.requireMock('@/components/catalog/ProductCTAs')
      const ctasEl = findByType(result, MockedProductCTAs)
      expect(ctasEl).not.toBeNull()
      expect(ctasEl?.props).toMatchObject({
        productId: 'prod-1',
        productName: 'Parafuso M8 Inox',
        productType: 'varejo',
        showPrice: true,
        stock: 5,
      })
    })
  })

  // ── RelatedProducts ───────────────────────────────────────────────────────
  describe('RelatedProducts', () => {
    it('renderiza RelatedProducts com productId, categoryId e relatedProductIds corretos', async () => {
      const produto = { ...produtoBase, relatedProductIds: ['prod-2', 'prod-3'] }
      mockFindFirst.mockResolvedValue(produto)

      const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
      const result = await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      const { RelatedProducts: MockedRelatedProducts } = jest.requireMock('@/components/catalog/RelatedProducts')
      const relatedEl = findByType(result, MockedRelatedProducts)
      expect(relatedEl).not.toBeNull()
      expect(relatedEl?.props).toMatchObject({
        productId: 'prod-1',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-2', 'prod-3'],
      })
    })
  })

  // ── generateMetadata ──────────────────────────────────────────────────────
  describe('generateMetadata', () => {
    it('retorna título e openGraph.images corretos para produto válido', async () => {
      mockFindFirst.mockResolvedValue(produtoBase)
      const { generateMetadata } = await import('@/app/(public)/produtos/[slug]/page')
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

      expect(metadata.title).toBe('Parafuso M8 Inox | TechnicFix')
      expect((metadata.openGraph as { images?: unknown[] })?.images).toHaveLength(1)
    })

    it('retorna título de fallback quando produto não existe', async () => {
      mockFindFirst.mockResolvedValue(null)
      const { generateMetadata } = await import('@/app/(public)/produtos/[slug]/page')
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'nao-existe' }) })

      expect(metadata.title).toBe('Produto não encontrado | TechnicFix')
    })
  })
})
