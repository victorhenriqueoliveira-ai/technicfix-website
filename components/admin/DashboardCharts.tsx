'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SalesByDay = {
  date: string
  total: number
}

export type TopProduct = {
  productId: string
  productName: string
  totalSold: number
}

export type Period = '7d' | '30d' | 'month'

interface DashboardChartsProps {
  salesByDay: SalesByDay[]
  topProducts: TopProduct[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterByPeriod(data: SalesByDay[], period: Period): SalesByDay[] {
  if (period === '30d') return data

  const now = new Date()

  if (period === '7d') {
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - 7)
    const cutoffStr = formatDate(cutoff)
    return data.filter((d) => d.date >= cutoffStr)
  }

  // 'month' — mês corrente
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  return data.filter((d) => d.date >= startOfMonth)
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// ─── DashboardCharts ──────────────────────────────────────────────────────────

export function DashboardCharts({ salesByDay, topProducts }: DashboardChartsProps) {
  const [period, setPeriod] = useState<Period>('30d')

  const filteredData = useMemo(
    () => filterByPeriod(salesByDay, period),
    [salesByDay, period]
  )

  const chartData = filteredData.map((d) => ({
    date: formatDateLabel(d.date),
    total: d.total,
  }))

  const maxSold = topProducts.length > 0
    ? Math.max(...topProducts.map((p) => p.totalSold))
    : 0

  const isEmpty = salesByDay.length === 0

  const periodLabels: Record<Period, string> = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    month: 'Mês atual',
  }

  return (
    <div className="mt-8 space-y-8">
      {/* ── Gráfico de vendas por dia ── */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Vendas por dia</h2>
          <div className="flex gap-2" role="group" aria-label="Selecionar período">
            {(['7d', '30d', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={period === p}
                data-period={p}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {isEmpty ? (
          <div
            className="flex h-[300px] items-center justify-center text-gray-400"
            data-testid="empty-state"
          >
            Nenhuma venda registrada ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                }}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
              />
              <Bar dataKey="total" fill="#111827" radius={[4, 4, 0, 0]} name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ── Top 5 produtos mais vendidos ── */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Top 5 produtos mais vendidos
        </h2>

        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400" data-testid="top-empty-state">
            Nenhuma venda registrada ainda
          </p>
        ) : (
          <ul className="space-y-3" data-testid="top-products-list">
            {topProducts.map((product) => {
              const percentage =
                maxSold > 0
                  ? Math.round((product.totalSold / maxSold) * 100)
                  : 0

              return (
                <li key={product.productId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {product.productName}
                    </span>
                    <span className="text-gray-500">{product.totalSold} un.</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-gray-900 transition-all"
                      style={{ width: `${percentage}%` }}
                      data-testid={`progress-${product.productId}`}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                      aria-label={`${product.productName}: ${percentage}%`}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
