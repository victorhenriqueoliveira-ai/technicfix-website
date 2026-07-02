'use client'

import { useState } from 'react'

export type SaleItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  buyerType: string
  notes: string | null
  createdAt: string
}

type Period = '7d' | '30d' | 'month'

const periodLabels: Record<Period, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  month: 'Mês atual',
}

const buyerTypeLabels: Record<string, string> = {
  varejo: 'Varejo',
  atacado: 'Atacado',
  geral: 'Geral',
}

function getStartDate(period: Period): Date {
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
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

interface SalesListProps {
  sales: SaleItem[]
}

export function SalesList({ sales }: SalesListProps) {
  const [period, setPeriod] = useState<Period>('30d')

  const startDate = getStartDate(period)
  const filtered = sales.filter((s) => new Date(s.createdAt) >= startDate)

  return (
    <div>
      {/* Filtro de período */}
      <div className="mb-4 flex items-center gap-2" data-testid="period-filter">
        <span className="text-sm font-medium text-gray-700">Período:</span>
        <div className="flex gap-1">
          {(Object.entries(periodLabels) as [Period, string][]).map(([p, label]) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              data-testid={`period-btn-${p}`}
              aria-pressed={period === p}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de vendas */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200" data-testid="sales-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Qtd
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                  data-testid="empty-state"
                >
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            ) : (
              filtered.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50" data-testid={`sale-row-${sale.id}`}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {sale.productName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {sale.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {buyerTypeLabels[sale.buyerType] ?? sale.buyerType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.notes ?? '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
