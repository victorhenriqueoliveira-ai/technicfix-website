/**
 * Testes de integração — página de listagem de produtos.
 *
 * Abordagem: mock do módulo `@/lib/prisma` para isolar a camada de banco
 * e testar a lógica de Server Component da página de listagem.
 */

// --- Mock do Prisma ---
const mockFindMany = jest.fn()
const mockCount = jest.fn()
const mockCategoryFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
    },
    category: {
      findMany: (...args: unknown[]) => mockCategoryFindMany(...args),
    },
  },
}))

// Mock dos componentes para evitar dependências de UI no teste de servidor
jest.mock('@/components/catalog/ProductCard', () => ({ ProductCard: () => null }))
jest.mock('@/components/catalog/CategoryFilter', () => ({ CategoryFilter: () => null }))
jest.mock('@/components/catalog/SearchBar', () => ({ SearchBar: () => null }))
jest.mock('next/link', () => ({ default: () => null }))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ children }: { children: unknown }) => children,
}))

// Produto ativo de exemplo — price como número simples (compatível com Number(p.price))
const productAtivo = {
  id: 'prod-1',
  name: 'Parafuso M8 Inox',
  slug: 'parafuso-m8-inox',
  description: 'Descrição',
  technicalDetails: null,
  price: 12.5,
  sku: null,
  stock: 10,
  images: [],
  featured: false,
  status: 'ativo' as const,
  categoryId: 'cat-1',
  category: { name: 'Parafusos', slug: 'parafusos' },
  createdAt: new Date(),
  updatedAt: new Date(),
  leads: [],
}

beforeEach(() => {
  mockFindMany.mockReset()
  mockCount.mockReset()
  mockCategoryFindMany.mockReset()
  mockCategoryFindMany.mockResolvedValue([])
})

describe('Página de listagem — /produtos', () => {
  it('retorna lista vazia sem erro quando banco está vazio', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')

    await expect(
      ProdutosPage({ searchParams: Promise.resolve({}) }),
    ).resolves.not.toThrow()
  })

  it('query ao Prisma filtra apenas produtos com status "ativo"', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        product: { findMany: mockFindMany, count: mockCount },
        category: { findMany: mockCategoryFindMany },
      },
    }))

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({}) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.status).toBe('ativo')
  })

  it('filtra por categoria quando query param "categoria" é passado', async () => {
    mockFindMany.mockResolvedValue([productAtivo])
    mockCount.mockResolvedValue(1)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ categoria: 'parafusos' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.category?.slug).toBe('parafusos')
  })

  it('filtra por nome quando query param "busca" é passado', async () => {
    mockFindMany.mockResolvedValue([productAtivo])
    mockCount.mockResolvedValue(1)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ busca: 'inox' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.name.contains).toBe('inox')
    expect(callArgs.where.name.mode).toBe('insensitive')
  })

  it('aplica paginação (skip e take) corretamente', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({ page: '3' }) })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.skip).toBe(24) // (3-1) * 12
    expect(callArgs.take).toBe(12)
  })

  it('filtra combinado: categoria + busca funcionam juntos', async () => {
    mockFindMany.mockResolvedValue([productAtivo])
    mockCount.mockResolvedValue(1)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({
      searchParams: Promise.resolve({ categoria: 'parafusos', busca: 'inox' }),
    })

    const callArgs = mockFindMany.mock.calls[0][0]
    expect(callArgs.where.category?.slug).toBe('parafusos')
    expect(callArgs.where.name.contains).toBe('inox')
  })

  it('where.status === "ativo" garante que produtos inativos nunca aparecem', async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)

    const { default: ProdutosPage } = await import('@/app/(public)/produtos/page')
    await ProdutosPage({ searchParams: Promise.resolve({}) })

    const callArgs = mockFindMany.mock.calls[0][0]
    // O filtro deve ser exatamente 'ativo'; qualquer outro valor seria um bug
    expect(callArgs.where.status).not.toBe('inativo')
    expect(callArgs.where.status).toBe('ativo')
  })
})
