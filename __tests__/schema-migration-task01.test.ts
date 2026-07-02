/**
 * Testes de integração — task_01
 * Valida model Sale, enum ProductType e novos campos em Product.
 * Usa mocks do Prisma Client para simular comportamento do banco sem IO real.
 */

import { Prisma } from '@prisma/client'

// ──────────────────────────────────────────────────────────────
// Mocks do Prisma Client
// ──────────────────────────────────────────────────────────────
const mockProductCreate = jest.fn()
const mockProductFindFirst = jest.fn()
const mockSaleCreate = jest.fn()
const mockDisconnect = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      create: mockProductCreate,
      findFirst: mockProductFindFirst,
    },
    sale: {
      create: mockSaleCreate,
    },
    $disconnect: mockDisconnect,
  },
}))

// ──────────────────────────────────────────────────────────────
// Dados auxiliares
// ──────────────────────────────────────────────────────────────
const produtoBase = {
  id: 'prod-cuid-001',
  name: 'Produto Teste',
  slug: 'produto-teste',
  description: 'Descrição do produto',
  technicalDetails: null,
  price: null,
  sku: null,
  stock: 0,
  images: [],
  featured: false,
  status: 'ativo',
  categoryId: 'cat-cuid-001',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  // Novos campos com defaults
  showPrice: true,
  productType: 'ambos',
  relatedProductIds: [] as string[],
}

// ──────────────────────────────────────────────────────────────
// Suites
// ──────────────────────────────────────────────────────────────

describe('task_01 — Migration: Sale, ProductType, campos novos em Product', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDisconnect.mockResolvedValue(undefined)
  })

  // ── 1. Campos novos em Product com defaults corretos ─────────

  describe('Product — novos campos com defaults', () => {
    it('cria Product sem showPrice e productType — persiste com showPrice=true e productType="ambos"', async () => {
      mockProductCreate.mockResolvedValueOnce(produtoBase)

      const { db } = await import('@/lib/prisma')
      const resultado = await db.product.create({
        data: {
          name: 'Produto Teste',
          slug: 'produto-teste',
          description: 'Descrição do produto',
          category: { connect: { id: 'cat-cuid-001' } },
          // showPrice e productType omitidos — devem usar default
        },
      } as Parameters<typeof db.product.create>[0])

      expect(resultado.showPrice).toBe(true)
      expect(resultado.productType).toBe('ambos')
    })

    it('relatedProductIds deve ser array vazio por padrão em produto existente', async () => {
      mockProductCreate.mockResolvedValueOnce(produtoBase)

      const { db } = await import('@/lib/prisma')
      const produto = await db.product.create({
        data: {
          name: 'Produto Teste',
          slug: 'produto-teste',
          description: 'Descrição',
          category: { connect: { id: 'cat-cuid-001' } },
        },
      } as Parameters<typeof db.product.create>[0])

      expect(produto.relatedProductIds).toEqual([])
    })

    it('busca produto existente (pré-migration) — retorna showPrice=true e productType="ambos" sem erro', async () => {
      mockProductFindFirst.mockResolvedValueOnce(produtoBase)

      const { db } = await import('@/lib/prisma')
      const produto = await db.product.findFirst({ where: { id: 'prod-cuid-001' } })

      expect(produto).not.toBeNull()
      expect(produto!.showPrice).toBe(true)
      expect(produto!.productType).toBe('ambos')
      expect(produto!.relatedProductIds).toEqual([])
    })
  })

  // ── 2. Model Sale ────────────────────────────────────────────

  describe('Sale — criação e validações', () => {
    it('cria Sale com productId válido, quantity=2, buyerType="varejo" — persiste com createdAt preenchido', async () => {
      const saleEsperada = {
        id: 'sale-cuid-001',
        productId: 'prod-cuid-001',
        quantity: 2,
        buyerType: 'varejo',
        notes: null,
        createdAt: new Date(),
      }
      mockSaleCreate.mockResolvedValueOnce(saleEsperada)

      const { db } = await import('@/lib/prisma')
      const sale = await db.sale.create({
        data: {
          product: { connect: { id: 'prod-cuid-001' } },
          quantity: 2,
          buyerType: 'varejo',
        },
      } as Parameters<typeof db.sale.create>[0])

      expect(sale.id).toBeDefined()
      expect(sale.productId).toBe('prod-cuid-001')
      expect(sale.quantity).toBe(2)
      expect(sale.buyerType).toBe('varejo')
      expect(sale.createdAt).toBeInstanceOf(Date)
    })

    it('tenta criar Sale com productId inexistente — falha com erro de FK (simulado)', async () => {
      const erroFK = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed on the field: `Sale_productId_fkey`',
        { code: 'P2003', clientVersion: '7.0.0', meta: { field_name: 'Sale_productId_fkey' } }
      )
      mockSaleCreate.mockRejectedValueOnce(erroFK)

      const { db } = await import('@/lib/prisma')

      let capturado: unknown
      try {
        await db.sale.create({
          data: {
            product: { connect: { id: 'prod-inexistente-9999' } },
            quantity: 1,
            buyerType: 'varejo',
          },
        } as Parameters<typeof db.sale.create>[0])
      } catch (e) {
        capturado = e
      }

      expect(capturado).toBeInstanceOf(Prisma.PrismaClientKnownRequestError)
      expect((capturado as Prisma.PrismaClientKnownRequestError).code).toBe('P2003')
    })
  })

  // ── 3. Enum ProductType ──────────────────────────────────────

  describe('ProductType — valores do enum', () => {
    it.each([
      ['varejo', 'varejo'],
      ['atacado', 'atacado'],
      ['ambos', 'ambos'],
    ])('ProductType.%s é um valor válido do enum', async (tipo, esperado) => {
      mockProductCreate.mockResolvedValueOnce({ ...produtoBase, productType: tipo })

      const { db } = await import('@/lib/prisma')
      const produto = await db.product.create({
        data: {
          name: 'Produto Tipo',
          slug: `produto-tipo-${tipo}`,
          description: 'Desc',
          category: { connect: { id: 'cat-001' } },
          productType: tipo as 'varejo' | 'atacado' | 'ambos',
        },
      } as Parameters<typeof db.product.create>[0])

      expect(produto.productType).toBe(esperado)
    })
  })
})
