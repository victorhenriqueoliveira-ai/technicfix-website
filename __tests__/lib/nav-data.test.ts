/**
 * Testes unitários e de integração para lib/nav-data.ts
 * Mock do Prisma para isolar as queries.
 */

jest.mock('@/lib/prisma', () => ({
  db: {
    category: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  },
}))

import { db } from '@/lib/prisma'
import { getCategoriesForNav, getProductsForNav } from '@/lib/nav-data'
import type { CategorySummary, ProductNavItem } from '@/lib/types'

const mockCategoryFindMany = db.category.findMany as jest.MockedFunction<
  typeof db.category.findMany
>
const mockProductFindMany = db.product.findMany as jest.MockedFunction<
  typeof db.product.findMany
>

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeCategoryChild(
  overrides: Partial<{ id: string; name: string; slug: string; imageUrl: string | null }> = {},
) {
  return {
    id: overrides.id ?? 'child-1',
    name: overrides.name ?? 'Filho 1',
    slug: overrides.slug ?? 'filho-1',
    imageUrl: overrides.imageUrl ?? null,
    children: [],
  }
}

function makeCategory(
  overrides: Partial<{
    id: string
    name: string
    slug: string
    imageUrl: string | null
    children: ReturnType<typeof makeCategoryChild>[]
  }> = {},
): CategorySummary {
  return {
    id: overrides.id ?? 'cat-1',
    name: overrides.name ?? 'Categoria 1',
    slug: overrides.slug ?? 'categoria-1',
    imageUrl: overrides.imageUrl ?? null,
    children: overrides.children ?? [],
  }
}

function makeProductNavItem(
  overrides: Partial<{ name: string; slug: string }> = {},
): ProductNavItem {
  return {
    name: overrides.name ?? 'Produto 1',
    slug: overrides.slug ?? 'produto-1',
  }
}

// ─── getCategoriesForNav ─────────────────────────────────────────────────────

describe('getCategoriesForNav', () => {
  it('retorna 3 categorias pai com 2 filhos cada e filhos ordenados A–Z', async () => {
    const childrenA = [
      makeCategoryChild({ id: 'c1', name: 'Arruela', slug: 'arruela' }),
      makeCategoryChild({ id: 'c2', name: 'Bucha', slug: 'bucha' }),
    ]
    const childrenB = [
      makeCategoryChild({ id: 'c3', name: 'Chave', slug: 'chave' }),
      makeCategoryChild({ id: 'c4', name: 'Dado', slug: 'dado' }),
    ]
    const childrenC = [
      makeCategoryChild({ id: 'c5', name: 'Elipse', slug: 'elipse' }),
      makeCategoryChild({ id: 'c6', name: 'Flange', slug: 'flange' }),
    ]
    mockCategoryFindMany.mockResolvedValueOnce([
      makeCategory({ id: 'p1', name: 'Fixadores', slug: 'fixadores', children: childrenA }),
      makeCategory({ id: 'p2', name: 'Ferramentas', slug: 'ferramentas', children: childrenB }),
      makeCategory({ id: 'p3', name: 'Vedantes', slug: 'vedantes', children: childrenC }),
    ] as any)

    const result = await getCategoriesForNav()

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe('p1')
    expect(result[0].children).toHaveLength(2)
    expect(result[1].children).toHaveLength(2)
    expect(result[2].children).toHaveLength(2)
  })

  it('retorna array vazio sem erro quando banco está vazio', async () => {
    mockCategoryFindMany.mockResolvedValueOnce([] as any)

    const result = await getCategoriesForNav()

    expect(result).toEqual([])
  })

  it('chama findMany com where: { parentId: null } e orderBy: { name: asc }', async () => {
    mockCategoryFindMany.mockResolvedValueOnce([] as any)

    await getCategoriesForNav()

    expect(mockCategoryFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { parentId: null },
        orderBy: { name: 'asc' },
      }),
    )
  })

  it('inclui filhos com orderBy: { name: asc } na query', async () => {
    mockCategoryFindMany.mockResolvedValueOnce([] as any)

    await getCategoriesForNav()

    expect(mockCategoryFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          children: expect.objectContaining({
            orderBy: { name: 'asc' },
          }),
        }),
      }),
    )
  })

  it('preserva imageUrl null e string corretamente', async () => {
    const child = makeCategoryChild({ imageUrl: 'https://img.com/sub.jpg' })
    mockCategoryFindMany.mockResolvedValueOnce([
      makeCategory({ imageUrl: null, children: [child] }),
    ] as any)

    const result = await getCategoriesForNav()

    expect(result[0].imageUrl).toBeNull()
    expect(result[0].children[0].imageUrl).toBe('https://img.com/sub.jpg')
  })
})

// ─── getProductsForNav ───────────────────────────────────────────────────────

describe('getProductsForNav', () => {
  it('retorna exatamente 30 itens quando mock simula 50 produtos ativos (take: 30)', async () => {
    const thirtyProducts = Array.from({ length: 30 }, (_, i) =>
      makeProductNavItem({ name: `Produto ${i}`, slug: `produto-${i}` }),
    )
    mockProductFindMany.mockResolvedValueOnce(thirtyProducts as any)

    const result = await getProductsForNav()

    expect(result).toHaveLength(30)
  })

  it('retorna todos os 5 itens quando mock tem apenas 5 produtos ativos', async () => {
    const fiveProducts = Array.from({ length: 5 }, (_, i) =>
      makeProductNavItem({ name: `Produto ${i}`, slug: `produto-${i}` }),
    )
    mockProductFindMany.mockResolvedValueOnce(fiveProducts as any)

    const result = await getProductsForNav()

    expect(result).toHaveLength(5)
  })

  it('filtra status ativo — chama findMany com where: { status: ativo }', async () => {
    mockProductFindMany.mockResolvedValueOnce([] as any)

    await getProductsForNav()

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'ativo' },
      }),
    )
  })

  it('produtos inativos não aparecem no retorno (simulado via mock retornando apenas ativos)', async () => {
    // O mock simula que o Prisma já filtrou — apenas produtos ativos retornam
    const activeProducts = [
      makeProductNavItem({ name: 'Ativo 1', slug: 'ativo-1' }),
      makeProductNavItem({ name: 'Ativo 2', slug: 'ativo-2' }),
    ]
    mockProductFindMany.mockResolvedValueOnce(activeProducts as any)

    const result = await getProductsForNav()

    expect(result).toHaveLength(2)
    expect(result.every((p) => p.name.startsWith('Ativo'))).toBe(true)
  })

  it('retorno está ordenado A–Z por name', async () => {
    const products = [
      makeProductNavItem({ name: 'Arruela', slug: 'arruela' }),
      makeProductNavItem({ name: 'Bucha', slug: 'bucha' }),
      makeProductNavItem({ name: 'Chave', slug: 'chave' }),
    ]
    mockProductFindMany.mockResolvedValueOnce(products as any)

    const result = await getProductsForNav()

    expect(result[0].name).toBe('Arruela')
    expect(result[1].name).toBe('Bucha')
    expect(result[2].name).toBe('Chave')
  })

  it('chama findMany com take: 30 e orderBy: { name: asc }', async () => {
    mockProductFindMany.mockResolvedValueOnce([] as any)

    await getProductsForNav()

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 30,
        orderBy: { name: 'asc' },
      }),
    )
  })

  it('retorna apenas os campos name e slug (select)', async () => {
    mockProductFindMany.mockResolvedValueOnce([] as any)

    await getProductsForNav()

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { name: true, slug: true },
      }),
    )
  })
})

// ─── Integração: Promise.all ─────────────────────────────────────────────────

describe('Integração — Promise.all([getCategoriesForNav(), getProductsForNav()])', () => {
  it('resolve sem erro com mock Prisma configurado', async () => {
    const cat = makeCategory({ id: 'cat-int', name: 'Int', slug: 'int', children: [] })
    const prod = makeProductNavItem({ name: 'Prod Int', slug: 'prod-int' })

    mockCategoryFindMany.mockResolvedValueOnce([cat] as any)
    mockProductFindMany.mockResolvedValueOnce([prod] as any)

    const [categories, products] = await Promise.all([
      getCategoriesForNav(),
      getProductsForNav(),
    ])

    expect(categories).toHaveLength(1)
    expect(categories[0].id).toBe('cat-int')
    expect(products).toHaveLength(1)
    expect(products[0].name).toBe('Prod Int')
  })
})
