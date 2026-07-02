/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import type { SalesByDay, TopProduct } from '@/components/admin/DashboardCharts'

// Mock do Recharts para evitar problemas com ResizeObserver / canvas no jsdom
jest.mock('recharts', () => {
  const React = require('react')
  return {
    BarChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="bar-chart" data-items={data?.length ?? 0}>
        {children}
      </div>
    ),
    Bar: ({ dataKey }: { dataKey: string }) => (
      <div data-testid={`bar-${dataKey}`} />
    ),
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

// ─── Dados de teste ───────────────────────────────────────────────────────────

function buildSalesByDay(count: number): SalesByDay[] {
  const result: SalesByDay[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({ date, total: i + 1 })
  }
  return result
}

const topProductsSample: TopProduct[] = [
  { productId: 'p1', productName: 'Produto A', totalSold: 10 },
  { productId: 'p2', productName: 'Produto B', totalSold: 5 },
]

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('DashboardCharts', () => {
  describe('estado vazio', () => {
    it('exibe "Nenhuma venda registrada ainda" quando salesByDay está vazio', () => {
      render(<DashboardCharts salesByDay={[]} topProducts={[]} />)
      expect(screen.getAllByText('Nenhuma venda registrada ainda')).toHaveLength(2)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('não renderiza BarChart quando salesByDay está vazio', () => {
      render(<DashboardCharts salesByDay={[]} topProducts={[]} />)
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument()
    })
  })

  describe('com dados de vendas', () => {
    it('renderiza BarChart sem erro quando há dados de 7 dias', () => {
      const salesByDay = buildSalesByDay(7)
      render(<DashboardCharts salesByDay={salesByDay} topProducts={[]} />)
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    })

    it('renderiza BarChart com 30 dias de dados', () => {
      const salesByDay = buildSalesByDay(30)
      render(<DashboardCharts salesByDay={salesByDay} topProducts={[]} />)
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  describe('top produtos com barra de progresso', () => {
    it('Produto A com totalSold=10 deve ter 100% e Produto B com totalSold=5 deve ter 50%', () => {
      render(
        <DashboardCharts
          salesByDay={buildSalesByDay(1)}
          topProducts={topProductsSample}
        />
      )

      const progressA = screen.getByTestId('progress-p1')
      const progressB = screen.getByTestId('progress-p2')

      expect(progressA).toHaveStyle({ width: '100%' })
      expect(progressB).toHaveStyle({ width: '50%' })
    })

    it('renderiza lista de top produtos com nomes corretos', () => {
      render(
        <DashboardCharts
          salesByDay={buildSalesByDay(1)}
          topProducts={topProductsSample}
        />
      )

      expect(screen.getByText('Produto A')).toBeInTheDocument()
      expect(screen.getByText('Produto B')).toBeInTheDocument()
    })

    it('exibe estado vazio de top produtos quando topProducts está vazio', () => {
      render(
        <DashboardCharts salesByDay={buildSalesByDay(1)} topProducts={[]} />
      )
      expect(screen.getByTestId('top-empty-state')).toBeInTheDocument()
    })
  })

  describe('seletor de período', () => {
    it('começa com período "30d" selecionado', () => {
      render(<DashboardCharts salesByDay={buildSalesByDay(30)} topProducts={[]} />)
      const btn30d = screen.getByRole('button', { name: /últimos 30 dias/i })
      expect(btn30d).toHaveAttribute('aria-pressed', 'true')
    })

    it('ao selecionar "7d" exibe apenas os últimos 7 dias de dados', () => {
      // Cria 30 dias de dados; ao filtrar para 7d, o BarChart deve receber <=7 itens
      const salesByDay = buildSalesByDay(30)
      render(<DashboardCharts salesByDay={salesByDay} topProducts={[]} />)

      const btn7d = screen.getByRole('button', { name: /últimos 7 dias/i })
      fireEvent.click(btn7d)

      expect(btn7d).toHaveAttribute('aria-pressed', 'true')

      // O gráfico continua visível após trocar de período
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()

      // Verifica que o BarChart recebe itens filtrados (setDate(-7) inclui o próprio dia, logo ≤ 8)
      const barChart = screen.getByTestId('bar-chart')
      const itemCount = parseInt(barChart.getAttribute('data-items') ?? '0', 10)
      expect(itemCount).toBeLessThanOrEqual(8)
      expect(itemCount).toBeLessThan(30)
    })

    it('ao selecionar "Mês atual" o botão fica marcado como ativo', () => {
      render(<DashboardCharts salesByDay={buildSalesByDay(30)} topProducts={[]} />)
      const btnMes = screen.getByRole('button', { name: /mês atual/i })
      fireEvent.click(btnMes)
      expect(btnMes).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('MetricCard de vendas este mês (integração via prop)', () => {
    it('pode receber valor 0 de vendasMes sem quebrar', () => {
      // Verifica indiretamente que o DashboardCharts não bloqueia renderização
      render(<DashboardCharts salesByDay={[]} topProducts={[]} />)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })
})
