import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import { SearchBar } from '@/components/catalog/SearchBar'
import type { ProductSummary, ProductWithCategory } from '@/lib/types'

const ITEMS_PER_PAGE = 12

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ busca?: string; page?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await db.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: `${category.name} | Technicfix`,
    description: (category as { description?: string | null }).description ?? `Produtos da categoria ${category.name} na Technicfix.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { busca, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const category = await db.category.findUnique({ where: { slug } })
  if (!category) notFound()

  // Query de produtos — mesma estrutura de produtos/page.tsx (referência)
  const baseWhere: Prisma.ProductWhereInput = {
    status: 'ativo',
    category: { slug },
    ...(busca ? { name: { contains: busca, mode: 'insensitive' } } : {}),
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where: baseWhere,
      include: { category: true },
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    db.product.count({ where: baseWhere }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const productSummaries: ProductSummary[] = (products as unknown as ProductWithCategory[]).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price !== null ? Number(p.price) : null,
    images: p.images,
    badge: (p as { badge?: string | null }).badge ?? null,
    category: { name: p.category.name, slug: p.category.slug },
    featured: p.featured,
    showPrice: p.showPrice,
  }))

  const categoryImageUrl = (category as { imageUrl?: string | null }).imageUrl ?? null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho da categoria */}
      <div className="bg-brand-navy px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-6">
          {/* Imagem ou placeholder */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white/10" data-testid="category-image-container">
            {categoryImageUrl ? (
              <Image
                src={categoryImageUrl}
                alt={category.name}
                fill
                className="object-cover"
                data-testid="category-image"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-white/30 text-3xl"
                data-testid="category-image-placeholder"
                aria-label={`Sem imagem para ${category.name}`}
              >
                🔩
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl" data-testid="category-title">
              {category.name}
            </h1>
            {total > 0 && (
              <p className="mt-1 text-white/60">
                {total} produto{total !== 1 ? 's' : ''} disponíve{total !== 1 ? 'is' : 'l'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Barra de busca */}
        <div className="mb-6 max-w-sm">
          <Suspense>
            <SearchBar placeholder={`Buscar em ${category.name}...`} />
          </Suspense>
        </div>

        {/* Grade de produtos */}
        <section>
          {productSummaries.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center border border-gray-100"
              data-testid="empty-state"
            >
              <span className="text-5xl mb-4">🔩</span>
              <p className="font-bold text-brand-navy">Nenhum produto encontrado.</p>
              <p className="text-sm text-brand-navy/50 mt-1">Tente outra busca.</p>
            </div>
          ) : (
            <>
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                data-testid="products-grid"
              >
                {productSummaries.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <nav
                  className="mt-8 flex items-center justify-center gap-4"
                  aria-label="Paginação"
                >
                  {page > 1 && (
                    <Link
                      href={`/categorias/${slug}?${new URLSearchParams({
                        ...(busca ? { busca } : {}),
                        page: String(page - 1),
                      })}`}
                      className="rounded-xl border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Anterior
                    </Link>
                  )}
                  <span className="text-sm font-medium text-brand-navy/60">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/categorias/${slug}?${new URLSearchParams({
                        ...(busca ? { busca } : {}),
                        page: String(page + 1),
                      })}`}
                      className="rounded-xl border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Próxima
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
