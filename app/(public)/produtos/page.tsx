import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { SearchBar } from '@/components/catalog/SearchBar'
import { Suspense } from 'react'
import type { ProductSummary } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Produtos | Technicfix',
  description:
    'Catálogo completo de parafusos, fixações e materiais de construção. Encontre o produto ideal para sua obra.',
}

/** Tipo local para produto retornado pelo Prisma com category incluída */
interface ProductWithCategory {
  id: string
  name: string
  slug: string
  price: number | null | { toNumber?: () => number }
  images: string[]
  featured: boolean
  category: { name: string; slug: string }
}

const ITEMS_PER_PAGE = 12

interface ProdutosPageProps {
  searchParams: Promise<{
    categoria?: string
    busca?: string
    page?: string
  }>
}

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const params = await searchParams
  const categoria = params.categoria
  const busca = params.busca
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where: {
        status: 'ativo',
        ...(categoria ? { category: { slug: categoria } } : {}),
        ...(busca ? { name: { contains: busca, mode: 'insensitive' } } : {}),
      },
      include: { category: true },
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    db.product.count({
      where: {
        status: 'ativo',
        ...(categoria ? { category: { slug: categoria } } : {}),
        ...(busca ? { name: { contains: busca, mode: 'insensitive' } } : {}),
      },
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const productSummaries: ProductSummary[] = (products as ProductWithCategory[]).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price !== null ? Number(p.price) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
    featured: p.featured,
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Produtos</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar — filtros */}
        <aside className="w-full lg:w-56 lg:flex-shrink-0">
          <div className="mb-4">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <CategoryFilter categories={categories} activeSlug={categoria} />
        </aside>

        {/* Grade de produtos */}
        <section className="flex-1">
          {productSummaries.length === 0 ? (
            <p className="text-gray-500" data-testid="empty-state">
              Nenhum produto encontrado.
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </p>
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
                      href={`/produtos?${new URLSearchParams({
                        ...(categoria ? { categoria } : {}),
                        ...(busca ? { busca } : {}),
                        page: String(page - 1),
                      })}`}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Anterior
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/produtos?${new URLSearchParams({
                        ...(categoria ? { categoria } : {}),
                        ...(busca ? { busca } : {}),
                        page: String(page + 1),
                      })}`}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
