/**
 * Testes unitários para o badge de estoque da listagem de produtos admin.
 * Cobre os três estados: estoque normal, estoque baixo (laranja) e esgotado (vermelho).
 */

// Importa apenas a função helper, sem carregar o módulo de página completo
// (que exige ambiente DB). O module jest.mock é necessário para isolar dependências.
jest.mock('@/lib/prisma', () => ({
  db: {},
}))

jest.mock('@/components/admin/products/DeleteProductButton', () => ({
  DeleteProductButton: () => null,
}))

jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: unknown }) => children
  MockLink.displayName = 'MockLink'
  return MockLink
})

import { getStockDisplay } from '@/app/(admin)/admin/produtos/page'

describe('getStockDisplay — badge de estoque na listagem admin', () => {
  describe('estoque normal (stock > 5)', () => {
    it('stock=6 — sem badge, texto numérico, classe neutra', () => {
      const result = getStockDisplay(6)
      expect(result.hasBadge).toBe(false)
      expect(result.text).toBe('6')
      expect(result.className).toContain('text-gray-500')
      expect(result.className).not.toContain('bg-')
    })

    it('stock=10 — sem badge de alerta', () => {
      const result = getStockDisplay(10)
      expect(result.hasBadge).toBe(false)
      expect(result.text).toBe('10')
      expect(result.className).not.toContain('bg-red')
      expect(result.className).not.toContain('bg-yellow')
    })

    it('stock=100 — sem badge de alerta', () => {
      const result = getStockDisplay(100)
      expect(result.hasBadge).toBe(false)
      expect(result.text).toBe('100')
    })
  })

  describe('estoque baixo (stock <= 5 && stock > 0) — badge amarelo/laranja', () => {
    it('stock=5 — badge amarelo com valor "5"', () => {
      const result = getStockDisplay(5)
      expect(result.hasBadge).toBe(true)
      expect(result.text).toBe('5')
      expect(result.className).toContain('bg-yellow-100')
      expect(result.className).toContain('text-yellow-800')
    })

    it('stock=1 — badge amarelo com valor "1"', () => {
      const result = getStockDisplay(1)
      expect(result.hasBadge).toBe(true)
      expect(result.text).toBe('1')
      expect(result.className).toContain('bg-yellow-100')
      expect(result.className).toContain('text-yellow-800')
    })

    it('stock=3 — badge amarelo com valor "3"', () => {
      const result = getStockDisplay(3)
      expect(result.hasBadge).toBe(true)
      expect(result.text).toBe('3')
      expect(result.className).toContain('bg-yellow-100')
      expect(result.className).not.toContain('bg-red')
    })
  })

  describe('produto esgotado (stock === 0) — badge vermelho "Esgotado"', () => {
    it('stock=0 — badge vermelho com texto "Esgotado"', () => {
      const result = getStockDisplay(0)
      expect(result.hasBadge).toBe(true)
      expect(result.text).toBe('Esgotado')
      expect(result.className).toContain('bg-red-100')
      expect(result.className).toContain('text-red-800')
    })

    it('stock=0 — NÃO exibe valor numérico', () => {
      const result = getStockDisplay(0)
      expect(result.text).not.toBe('0')
      expect(result.text).toBe('Esgotado')
    })
  })

  describe('limiar exato do alerta', () => {
    it('stock=6 — acima do limiar, sem badge (limiar exclusivo acima de 5)', () => {
      const result = getStockDisplay(6)
      expect(result.hasBadge).toBe(false)
    })

    it('stock=5 — no limiar, com badge (inclusivo)', () => {
      const result = getStockDisplay(5)
      expect(result.hasBadge).toBe(true)
    })
  })
})
