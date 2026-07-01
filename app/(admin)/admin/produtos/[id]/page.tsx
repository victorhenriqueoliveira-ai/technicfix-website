import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { updateProduct } from '@/actions/products'

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: EditarProdutoPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) {
    notFound()
  }

  const boundAction = updateProduct.bind(null, product.id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Produto</h1>
      <ProductForm
        categories={categories}
        action={boundAction}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          technicalDetails: product.technicalDetails,
          price: product.price !== null ? Number(product.price) : null,
          sku: product.sku,
          stock: product.stock,
          categoryId: product.categoryId,
          featured: product.featured,
          status: product.status,
          images: product.images,
        }}
      />
    </div>
  )
}
