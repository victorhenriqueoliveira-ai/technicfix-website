import { db } from '@/lib/prisma'
import { MetricCard } from '@/components/admin/MetricCard'
import { DashboardCharts } from '@/components/admin/DashboardCharts'
import { getSalesSummary, getTopProducts } from '@/actions/sales'
import { Package, Tag, Users, ShoppingCart } from 'lucide-react'

export default async function AdminDashboardPage() {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )

  const [
    totalProdutos,
    totalCategorias,
    leadsNovos,
    vendasMes,
    salesByDay,
    topProducts,
  ] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.lead.count({ where: { status: 'novo' } }),
    db.sale.aggregate({
      _count: true,
      where: { createdAt: { gte: startOfMonth } },
    }),
    getSalesSummary({ period: '30d' }),
    getTopProducts({ period: '30d', limit: 5 }),
  ])

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
    </div>
  )
}
