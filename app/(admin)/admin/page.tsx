import { db } from '@/lib/prisma'
import { MetricCard } from '@/components/admin/MetricCard'
import { Package, Tag, Users } from 'lucide-react'

export default async function AdminDashboardPage() {
  const [totalProdutos, totalCategorias, leadsNovos] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.lead.count({ where: { status: 'novo' } }),
  ])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  )
}
