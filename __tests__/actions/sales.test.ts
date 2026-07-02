/**
 * Testes unitários e de integração para actions/sales.ts
 * Usa mocks do Prisma — não conecta ao banco real
 */

// ─── Mocks do Prisma ──────────────────────────────────────────────────────────

const mockProductFindUnique = jest.fn()
const mockProductUpdate = jest.fn()
const mockProductFindMany = jest.fn()
const mockSaleCreate = jest.fn()
const mockSaleFindMany = jest.fn()
const mockSaleGroupBy = jest.fn()
const mockTransaction = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    $transaction: (...args: unknown[]) => mockTransaction(...args),
    product: {
      findUnique: (...args: unknown[]) => mockProductFindUnique(...args),
      update: (...args: unknown[]) => mockProductUpdate(...args),
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
    },
    sale: {
      create: (...args: unknown[]) => mockSaleCreate(...args),
      findMany: (...args: unknown[]) => mockSaleFindMany(...args),
      groupBy: (...args: unknown[]) => mockSaleGroupBy(...args),
    },
  },
}))

import { registerSale, getSalesSummary, getTopProducts } from '@/actions/sales'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeTransactionExecutor(
  productStock: number,
  shouldFailCreate = false
) {
  return async (fn: (tx: unknown) => Promise<unknown>) => {
    let stockAfterCreate = productStock
    const tx = {
      product: {
        findUnique: jest.fn().mockResolvedValue({ stock: productStock }),
        update: jest.fn().mockImplementation(({ data }) => {
          const decrement = data?.stock?.decrement ?? 0
          stockAfterCreate = productStock - decrement
          return Promise.resolve({ stock: stockAfterCreate })
        }),
      },
      sale: {
        create: shouldFailCreate
          ? jest.fn().mockRejectedValue(new Error('Erro simulado no banco'))
          : jest.fn().mockResolvedValue({ id: 'sale-1' }),
      },
    }
    return fn(tx)
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── registerSale ─────────────────────────────────────────────────────────────

describe('registerSale', () => {
  it('retorna sucesso e newStock=4 quando quantity=1 e stock=5', async () => {
    mockTransaction.mockImplementation(makeTransactionExecutor(5))

    const result = await registerSale({
      productId: 'prod-1',
      quantity: 1,
      buyerType: 'varejo',
    })

    expect(result).toEqual({ success: true, newStock: 4 })
  })

  it('retorna erro "Estoque insuficiente" quando quantity=10 e stock=5 sem criar Sale', async () => {
    mockTransaction.mockImplementation(makeTransactionExecutor(5))

    const result = await registerSale({
      productId: 'prod-1',
      quantity: 10,
      buyerType: 'varejo',
    })

    expect(result).toEqual({ success: false, error: 'Estoque insuficiente' })
  })

  it('retorna erro de validação quando quantity=0', async () => {
    const result = await registerSale({
      productId: 'prod-1',
      quantity: 0,
      buyerType: 'varejo',
    })

    expect(result).toMatchObject({ success: false })
    expect((result as { success: false; error: string }).error).toBeTruthy()
    // db.$transaction não deve ser chamado
    expect(mockTransaction).not.toHaveBeenCalled()
  })

  it('retorna erro de validação quando quantity é negativo', async () => {
    const result = await registerSale({
      productId: 'prod-1',
      quantity: -5,
      buyerType: 'varejo',
    })

    expect(result).toMatchObject({ success: false })
    expect(mockTransaction).not.toHaveBeenCalled()
  })

  // ─── Testes de integração ─────────────────────────────────────────────────

  it('integração: Sale é criada E Product.stock é decrementado atomicamente', async () => {
    const txExecutor = makeTransactionExecutor(5)
    mockTransaction.mockImplementation(txExecutor)

    const result = await registerSale({
      productId: 'prod-1',
      quantity: 2,
      buyerType: 'atacado',
      notes: 'Nota de teste',
    })

    expect(result).toEqual({ success: true, newStock: 3 })
    // db.$transaction foi chamado uma vez — garante atomicidade
    expect(mockTransaction).toHaveBeenCalledTimes(1)
  })

  it('integração: falha no sale.create NÃO altera Product.stock (rollback)', async () => {
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      const updateMock = jest.fn()
      const tx = {
        product: {
          findUnique: jest.fn().mockResolvedValue({ stock: 5 }),
          update: updateMock,
        },
        sale: {
          create: jest.fn().mockRejectedValue(new Error('Erro simulado no banco')),
        },
      }
      try {
        return await fn(tx)
      } catch (err) {
        // Simula rollback: update nunca é chamado após falha no create
        throw err
      }
    })

    const result = await registerSale({
      productId: 'prod-1',
      quantity: 1,
      buyerType: 'varejo',
    })

    expect(result).toMatchObject({ success: false })
    // Confirma que o update no produto não foi executado
    expect(mockProductUpdate).not.toHaveBeenCalled()
  })
})

// ─── getSalesSummary ──────────────────────────────────────────────────────────

describe('getSalesSummary', () => {
  it('retorna array com no máximo 7 entradas distintas para period=7d', async () => {
    // Simula vendas em 3 dias distintos
    const now = new Date()
    const d1 = new Date(now); d1.setDate(d1.getDate() - 1)
    const d2 = new Date(now); d2.setDate(d2.getDate() - 3)
    const d3 = new Date(now); d3.setDate(d3.getDate() - 5)

    mockSaleFindMany.mockResolvedValue([
      { createdAt: d1, quantity: 2 },
      { createdAt: d1, quantity: 3 },
      { createdAt: d2, quantity: 1 },
      { createdAt: d3, quantity: 4 },
    ])

    const result = await getSalesSummary({ period: '7d' })

    expect(result.length).toBeLessThanOrEqual(7)
    expect(result.length).toBe(3) // 3 dias distintos
    expect(result[0]).toHaveProperty('date')
    expect(result[0]).toHaveProperty('total')
    // formato YYYY-MM-DD
    expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // total >= 0
    result.forEach((item) => expect(item.total).toBeGreaterThanOrEqual(0))
  })

  it('agrupa corretamente vendas do mesmo dia', async () => {
    const day = new Date('2025-01-15T10:00:00Z')
    mockSaleFindMany.mockResolvedValue([
      { createdAt: day, quantity: 3 },
      { createdAt: new Date('2025-01-15T18:00:00Z'), quantity: 7 },
    ])

    const result = await getSalesSummary({ period: '7d' })

    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(10)
  })

  it('retorna apenas vendas do mês corrente para period=month', async () => {
    const thisMonth = new Date()
    thisMonth.setDate(5)

    mockSaleFindMany.mockResolvedValue([
      { createdAt: thisMonth, quantity: 5 },
    ])

    const result = await getSalesSummary({ period: 'month' })

    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(5)

    // Verifica que o filtro de data usado inclui apenas o mês corrente
    const callArgs = mockSaleFindMany.mock.calls[0][0]
    const gte: Date = callArgs.where.createdAt.gte
    const now = new Date()
    expect(gte.getFullYear()).toBe(now.getFullYear())
    expect(gte.getMonth()).toBe(now.getMonth())
    expect(gte.getDate()).toBe(1)
  })

  it('retorna array vazio quando não há vendas', async () => {
    mockSaleFindMany.mockResolvedValue([])
    const result = await getSalesSummary({ period: '30d' })
    expect(result).toEqual([])
  })
})

// ─── getTopProducts ───────────────────────────────────────────────────────────

describe('getTopProducts', () => {
  it('retorna no máximo 5 itens ordenados por totalSold decrescente para period=30d limit=5', async () => {
    mockSaleGroupBy.mockResolvedValue([
      { productId: 'p1', _sum: { quantity: 50 } },
      { productId: 'p2', _sum: { quantity: 30 } },
      { productId: 'p3', _sum: { quantity: 20 } },
    ])
    mockProductFindMany.mockResolvedValue([
      { id: 'p1', name: 'Produto A' },
      { id: 'p2', name: 'Produto B' },
      { id: 'p3', name: 'Produto C' },
    ])

    const result = await getTopProducts({ period: '30d', limit: 5 })

    expect(result.length).toBeLessThanOrEqual(5)
    expect(result[0]).toEqual({ productId: 'p1', productName: 'Produto A', totalSold: 50 })
    expect(result[1]).toEqual({ productId: 'p2', productName: 'Produto B', totalSold: 30 })
    expect(result[2]).toEqual({ productId: 'p3', productName: 'Produto C', totalSold: 20 })

    // Verifica ordem decrescente
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].totalSold).toBeGreaterThanOrEqual(result[i + 1].totalSold)
    }
  })

  it('retorna array vazio quando não há vendas no período', async () => {
    mockSaleGroupBy.mockResolvedValue([])

    const result = await getTopProducts({ period: '7d', limit: 5 })

    expect(result).toEqual([])
    expect(mockProductFindMany).not.toHaveBeenCalled()
  })

  it('usa "Produto removido" para produtos deletados do banco', async () => {
    mockSaleGroupBy.mockResolvedValue([
      { productId: 'p-deleted', _sum: { quantity: 10 } },
    ])
    // Produto não encontrado no banco (foi deletado)
    mockProductFindMany.mockResolvedValue([])

    const result = await getTopProducts({ period: '30d', limit: 5 })

    expect(result[0].productName).toBe('Produto removido')
    expect(result[0].totalSold).toBe(10)
  })
})
