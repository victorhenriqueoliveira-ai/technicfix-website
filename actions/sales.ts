'use server'

import { db } from '@/lib/prisma'
import type { LeadType } from '@prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegisterSaleInput = {
  productId: string
  quantity: number
  buyerType: LeadType
  notes?: string
}

export type RegisterSaleResult =
  | { success: true; newStock: number }
  | { success: false; error: string }

export type SalesSummaryItem = {
  date: string
  total: number
}

export type TopProductItem = {
  productId: string
  productName: string
  totalSold: number
}

export type SalesPeriod = '7d' | '30d' | 'month'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStartDate(period: SalesPeriod): Date {
  const now = new Date()
  if (period === '7d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    return d
  }
  if (period === '30d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 30)
    return d
  }
  // 'month' — início do mês corrente
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ─── registerSale ─────────────────────────────────────────────────────────────

export async function registerSale(
  input: RegisterSaleInput
): Promise<RegisterSaleResult> {
  const { productId, quantity, buyerType, notes } = input

  if (!quantity || quantity <= 0) {
    return { success: false, error: 'Quantidade deve ser maior que zero' }
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      })

      if (!product) {
        throw new Error('Produto não encontrado')
      }

      if (quantity > product.stock) {
        throw new Error('Estoque insuficiente')
      }

      await tx.sale.create({
        data: { productId, quantity, buyerType, notes },
      })

      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
        select: { stock: true },
      })

      return updated.stock
    })

    return { success: true, newStock: result }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao registrar venda'
    return { success: false, error: message }
  }
}

// ─── getSalesSummary ──────────────────────────────────────────────────────────

export async function getSalesSummary(input: {
  period: SalesPeriod
}): Promise<SalesSummaryItem[]> {
  const startDate = getStartDate(input.period)

  const sales = await db.sale.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, quantity: true },
    orderBy: { createdAt: 'asc' },
  })

  // Agrupa por dia
  const grouped = new Map<string, number>()
  for (const sale of sales) {
    const key = formatDate(sale.createdAt)
    grouped.set(key, (grouped.get(key) ?? 0) + sale.quantity)
  }

  return Array.from(grouped.entries()).map(([date, total]) => ({ date, total }))
}

// ─── getTopProducts ───────────────────────────────────────────────────────────

export async function getTopProducts(input: {
  period: SalesPeriod
  limit: number
}): Promise<TopProductItem[]> {
  const startDate = getStartDate(input.period)

  const grouped = await db.sale.groupBy({
    by: ['productId'],
    where: { createdAt: { gte: startDate } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: input.limit,
  })

  if (grouped.length === 0) return []

  const productIds = grouped.map((g) => g.productId)
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  })

  const nameMap = new Map(products.map((p) => [p.id, p.name]))

  return grouped.map((g) => ({
    productId: g.productId,
    productName: nameMap.get(g.productId) ?? 'Produto removido',
    totalSold: g._sum.quantity ?? 0,
  }))
}
