/**
 * Testes unitários — filtro de preço e generateMetadata em produtos/page.tsx
 */

import { Prisma } from '@prisma/client'

// --- Mock do Prisma ---
const mockFindMany = jest.fn()
const mockCount = jest.fn()
const mockCategoryFindMany = jest.fn()
const mockAggregate = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
      aggregate: (...args: unknown[]) => mockAggregate(...args),
    },
    category: {
      findMany: (...args: unknown[]) => mockCategoryFindMany(...args),
    },
  },
}))

// Mock de componentes de UI
jest.mock('@/components/catalog/ProductCard', () => ({ ProductCard: () => null }))
jest.mock('@/components/catalog/CategoryFilter', () => ({ CategoryFilter: () => null }))
jest.mock('@/components/catalog/SearchBar', () => ({ SearchBar: () => null }))
jest.mock('@/components/catalog/PriceFilter', () => ({ PriceFilter: () => null }))
jest.mock('next/link', () => ({ default: () => null }))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ children }: { children: unknown }) => children,
}))

const priceRangeDefault = {
  _min: { price: new Prisma.Decimal(0) },
  _max: { price: new Prisma.Decimal(1000) },
}

beforeEach(() => {
  mockFindMany.mockReset()
  mockCount.mockReset()
  mockCategoryFindMany.mockReset()
  mockAggregate.mockReset()
  mockCategoryFindMany.mockResolvedValue([])
  mockAggregate.mockResolvedValue(priceRangeDefault)
})

describe('produtos/page.tsx — filtro de preço', () => {
  it('com minPrice=50 e maxPrice=200, monta query Prisma com price: { gte: 50, lte: 200 }', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ minPrice: '50', maxPrice: '200' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.price).toBeDefined()
    expect(String(callArgs.where.price.gte)).toBe('50')
    expect(String(callArgs.where.price.lte)).toBe('200')
  })

  it('sem minPrice e maxPrice, monta query sem filtros de preço', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({}) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.price).toBeUndefined()
  })

  it('com minPrice=10 apenas, monta query com price: { gte: 10 }', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ minPrice: '10' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(String(callArgs.where.price.gte)).toBe('10')
    expect(callArgs.where.price.lte).toBeUndefined()
  })

  it('com maxPrice=100 apenas, monta query com price: { lte: 100 }', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ maxPrice: '100' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.price.lte).toBeDefined()
    expect(String(callArgs.where.price.lte)).toBe('100')
    expect(callArgs.where.price.gte).toBeUndefined()
  })

  it('filtro de preço combinado com busca=parafuso aplica ambos os critérios', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({
      searchParams: Promise.resolve({ busca: 'parafuso', minPrice: '10', maxPrice: '100' }),
    })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.name.contains).toBe('parafuso')
    expect(String(callArgs.where.price.gte)).toBe('10')
    expect(String(callArgs.where.price.lte)).toBe('100')
  })
})

describe('produtos/page.tsx — generateMetadata', () => {
  it('com categoria=parafusos retorna alternates.canonical = /categorias/parafusos', async () => {
    const { generateMetadata } = await import('@/app/(public)/produtos/page')
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({ categoria: 'parafusos' }),
    })
    expect((metadata as { alternates?: { canonical?: string } }).alternates?.canonical).toBe(
      '/categorias/parafusos'
    )
  })

  it('sem categoria retorna metadata sem alternates.canonical', async () => {
    const { generateMetadata } = await import('@/app/(public)/produtos/page')
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({}),
    })
    expect((metadata as { alternates?: { canonical?: string } }).alternates?.canonical).toBeUndefined()
  })

  it('com categoria=fixadores retorna canonical correto', async () => {
    const { generateMetadata } = await import('@/app/(public)/produtos/page')
    const metadata = await generateMetadata({
      searchParams: Promise.resolve({ categoria: 'fixadores' }),
    })
    expect((metadata as { alternates?: { canonical?: string } }).alternates?.canonical).toBe(
      '/categorias/fixadores'
    )
  })
})
