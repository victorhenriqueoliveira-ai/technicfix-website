/**
 * Testes de integração — página de detalhe de produto.
 *
 * Verifica: 404 para slug inválido, 200 para slug válido, produto inativo retorna 404.
 */

// Mock do Prisma
const mockFindFirst = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}))

// Mock next/navigation — notFound lança erro para interromper o fluxo
const notFoundError = new Error('NEXT_NOT_FOUND')
jest.mock('next/navigation', () => ({
  notFound: () => {
    throw notFoundError
  },
  redirect: jest.fn(),
}))

// Mock dos componentes de UI
jest.mock('@/components/catalog/ProductGallery', () => ({ ProductGallery: () => null }))
jest.mock('next/link', () => ({ default: () => null }))

// produto ativo com price como número simples
const productAtivo = {
  id: 'prod-1',
  name: 'Parafuso M8 Inox',
  slug: 'parafuso-m8-inox',
  description: 'Excelente parafuso',
  technicalDetails: 'Aço inox 304',
  price: 12.5,
  sku: 'SKU-001',
  stock: 50,
  images: ['https://example.com/img.jpg'],
  featured: true,
  status: 'ativo' as const,
  categoryId: 'cat-1',
  category: { name: 'Parafusos', slug: 'parafusos' },
  createdAt: new Date(),
  updatedAt: new Date(),
  leads: [],
}

beforeEach(() => {
  mockFindFirst.mockReset()
})

describe('Página de detalhe — /produtos/[slug]', () => {
  it('chama notFound() quando slug não existe no banco', async () => {
    mockFindFirst.mockResolvedValue(null)

    const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')

    await expect(
      ProductPage({ params: Promise.resolve({ slug: 'slug-inexistente' }) }),
    ).rejects.toThrow(notFoundError)
  })

  it('não lança erro quando produto ativo existe', async () => {
    mockFindFirst.mockResolvedValue(productAtivo)

    const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')

    await expect(
      ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) }),
    ).resolves.not.toThrow()
  })

  it('busca produto com where: { slug, status: "ativo" } e include: { category: true }', async () => {
    mockFindFirst.mockResolvedValue(productAtivo)

    const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')
    await ProductPage({ params: Promise.resolve({ slug: 'parafuso-m8-inox' }) })

    const callArgs = mockFindFirst.mock.calls[0][0]
    expect(callArgs.where.slug).toBe('parafuso-m8-inox')
    expect(callArgs.where.status).toBe('ativo')
    expect(callArgs.include?.category).toBe(true)
  })

  it('produto com status inativo provoca notFound() (banco retorna null com filtro status: ativo)', async () => {
    // A query inclui where: { status: 'ativo' }, então produto inativo não é retornado
    mockFindFirst.mockResolvedValue(null)

    const { default: ProductPage } = await import('@/app/(public)/produtos/[slug]/page')

    await expect(
      ProductPage({ params: Promise.resolve({ slug: 'porca-m6' }) }),
    ).rejects.toThrow(notFoundError)
  })
})
