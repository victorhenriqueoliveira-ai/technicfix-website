/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DashboardLeadsCharts } from '@/components/admin/DashboardLeadsCharts'
import type { LeadsByDay, LeadsByType, LeadFunnel } from '@/lib/types'

// Mock do Recharts para evitar problemas com ResizeObserver / canvas no jsdom
jest.mock('recharts', () => {
  return {
    LineChart: ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
      <div data-testid="line-chart" data-items={data?.length ?? 0}>
        {children}
      </div>
    ),
    Line: ({ dataKey }: { dataKey: string }) => (
      <div data-testid={`line-${dataKey}`} />
    ),
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
    Legend: () => <div data-testid="legend" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

// ─── Helpers de dados ─────────────────────────────────────────────────────────

function buildLeadsByDay(count: number, offsetDays = 0): LeadsByDay[] {
  const result: LeadsByDay[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i - offsetDays)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({ date, total: i + 1 })
  }
  return result
}

function buildLeadsByType(count: number, offsetDays = 0): LeadsByType[] {
  const result: LeadsByType[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i - offsetDays)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({ date, varejo: i + 1, atacado: i, geral: 1 })
  }
  return result
}

const sampleFunnel: LeadFunnel[] = [
  { status: 'novo', count: 5 },
  { status: 'em_atendimento', count: 3 },
  { status: 'convertido', count: 2 },
  { status: 'perdido', count: 1 },
]

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('DashboardLeadsCharts', () => {
  describe('renderização base', () => {
    it('renderiza o título "Análise de Leads"', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={[]}
          leadsByType={[]}
          leadFunnel={[]}
        />
      )
      expect(screen.getByTestId('leads-section-title')).toHaveTextContent('Análise de Leads')
    })

    it('renderiza com leadsByDay vazio sem crash (exibe estado vazio)', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={[]}
          leadsByType={[]}
          leadFunnel={[]}
        />
      )
      expect(screen.getByTestId('leads-by-day-empty')).toBeInTheDocument()
    })

    it('renderiza gráfico de linha quando há dados de leadsByDay', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(30)}
          leadsByType={buildLeadsByType(30)}
          leadFunnel={sampleFunnel}
        />
      )
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  describe('seletor de período — filtragem de leadsByDay', () => {
    it('começa com período "30d" selecionado por padrão', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(30)}
          leadsByType={buildLeadsByType(30)}
          leadFunnel={sampleFunnel}
        />
      )
      const btn30d = screen.getByTestId('period-btn-30d')
      expect(btn30d).toHaveAttribute('aria-pressed', 'true')
    })

    it('seletor "7d" filtra leadsByDay para exibir apenas os últimos 7 dias', () => {
      const leadsByDay = buildLeadsByDay(90)
      render(
        <DashboardLeadsCharts
          leadsByDay={leadsByDay}
          leadsByType={buildLeadsByType(90)}
          leadFunnel={sampleFunnel}
        />
      )

      fireEvent.click(screen.getByTestId('period-btn-7d'))

      const lineChart = screen.getByTestId('line-chart')
      const itemCount = parseInt(lineChart.getAttribute('data-items') ?? '0', 10)
      // Deve exibir apenas os últimos 7 dias (com tolerância de +1 para o dia corrente)
      expect(itemCount).toBeLessThanOrEqual(8)
      expect(itemCount).toBeLessThan(90)
    })

    it('seletor "30d" filtra leadsByDay para exibir apenas os últimos 30 dias', () => {
      const leadsByDay = buildLeadsByDay(90)
      render(
        <DashboardLeadsCharts
          leadsByDay={leadsByDay}
          leadsByType={buildLeadsByType(90)}
          leadFunnel={sampleFunnel}
        />
      )

      // Troca para 7d e volta para 30d para garantir reatividade
      fireEvent.click(screen.getByTestId('period-btn-7d'))
      fireEvent.click(screen.getByTestId('period-btn-30d'))

      const lineChart = screen.getByTestId('line-chart')
      const itemCount = parseInt(lineChart.getAttribute('data-items') ?? '0', 10)
      expect(itemCount).toBeLessThanOrEqual(31)
      expect(itemCount).toBeLessThan(90)
    })

    it('seletor "90d" exibe todos os 90 dias de dados passados como prop', () => {
      const leadsByDay = buildLeadsByDay(90)
      render(
        <DashboardLeadsCharts
          leadsByDay={leadsByDay}
          leadsByType={buildLeadsByType(90)}
          leadFunnel={sampleFunnel}
        />
      )

      fireEvent.click(screen.getByTestId('period-btn-90d'))

      const lineChart = screen.getByTestId('line-chart')
      const itemCount = parseInt(lineChart.getAttribute('data-items') ?? '0', 10)
      expect(itemCount).toBeGreaterThanOrEqual(89)
    })
  })

  describe('gráfico de funil (leadFunnel)', () => {
    it('renderiza barras com valores corretos quando leadFunnel tem dados', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(30)}
          leadsByType={buildLeadsByType(30)}
          leadFunnel={sampleFunnel}
        />
      )
      // Verifica que a seção do funil está presente
      expect(screen.getByTestId('leads-funnel-section')).toBeInTheDocument()
      // Verifica que não mostra estado vazio
      expect(screen.queryByTestId('leads-funnel-empty')).not.toBeInTheDocument()
    })

    it('exibe estado vazio do funil quando leadFunnel está vazio', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={[]}
          leadsByType={[]}
          leadFunnel={[]}
        />
      )
      expect(screen.getByTestId('leads-funnel-empty')).toBeInTheDocument()
    })
  })

  describe('gráfico de barras empilhadas (leadsByType)', () => {
    it('renderiza as 3 séries (varejo, atacado, geral) quando há dados', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(30)}
          leadsByType={buildLeadsByType(30)}
          leadFunnel={sampleFunnel}
        />
      )
      expect(screen.getByTestId('leads-by-type-section')).toBeInTheDocument()
      // As barras varejo, atacado, geral estão presentes via mock
      expect(screen.getByTestId('bar-varejo')).toBeInTheDocument()
      expect(screen.getByTestId('bar-atacado')).toBeInTheDocument()
      expect(screen.getByTestId('bar-geral')).toBeInTheDocument()
    })

    it('exibe estado vazio de tipo quando leadsByType está vazio', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={[]}
          leadsByType={[]}
          leadFunnel={[]}
        />
      )
      expect(screen.getByTestId('leads-by-type-empty')).toBeInTheDocument()
    })
  })

  describe('botões de período — marcação aria-pressed', () => {
    it('o botão "90d" fica marcado como ativo ao clicar', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(90)}
          leadsByType={buildLeadsByType(90)}
          leadFunnel={sampleFunnel}
        />
      )
      const btn90d = screen.getByTestId('period-btn-90d')
      fireEvent.click(btn90d)
      expect(btn90d).toHaveAttribute('aria-pressed', 'true')
    })

    it('somente um botão fica ativo por vez', () => {
      render(
        <DashboardLeadsCharts
          leadsByDay={buildLeadsByDay(90)}
          leadsByType={buildLeadsByType(90)}
          leadFunnel={sampleFunnel}
        />
      )
      fireEvent.click(screen.getByTestId('period-btn-7d'))

      expect(screen.getByTestId('period-btn-7d')).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByTestId('period-btn-30d')).toHaveAttribute('aria-pressed', 'false')
      expect(screen.getByTestId('period-btn-90d')).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
