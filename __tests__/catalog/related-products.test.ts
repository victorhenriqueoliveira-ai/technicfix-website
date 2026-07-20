/**
 * Testes unitários — RelatedProducts (task_09)
 *
 * Valida:
 * - Retorna null com menos de 3 produtos
 * - Container usa flex + overflow-x-auto + snap-x + snap-mandatory quando há 3+ produtos
 * - Cada wrapper de card tem flex-none e snap-start
 * - Componente é Server Component (sem 'use client')
 */

import fs from 'node:fs'
import path from 'node:path'
import type React from 'react'

// ── Mocks do Prisma ───────────────────────────────────────────────────────────
const mockProductFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
    },
  },
}))

// ── Mock do ProductCard ───────────────────────────────────────────────────────
jest.mock('@/components/catalog/ProductCard', () => ({
  ProductCard: jest.fn(({ product }: { product: { id: string } }) => {
    // Retorna null — apenas precisamos inspecionar a estrutura JSX
    return null
  }),
}))

// ── Helpers para traversal de JSX ────────────────────────────────────────────
type AnyNode = React.ReactNode

function flattenJSX(node: AnyNode): React.ReactElement[] {
  const results: React.ReactElement[] = []
  if (node === null || node === undefined) return results
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return results
  if (Array.isArray(node)) {
    for (const child of node) {
      results.push(...flattenJSX(child))
    }
    return results
  }
  const el = node as React.ReactElement
  if (typeof el !== 'object' || !('type' in el)) return results
  results.push(el)
  const children: AnyNode = el?.props?.children
  if (children !== undefined && children !== null) {
    results.push(...flattenJSX(children))
  }
  return results
}

function findByTagAndClass(node: AnyNode, tag: string, cls: string): React.ReactElement | null {
  const elements = flattenJSX(node)
  return (
    elements.find((el) => {
      if (el.type !== tag) return false
      const className: string = el?.props?.className ?? ''
      return className.includes(cls)
    }) ?? null
  )
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
function makeProduto(idx: number) {
  return {
    id: `prod-${idx}`,
    name: `Produto ${idx}`,
    slug: `produto-${idx}`,
    price: 10.0,
    images: [],
    badge: null,
    featured: false,
    showPrice: true,
    status: 'ativo',
    categoryId: 'cat-1',
    category: { name: 'Categoria', slug: 'categoria' },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

const mockProdutos3 = [makeProduto(1), makeProduto(2), makeProduto(3)]
const mockProdutos2 = [makeProduto(1), makeProduto(2)]

// ── Setup ─────────────────────────────────────────────────────────────────────
beforeEach(() => {
  mockProductFindMany.mockReset()
  jest.resetModules()
})

// ── Testes ────────────────────────────────────────────────────────────────────
describe('RelatedProducts — carrossel CSS scroll snap (task_09)', () => {
  // ── Verificação de Server Component ──────────────────────────────────────
  describe('Server Component', () => {
    it('não contém "use client" no código-fonte do arquivo', () => {
      const filePath = path.resolve(
        __dirname,
        '../../components/catalog/RelatedProducts.tsx',
      )
      const source = fs.readFileSync(filePath, 'utf-8')
      expect(source).not.toMatch(/['"]use client['"]/)
    })
  })

  // ── Retorno null com menos de 3 produtos ──────────────────────────────────
  describe('retorno null', () => {
    it('retorna null quando há 0 produtos', async () => {
      // manual retorna 0, auto retorna 0
      mockProductFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: [],
      })
      expect(result).toBeNull()
    })

    it('retorna null quando há menos de 3 produtos (2 produtos)', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos2).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2'],
      })
      expect(result).toBeNull()
    })
  })

  // ── Container flex scroll snap ────────────────────────────────────────────
  describe('container com 3+ produtos', () => {
    it('container tem classe overflow-x-auto', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const container = findByTagAndClass(result, 'div', 'overflow-x-auto')
      expect(container).not.toBeNull()
    })

    it('container tem classe snap-x', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const container = findByTagAndClass(result, 'div', 'snap-x')
      expect(container).not.toBeNull()
    })

    it('container tem classe snap-mandatory', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const container = findByTagAndClass(result, 'div', 'snap-mandatory')
      expect(container).not.toBeNull()
    })

    it('container NÃO usa grid (não tem classe "grid")', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      // Nenhum div deve ter a classe "grid" isolada como classe principal
      const gridContainer = findByTagAndClass(result, 'div', 'grid grid-cols')
      expect(gridContainer).toBeNull()
    })
  })

  // ── Wrapper de cada card: flex-none e snap-start ─────────────────────────
  describe('wrapper dos cards', () => {
    it('cada wrapper tem classe flex-none', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const wrapper = findByTagAndClass(result, 'div', 'flex-none')
      expect(wrapper).not.toBeNull()
    })

    it('cada wrapper tem classe snap-start', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const wrapper = findByTagAndClass(result, 'div', 'snap-start')
      expect(wrapper).not.toBeNull()
    })

    it('cada wrapper tem classe w-52', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const wrapper = findByTagAndClass(result, 'div', 'w-52')
      expect(wrapper).not.toBeNull()
    })
  })

  // ── Título visível ────────────────────────────────────────────────────────
  describe('título da seção', () => {
    it('renderiza h2 com "Produtos Relacionados"', async () => {
      mockProductFindMany.mockResolvedValueOnce(mockProdutos3).mockResolvedValueOnce([])
      const { RelatedProducts } = await import('@/components/catalog/RelatedProducts')
      const result = await RelatedProducts({
        productId: 'prod-0',
        categoryId: 'cat-1',
        relatedProductIds: ['prod-1', 'prod-2', 'prod-3'],
      })
      const elements = flattenJSX(result)
      const h2 = elements.find(
        (el) => el.type === 'h2' && String(el?.props?.children ?? '').includes('Produtos Relacionados'),
      )
      expect(h2).not.toBeUndefined()
    })
  })
})
