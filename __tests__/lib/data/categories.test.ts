import { getCategoriesWithChildren, getCategoriesWithProducts } from '@/lib/data/categories'

// Mock do módulo Prisma para isolar os testes
jest.mock('@/lib/prisma', () => ({
  db: {
    category: {
      findMany: jest.fn(),
    },
  },
}))

import { db } from '@/lib/prisma'

const mockFindMany = db.category.findMany as jest.MockedFunction<typeof db.category.findMany>

// Helpers para construir objetos de mock
function makeRawChild(overrides: Partial<{
  id: string
  name: string
  slug: string
  imageUrl: string | null
}> = {}) {
  return {
    id: overrides.id ?? 'child-1',
    name: overrides.name ?? 'Filho 1',
    slug: overrides.slug ?? 'filho-1',
    imageUrl: overrides.imageUrl ?? null,
    parentId: 'pai-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function makeRawCategory(overrides: Partial<{
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: ReturnType<typeof makeRawChild>[]
}> = {}) {
  return {
    id: overrides.id ?? 'cat-1',
    name: overrides.name ?? 'Categoria 1',
    slug: overrides.slug ?? 'categoria-1',
    imageUrl: overrides.imageUrl ?? null,
    parentId: null,
    children: overrides.children ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function makeRawProduct(overrides: Partial<{
  id: string
  name: string
  slug: string
  price: { toNumber: () => number } | null
  images: string[]
  featured: boolean
  showPrice: boolean
  category: { name: string; slug: string }
}> = {}) {
  return {
    id: overrides.id ?? 'prod-1',
    name: overrides.name ?? 'Produto 1',
    slug: overrides.slug ?? 'produto-1',
    price: overrides.price !== undefined ? overrides.price : { toNumber: () => 99.99 },
    images: overrides.images ?? ['img.jpg'],
    featured: overrides.featured ?? false,
    showPrice: overrides.showPrice ?? true,
    category: overrides.category ?? { name: 'Categoria 1', slug: 'categoria-1' },
  }
}

function makeRawCategoryWithProducts(overrides: Partial<{
  id: string
  name: string
  slug: string
  products: ReturnType<typeof makeRawProduct>[]
}> = {}) {
  return {
    id: overrides.id ?? 'cat-1',
    name: overrides.name ?? 'Categoria 1',
    slug: overrides.slug ?? 'categoria-1',
    imageUrl: null,
    parentId: null,
    products: overrides.products ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── getCategoriesWithChildren ────────────────────────────────────────────────

describe('getCategoriesWithChildren', () => {
  it('retorna 2 CategorySummary com children populados corretamente', async () => {
    const children1 = [
      makeRawChild({ id: 'c1', name: 'Filho A', slug: 'filho-a', imageUrl: null }),
      makeRawChild({ id: 'c2', name: 'Filho B', slug: 'filho-b', imageUrl: 'https://example.com/b.jpg' }),
      makeRawChild({ id: 'c3', name: 'Filho C', slug: 'filho-c', imageUrl: null }),
    ]
    const children2 = [
      makeRawChild({ id: 'c4', name: 'Filho D', slug: 'filho-d', imageUrl: null }),
      makeRawChild({ id: 'c5', name: 'Filho E', slug: 'filho-e', imageUrl: null }),
      makeRawChild({ id: 'c6', name: 'Filho F', slug: 'filho-f', imageUrl: null }),
    ]
    mockFindMany.mockResolvedValueOnce([
      makeRawCategory({ id: 'pai-1', name: 'Pai 1', slug: 'pai-1', children: children1 }),
      makeRawCategory({ id: 'pai-2', name: 'Pai 2', slug: 'pai-2', children: children2 }),
    ] as any)

    const result = await getCategoriesWithChildren()

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('pai-1')
    expect(result[0].children).toHaveLength(3)
    expect(result[0].children[0].name).toBe('Filho A')
    expect(result[0].children[1].imageUrl).toBe('https://example.com/b.jpg')
    expect(result[1].children).toHaveLength(3)
  })

  it('retorna [] sem erro quando mock retorna array vazio', async () => {
    mockFindMany.mockResolvedValueOnce([] as any)

    const result = await getCategoriesWithChildren()

    expect(result).toEqual([])
  })

  it('mapeia campos id, name, slug, imageUrl e children corretamente em CategorySummary', async () => {
    const child = makeRawChild({ id: 'filho-id', name: 'Sub', slug: 'sub', imageUrl: 'https://img.com/x.jpg' })
    mockFindMany.mockResolvedValueOnce([
      makeRawCategory({ id: 'cat-id', name: 'Parafusos', slug: 'parafusos', imageUrl: null, children: [child] }),
    ] as any)

    const result = await getCategoriesWithChildren()

    expect(result[0]).toMatchObject({
      id: 'cat-id',
      name: 'Parafusos',
      slug: 'parafusos',
      imageUrl: null,
    })
    expect(result[0].children).toHaveLength(1)
    expect(result[0].children[0]).toMatchObject({
      id: 'filho-id',
      name: 'Sub',
      slug: 'sub',
      imageUrl: 'https://img.com/x.jpg',
      children: [],
    })
  })

  it('seta imageUrl como null quando categoria não tem imagem', async () => {
    mockFindMany.mockResolvedValueOnce([
      makeRawCategory({ imageUrl: undefined as any }),
    ] as any)

    const result = await getCategoriesWithChildren()

    expect(result[0].imageUrl).toBeNull()
  })

  it('preserva imageUrl quando categoria tem imagem definida (branch ?? falso)', async () => {
    const child = makeRawChild({ imageUrl: 'https://img.com/cat.jpg' })
    mockFindMany.mockResolvedValueOnce([
      makeRawCategory({ imageUrl: 'https://img.com/pai.jpg', children: [child] }),
    ] as any)

    const result = await getCategoriesWithChildren()

    expect(result[0].imageUrl).toBe('https://img.com/pai.jpg')
    expect(result[0].children[0].imageUrl).toBe('https://img.com/cat.jpg')
  })
})

// ─── getCategoriesWithProducts ────────────────────────────────────────────────

describe('getCategoriesWithProducts', () => {
  it('retorna 8 produtos com limit padrão quando mock tem 10 produtos (limit aplicado pelo Prisma)', async () => {
    // O limit é passado ao Prisma via take — o mock simula que o Prisma já retornou só 8
    const eightProducts = Array.from({ length: 8 }, (_, i) =>
      makeRawProduct({ id: `p${i}`, name: `Produto ${i}`, slug: `produto-${i}` }),
    )
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({ products: eightProducts }),
    ] as any)

    const result = await getCategoriesWithProducts()

    expect(result[0].products).toHaveLength(8)
    // Verifica que o findMany foi chamado com take: 8 (default)
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          products: expect.objectContaining({ take: 8 }),
        }),
      }),
    )
  })

  it('getCategoriesWithProducts(4) chama Prisma com take: 4 e retorna 4 produtos', async () => {
    const fourProducts = Array.from({ length: 4 }, (_, i) =>
      makeRawProduct({ id: `p${i}`, name: `Produto ${i}`, slug: `produto-${i}` }),
    )
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({ products: fourProducts }),
    ] as any)

    const result = await getCategoriesWithProducts(4)

    expect(result[0].products).toHaveLength(4)
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          products: expect.objectContaining({ take: 4 }),
        }),
      }),
    )
  })

  it('retorna [] quando não há categorias com produtos ativos', async () => {
    mockFindMany.mockResolvedValueOnce([] as any)

    const result = await getCategoriesWithProducts()

    expect(result).toEqual([])
  })

  it('mapeia todos os campos de ProductSummary corretamente', async () => {
    const rawProduct = makeRawProduct({
      id: 'prod-abc',
      name: 'Parafuso M8',
      slug: 'parafuso-m8',
      price: { toNumber: () => 12.5 } as any,
      images: ['img1.jpg', 'img2.jpg'],
      featured: true,
      showPrice: false,
      category: { name: 'Fixadores', slug: 'fixadores' },
    })
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({ products: [rawProduct] }),
    ] as any)

    const result = await getCategoriesWithProducts()
    const product = result[0].products[0]

    expect(product.id).toBe('prod-abc')
    expect(product.name).toBe('Parafuso M8')
    expect(product.slug).toBe('parafuso-m8')
    expect(product.price).toBe(12.5)
    expect(product.images).toEqual(['img1.jpg', 'img2.jpg'])
    expect(product.featured).toBe(true)
    expect(product.showPrice).toBe(false)
    expect(product.category).toEqual({ name: 'Fixadores', slug: 'fixadores' })
  })

  it('mapeia price null corretamente quando produto não tem preço', async () => {
    const rawProduct = makeRawProduct({ price: null })
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({ products: [rawProduct] }),
    ] as any)

    const result = await getCategoriesWithProducts()

    expect(result[0].products[0].price).toBeNull()
  })

  it('mapeia campos id, name, slug em CategoryWithProducts', async () => {
    const rawProduct = makeRawProduct()
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({
        id: 'cat-xyz',
        name: 'Fixadores',
        slug: 'fixadores',
        products: [rawProduct],
      }),
    ] as any)

    const result = await getCategoriesWithProducts()

    expect(result[0]).toMatchObject({
      id: 'cat-xyz',
      name: 'Fixadores',
      slug: 'fixadores',
    })
    expect(Array.isArray(result[0].products)).toBe(true)
  })

  it('converte price numérico primitivo (sem toNumber) corretamente', async () => {
    // Cobre o branch quando price é um número primitivo (não Decimal do Prisma)
    const rawProduct = makeRawProduct({ price: 49.90 as any })
    mockFindMany.mockResolvedValueOnce([
      makeRawCategoryWithProducts({ products: [rawProduct] }),
    ] as any)

    const result = await getCategoriesWithProducts()

    expect(result[0].products[0].price).toBe(49.90)
  })
})
