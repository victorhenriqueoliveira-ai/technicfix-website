import { unstable_cache } from 'next/cache'
import { db } from '@/lib/prisma'
import { MetricCard } from '@/components/admin/MetricCard'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import { DashboardLeadsCharts } from '@/components/admin/DashboardLeadsCharts'
import { getSalesSummary, getTopProducts } from '@/actions/sales'
import { Package, Tag, Users, ShoppingCart } from 'lucide-react'
import type { LeadsByDay, LeadsByType, LeadFunnel } from '@/lib/types'

const getDashboardData = unstable_cache(
  async () => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    return Promise.all([
      db.product.count(),
      db.category.count(),
      db.lead.count({ where: { status: 'novo' } }),
      db.sale.aggregate({ _count: true, where: { createdAt: { gte: startOfMonth } } }),
      getSalesSummary({ period: '30d' }),
      getTopProducts({ period: '30d', limit: 5 }),
      db.lead.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: ninetyDaysAgo } },
        orderBy: { createdAt: 'asc' },
      }),
      db.lead.groupBy({
        by: ['type', 'createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: ninetyDaysAgo } },
      }),
      db.lead.groupBy({ by: ['status'], _count: { id: true } }),
    ])
  },
  ['admin-dashboard'],
  { revalidate: 120 }
)

export default async function AdminDashboardPage() {
  const [
    totalProdutos,
    totalCategorias,
    leadsNovos,
    vendasMes,
    salesByDay,
    topProducts,
    leadsByDayRaw,
    leadsByTypeRaw,
    leadFunnelRaw,
  ] = await getDashboardData()

  // ─── Processar leadsByDay ────────────────────────────────────────────────────
  const leadsByDayMap: Record<string, number> = {}
  for (const row of leadsByDayRaw) {
    const dateStr = row.createdAt.toISOString().slice(0, 10)
    leadsByDayMap[dateStr] = (leadsByDayMap[dateStr] ?? 0) + row._count.id
  }
  const leadsByDay: LeadsByDay[] = Object.entries(leadsByDayMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // ─── Processar leadsByType ───────────────────────────────────────────────────
  const leadsByTypeMap: Record<string, { varejo: number; atacado: number; geral: number }> = {}
  for (const row of leadsByTypeRaw) {
    const dateStr = row.createdAt.toISOString().slice(0, 10)
    if (!leadsByTypeMap[dateStr]) {
      leadsByTypeMap[dateStr] = { varejo: 0, atacado: 0, geral: 0 }
    }
    const type = row.type as 'varejo' | 'atacado' | 'geral'
    if (type in leadsByTypeMap[dateStr]) {
      leadsByTypeMap[dateStr][type] += row._count.id
    }
  }
  const leadsByType: LeadsByType[] = Object.entries(leadsByTypeMap)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // ─── Processar leadFunnel ────────────────────────────────────────────────────
  const leadFunnel: LeadFunnel[] = leadFunnelRaw.map((row) => ({
    status: row.status,
    count: row._count.id,
  }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Produtos"
          value={totalProdutos}
          icon={<Package className="h-5 w-5" />}
        />
        <MetricCard
          title="Total de Categorias"
          value={totalCategorias}
          icon={<Tag className="h-5 w-5" />}
        />
        <MetricCard
          title="Leads Novos"
          value={leadsNovos}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Vendas este mês"
          value={vendasMes._count}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
      </div>

      <DashboardCharts salesByDay={salesByDay} topProducts={topProducts} />

      <DashboardLeadsCharts
        leadsByDay={leadsByDay}
        leadsByType={leadsByType}
        leadFunnel={leadFunnel}
      />
    </div>
  )
}
