import { db } from '@/lib/prisma'
import type { ProductSummary } from '@/lib/types'
import { ProductCard } from '@/components/catalog/ProductCard'

interface RelatedProductsProps {
  productId: string
  categoryId: string
  relatedProductIds: string[]
}

export async function RelatedProducts({
  productId,
  categoryId,
  relatedProductIds,
}: RelatedProductsProps) {
  // 1. Busca produtos manuais (somente ativos, IDs inválidos são ignorados automaticamente)
  const manual = await db.product.findMany({
    where: {
      id: { in: relatedProductIds },
      status: 'ativo',
    },
    include: { category: true },
  })

  // 2. Complementa com produtos da mesma categoria, excluindo o produto atual e os manuais já incluídos
  const excludedIds = [productId, ...manual.map((p) => p.id)]
  const auto = await db.product.findMany({
    where: {
      categoryId,
      status: 'ativo',
      id: { notIn: excludedIds },
    },
    take: 8 - manual.length,
    include: { category: true },
  })

  const related = [...manual, ...auto]

  // 3. Retorna null se menos de 3 produtos disponíveis
  if (related.length < 3) return null

  // 4. Mapeia para ProductSummary compatível com ProductCard
  const products: ProductSummary[] = related.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price !== null ? Number(p.price) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
    featured: p.featured,
    showPrice: p.showPrice,
  }))

  return (
    <section aria-label="Produtos Relacionados" className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-brand-navy">Produtos Relacionados</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
