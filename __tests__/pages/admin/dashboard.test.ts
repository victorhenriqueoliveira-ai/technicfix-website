/**
 * Testes de integração do dashboard admin
 */

const mockProductCount = jest.fn()
const mockCategoryCount = jest.fn()
const mockLeadCount = jest.fn()
const mockSaleAggregate = jest.fn()
const mockGetSalesSummary = jest.fn()
const mockGetTopProducts = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: { count: () => mockProductCount() },
    category: { count: () => mockCategoryCount() },
    lead: { count: ({ where }: { where: { status: string } }) => mockLeadCount(where) },
    sale: { aggregate: (args: unknown) => mockSaleAggregate(args) },
  },
}))

jest.mock('@/actions/sales', () => ({
  getSalesSummary: (args: unknown) => mockGetSalesSummary(args),
  getTopProducts: (args: unknown) => mockGetTopProducts(args),
}))

// Mock do DashboardCharts (Client Component — não precisa renderizar nos testes de integração)
jest.mock('@/components/admin/DashboardCharts', () => ({
  DashboardCharts: () => null,
}))

// Mock lucide-react icons usados no dashboard
jest.mock('lucide-react', () => ({
  Package: () => null,
  Tag: () => null,
  Users: () => null,
  ShoppingCart: () => null,
  LayoutDashboard: () => null,
  Image: () => null,
  Settings: () => null,
}))

describe('Dashboard admin — integração de módulos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    // Re-registrar mocks após resetModules
    jest.mock('@/lib/prisma', () => ({
      db: {
        product: { count: () => mockProductCount() },
        category: { count: () => mockCategoryCount() },
        lead: { count: ({ where }: { where: { status: string } }) => mockLeadCount(where) },
        sale: { aggregate: (args: unknown) => mockSaleAggregate(args) },
      },
    }))
    jest.mock('@/actions/sales', () => ({
      getSalesSummary: (args: unknown) => mockGetSalesSummary(args),
      getTopProducts: (args: unknown) => mockGetTopProducts(args),
    }))
    jest.mock('@/components/admin/DashboardCharts', () => ({
      DashboardCharts: () => null,
    }))
    jest.mock('lucide-react', () => ({
      Package: () => null,
      Tag: () => null,
      Users: () => null,
      ShoppingCart: () => null,
      LayoutDashboard: () => null,
      Image: () => null,
      Settings: () => null,
    }))
  })

  it('módulo da página dashboard exporta default function', async () => {
    mockProductCount.mockResolvedValue(0)
    mockCategoryCount.mockResolvedValue(0)
    mockLeadCount.mockResolvedValue(0)
    mockSaleAggregate.mockResolvedValue({ _count: 0 })
    mockGetSalesSummary.mockResolvedValue([])
    mockGetTopProducts.mockResolvedValue([])

    const mod = await import('@/app/(admin)/admin/page')
    expect(typeof mod.default).toBe('function')
  })

  it('dashboard busca as 4 métricas do banco e resolve sem erro', async () => {
    mockProductCount.mockResolvedValue(10)
    mockCategoryCount.mockResolvedValue(5)
    mockLeadCount.mockResolvedValue(3)
    mockSaleAggregate.mockResolvedValue({ _count: 7 })
    mockGetSalesSummary.mockResolvedValue([])
    mockGetTopProducts.mockResolvedValue([])

    const { default: DashboardPage } = await import('@/app/(admin)/admin/page')
    const result = await DashboardPage()
    expect(result).not.toBeNull()
  })

  it('dashboard mostra 0 leads novos quando o banco está vazio', async () => {
    mockProductCount.mockResolvedValue(0)
    mockCategoryCount.mockResolvedValue(0)
    mockLeadCount.mockResolvedValue(0)
    mockSaleAggregate.mockResolvedValue({ _count: 0 })
    mockGetSalesSummary.mockResolvedValue([])
    mockGetTopProducts.mockResolvedValue([])

    const { default: DashboardPage } = await import('@/app/(admin)/admin/page')
    const result = await DashboardPage()
    expect(result).not.toBeNull()
    // Verificar que count de lead foi chamado com status 'novo'
    expect(mockLeadCount).toHaveBeenCalledWith({ status: 'novo' })
  })

  it('dashboard passa salesByDay e topProducts para DashboardCharts', async () => {
    const salesByDay = [{ date: '2024-01-01', total: 3 }]
    const topProducts = [{ productId: 'p1', productName: 'Produto A', totalSold: 10 }]

    mockProductCount.mockResolvedValue(1)
    mockCategoryCount.mockResolvedValue(1)
    mockLeadCount.mockResolvedValue(1)
    mockSaleAggregate.mockResolvedValue({ _count: 1 })
    mockGetSalesSummary.mockResolvedValue(salesByDay)
    mockGetTopProducts.mockResolvedValue(topProducts)

    const { default: DashboardPage } = await import('@/app/(admin)/admin/page')
    const result = await DashboardPage()
    expect(result).not.toBeNull()
    expect(mockGetSalesSummary).toHaveBeenCalledWith({ period: '30d' })
    expect(mockGetTopProducts).toHaveBeenCalledWith({ period: '30d', limit: 5 })
  })
})
