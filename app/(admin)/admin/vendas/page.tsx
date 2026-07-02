import { db } from '@/lib/prisma'
import { SalesList } from '@/components/admin/SalesList'
import { RegisterSaleDrawer } from '@/components/admin/RegisterSaleDrawer'

export default async function VendasPage() {
  const [sales, products] = await Promise.all([
    db.sale.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { id: true, name: true } } },
    }),
    db.product.findMany({
      where: { status: 'ativo', stock: { gt: 0 } },
      select: { id: true, name: true, stock: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const serializedSales = sales.map((s) => ({
    id: s.id,
    productId: s.productId,
    productName: s.product.name,
    quantity: s.quantity,
    buyerType: s.buyerType as string,
    notes: s.notes ?? null,
    createdAt: s.createdAt.toISOString(),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <RegisterSaleDrawer products={products} />
      </div>
      <SalesList sales={serializedSales} />
    </div>
  )
}
