/**
 * Testes unitários — componente RelatedProducts (Server Component).
 *
 * Abordagem: mock de `@/lib/prisma` para isolar a camada de banco.
 * O componente é async e retorna null ou JSX, portanto testamos
 * o valor de retorno e as queries geradas.
 */

// --- Mock do Prisma ---
const mockProductFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
    },
  },
}))

// Mock do ProductCard para evitar dependências de UI
jest.mock('@/components/catalog/ProductCard', () => ({
  ProductCard: ({ product }: { product: { id: string; name: string } }) =>
    `<ProductCard id="${product.id}" name="${product.name}" />`,
}))

// Mock do next/image e next/link para ambiente node
jest.mock('next/image', () => ({ default: () => null }))
jest.mock('next/link', () => ({ default: () => null }))

// Helper para criar produto fake compatível com Prisma (incluindo category)
function makeProduto(overrides: {
  id?: string
  name?: string
  slug?: string
  status?: 'ativo' | 'inativo'
  categoryId?: string
  category?: { id: string; name: string; slug: string }
  relatedProductIds?: string[]
  price?: number | null
  featured?: boolean
  images?: string[]
} = {}) {
  return {
    id: overrides.id ?? 'prod-1',
    name: overrides.name ?? 'Produto Teste',
    slug: overrides.slug ?? 'produto-teste',
    description: 'Descrição',
    technicalDetails: null,
    price: overrides.price ?? 10,
    sku: null,
    stock: 5,
    images: overrides.images ?? [],
    featured: overrides.featured ?? false,
    status: overrides.status ?? 'ativo',
    showPrice: true,
    productType: 'ambos',
    relatedProductIds: overrides.relatedProductIds ?? [],
    categoryId: overrides.categoryId ?? 'cat-1',
    category: overrides.category ?? { id: 'cat-1', name: 'Categoria', slug: 'categoria' },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

beforeEach(() => {
  jest.resetModules()
  mockProductFindMany.mockReset()
})

async function importRelatedProducts() {
  const mod = await import('@/components/catalog/RelatedProducts')
  return mod.RelatedProducts
}

describe('RelatedProducts', () => {
  it('retorna null quando há menos de 3 produtos relacionados disponíveis', async () => {
    // 0 manuais, 2 da categoria
    mockProductFindMany
      .mockResolvedValueOnce([]) // query manual
      .mockResolvedValueOnce([
        makeProduto({ id: 'prod-2', slug: 'prod-2' }),
        makeProduto({ id: 'prod-3', slug: 'prod-3' }),
      ]) // query automática

    const RelatedProducts = await importRelatedProducts()
    const result = await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: [],
    })

    expect(result).toBeNull()
  })

  it('retorna os 4 produtos quando há 0 manuais e 4 ativos na categoria (excluindo o atual)', async () => {
    const catProds = [
      makeProduto({ id: 'prod-2', slug: 'prod-2' }),
      makeProduto({ id: 'prod-3', slug: 'prod-3' }),
      makeProduto({ id: 'prod-4', slug: 'prod-4' }),
      makeProduto({ id: 'prod-5', slug: 'prod-5' }),
    ]

    mockProductFindMany
      .mockResolvedValueOnce([]) // query manual
      .mockResolvedValueOnce(catProds) // query automática

    const RelatedProducts = await importRelatedProducts()
    const result = await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: [],
    })

    expect(result).not.toBeNull()
  })

  it('retorna exatamente 8 produtos quando há 5 manuais ativos e 10 da categoria', async () => {
    const manuais = Array.from({ length: 5 }, (_, i) =>
      makeProduto({ id: `manual-${i}`, slug: `manual-${i}` }),
    )
    // A query automática respeita `take: 8 - manual.length` = 3
    const autoProds = Array.from({ length: 3 }, (_, i) =>
      makeProduto({ id: `auto-${i}`, slug: `auto-${i}` }),
    )

    mockProductFindMany
      .mockResolvedValueOnce(manuais)
      .mockResolvedValueOnce(autoProds)

    const RelatedProducts = await importRelatedProducts()
    const result = await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: manuais.map((p) => p.id),
    })

    expect(result).not.toBeNull()

    // Verifica que `take` foi chamado com 3 (8 - 5)
    const secondCall = mockProductFindMany.mock.calls[1][0]
    expect(secondCall.take).toBe(3)
  })

  it('produto com status inativo não aparece nos relacionados', async () => {
    // Query manual retorna apenas os ativos (filtro status=ativo no Prisma)
    const ativo = makeProduto({ id: 'prod-ativo', slug: 'prod-ativo', status: 'ativo' })
    // inativo não retorna pois o mock retorna apenas o que o Prisma retornaria após filtro

    mockProductFindMany
      .mockResolvedValueOnce([ativo]) // manual: apenas o ativo é retornado pelo Prisma
      .mockResolvedValueOnce([
        makeProduto({ id: 'auto-1', slug: 'auto-1' }),
        makeProduto({ id: 'auto-2', slug: 'auto-2' }),
      ])

    const RelatedProducts = await importRelatedProducts()
    const result = await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: ['prod-ativo', 'prod-inativo'],
    })

    expect(result).not.toBeNull()

    // A query manual deve filtrar por status='ativo'
    const firstCall = mockProductFindMany.mock.calls[0][0]
    expect(firstCall.where.status).toBe('ativo')
  })

  it('ID manual inexistente no banco é ignorado sem erro', async () => {
    // Prisma retorna apenas os IDs que existem; ID inexistente simplesmente não retorna
    const existente = makeProduto({ id: 'existe', slug: 'existe' })

    mockProductFindMany
      .mockResolvedValueOnce([existente]) // ID inexistente ignorado
      .mockResolvedValueOnce([
        makeProduto({ id: 'auto-1', slug: 'auto-1' }),
        makeProduto({ id: 'auto-2', slug: 'auto-2' }),
      ])

    const RelatedProducts = await importRelatedProducts()
    await expect(
      RelatedProducts({
        productId: 'prod-1',
        categoryId: 'cat-1',
        relatedProductIds: ['existe', 'nao-existe-no-banco'],
      }),
    ).resolves.not.toThrow()
  })

  it('productId nunca aparece nos produtos relacionados (excluído da query automática)', async () => {
    mockProductFindMany
      .mockResolvedValueOnce([]) // nenhum manual
      .mockResolvedValueOnce([
        makeProduto({ id: 'prod-2', slug: 'prod-2' }),
        makeProduto({ id: 'prod-3', slug: 'prod-3' }),
        makeProduto({ id: 'prod-4', slug: 'prod-4' }),
      ])

    const RelatedProducts = await importRelatedProducts()
    await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: [],
    })

    // A query automática deve excluir o productId
    const secondCall = mockProductFindMany.mock.calls[1][0]
    expect(secondCall.where.id.notIn).toContain('prod-1')
  })

  it('query automática exclui também os IDs manuais já incluídos', async () => {
    const manuais = [
      makeProduto({ id: 'manual-1', slug: 'manual-1' }),
      makeProduto({ id: 'manual-2', slug: 'manual-2' }),
      makeProduto({ id: 'manual-3', slug: 'manual-3' }),
    ]

    mockProductFindMany
      .mockResolvedValueOnce(manuais)
      .mockResolvedValueOnce([]) // sem complemento necessário (já temos 3)

    const RelatedProducts = await importRelatedProducts()
    await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: ['manual-1', 'manual-2', 'manual-3'],
    })

    const secondCall = mockProductFindMany.mock.calls[1][0]
    expect(secondCall.where.id.notIn).toContain('manual-1')
    expect(secondCall.where.id.notIn).toContain('manual-2')
    expect(secondCall.where.id.notIn).toContain('manual-3')
    expect(secondCall.where.id.notIn).toContain('prod-1')
  })

  it('query manual usa where.status=ativo para filtrar inativos e IDs inexistentes', async () => {
    mockProductFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        makeProduto({ id: 'a', slug: 'a' }),
        makeProduto({ id: 'b', slug: 'b' }),
        makeProduto({ id: 'c', slug: 'c' }),
      ])

    const RelatedProducts = await importRelatedProducts()
    await RelatedProducts({
      productId: 'prod-1',
      categoryId: 'cat-1',
      relatedProductIds: ['x', 'y'],
    })

    const firstCall = mockProductFindMany.mock.calls[0][0]
    expect(firstCall.where.status).toBe('ativo')
    expect(firstCall.where.id.in).toEqual(['x', 'y'])
  })
})
