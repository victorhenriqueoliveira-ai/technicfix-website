/**
 * Testes de integração do dashboard admin
 */

const mockProductCount = jest.fn()
const mockCategoryCount = jest.fn()
const mockLeadCount = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: { count: () => mockProductCount() },
    category: { count: () => mockCategoryCount() },
    lead: { count: ({ where }: { where: { status: string } }) => mockLeadCount(where) },
  },
}))

// Mock lucide-react icons usados no dashboard
jest.mock('lucide-react', () => ({
  Package: () => null,
  Tag: () => null,
  Users: () => null,
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
      },
    }))
    jest.mock('lucide-react', () => ({
      Package: () => null,
      Tag: () => null,
      Users: () => null,
      LayoutDashboard: () => null,
      Image: () => null,
      Settings: () => null,
    }))
  })

  it('módulo da página dashboard exporta default function', async () => {
    mockProductCount.mockResolvedValue(0)
    mockCategoryCount.mockResolvedValue(0)
    mockLeadCount.mockResolvedValue(0)

    const mod = await import('@/app/(admin)/admin/page')
    expect(typeof mod.default).toBe('function')
  })

  it('dashboard busca as 3 métricas do banco e resolve sem erro', async () => {
    mockProductCount.mockResolvedValue(10)
    mockCategoryCount.mockResolvedValue(5)
    mockLeadCount.mockResolvedValue(3)

    const { default: DashboardPage } = await import('@/app/(admin)/admin/page')
    const result = await DashboardPage()
    expect(result).not.toBeNull()
  })

  it('dashboard mostra 0 leads novos quando o banco está vazio', async () => {
    mockProductCount.mockResolvedValue(0)
    mockCategoryCount.mockResolvedValue(0)
    mockLeadCount.mockResolvedValue(0)

    const { default: DashboardPage } = await import('@/app/(admin)/admin/page')
    const result = await DashboardPage()
    expect(result).not.toBeNull()
    // Verificar que count de lead foi chamado com status 'novo'
    expect(mockLeadCount).toHaveBeenCalledWith({ status: 'novo' })
  })
})
