import { db } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { createProduct } from '@/actions/products'

export default async function NovoProdutoPage() {
  const [categories, allProducts] = await Promise.all([
    db.category.findMany({ orderBy: { name: 'asc' } }),
    db.product.findMany({ where: { status: 'ativo' }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Novo Produto</h1>
      <ProductForm categories={categories} action={createProduct} allProducts={allProducts} />
    </div>
  )
}
