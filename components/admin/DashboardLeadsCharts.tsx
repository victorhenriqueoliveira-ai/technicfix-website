'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { LeadsByDay, LeadsByType, LeadFunnel } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadPeriod = '7d' | '30d' | '90d'

interface DashboardLeadsChartsProps {
  leadsByDay: LeadsByDay[]       // dados dos últimos 90 dias
  leadsByType: LeadsByType[]     // dados dos últimos 90 dias
  leadFunnel: LeadFunnel[]       // todos os status (sem filtro de data)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

function filterByPeriod<T extends { date: string }>(data: T[], period: LeadPeriod): T[] {
  const today = new Date()
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const cutoff = formatDate(subDays(today, days))
  return data.filter((d) => d.date >= cutoff)
}

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// ─── Status label map ─────────────────────────────────────────────────────────

const statusLabels: Record<string, string> = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  convertido: 'Convertido',
  perdido: 'Perdido',
}

// ─── DashboardLeadsCharts ─────────────────────────────────────────────────────

export function DashboardLeadsCharts({
  leadsByDay,
  leadsByType,
  leadFunnel,
}: DashboardLeadsChartsProps) {
  const [period, setPeriod] = useState<LeadPeriod>('30d')

  const filteredLeadsByDay = useMemo(
    () => filterByPeriod(leadsByDay, period),
    [leadsByDay, period]
  )

  const filteredLeadsByType = useMemo(
    () => filterByPeriod(leadsByType, period),
    [leadsByType, period]
  )

  const lineChartData = filteredLeadsByDay.map((d) => ({
    date: formatDateLabel(d.date),
    total: d.total,
  }))

  const barStackedData = filteredLeadsByType.map((d) => ({
    date: formatDateLabel(d.date),
    varejo: d.varejo,
    atacado: d.atacado,
    geral: d.geral,
  }))

  const funnelData = leadFunnel.map((d) => ({
    status: statusLabels[d.status] ?? d.status,
    count: d.count,
  }))

  const periodLabels: Record<LeadPeriod, string> = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
  }

  return (
    <div className="mt-8 space-y-8">
      {/* ── Cabeçalho da seção ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900" data-testid="leads-section-title">
            Análise de Leads
          </h2>
          <p className="mt-1 text-sm text-gray-500" data-testid="leads-period-desc">
            Dados de {periodLabels[period].toLowerCase()} · Funil de conversão de todos os períodos
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Selecionar período de leads">
          {(['7d', '30d', '90d'] as LeadPeriod[]).map((p) => (
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
              data-testid={`period-btn-${p}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. Volume de leads por dia (Linha) ── */}
      <section className="rounded-lg border bg-white p-6 shadow-sm" data-testid="leads-by-day-section">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Volume de Leads por Dia
        </h3>

        {filteredLeadsByDay.length === 0 ? (
          <div
            className="flex h-[300px] items-center justify-center text-gray-400"
            data-testid="leads-by-day-empty"
          >
            Nenhum lead registrado no período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
              <Line
                type="monotone"
                dataKey="total"
                stroke="#111827"
                strokeWidth={2}
                dot={false}
                name="Leads"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ── 2. Composição por tipo (Barras empilhadas) ── */}
      <section className="rounded-lg border bg-white p-6 shadow-sm" data-testid="leads-by-type-section">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Leads por Tipo (Varejo / Atacado / Geral)
        </h3>

        {filteredLeadsByType.length === 0 ? (
          <div
            className="flex h-[300px] items-center justify-center text-gray-400"
            data-testid="leads-by-type-empty"
          >
            Nenhum lead registrado no período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barStackedData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
              <Legend />
              <Bar dataKey="varejo" stackId="a" fill="#111827" name="Varejo" />
              <Bar dataKey="atacado" stackId="a" fill="#6b7280" name="Atacado" />
              <Bar dataKey="geral" stackId="a" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Geral" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ── 3. Funil por status (Barras horizontais) ── */}
      <section className="rounded-lg border bg-white p-6 shadow-sm" data-testid="leads-funnel-section">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Funil de Conversão por Status
        </h3>

        {leadFunnel.length === 0 ? (
          <div
            className="flex h-[200px] items-center justify-center text-gray-400"
            data-testid="leads-funnel-empty"
          >
            Nenhum lead registrado
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={funnelData}
              margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="status"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                }}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
              />
              <Bar dataKey="count" fill="#111827" radius={[0, 4, 4, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  )
}
