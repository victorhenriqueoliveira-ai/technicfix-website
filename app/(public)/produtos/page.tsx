import Link from 'next/link'
import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CategoryFilter } from '@/components/catalog/CategoryFilter'
import { SearchBar } from '@/components/catalog/SearchBar'
import { Suspense } from 'react'
import type { ProductSummary } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Produtos | TechnicFix — Parafusos e Fixadores',
  description:
    'Catálogo completo de parafusos, fixadores e materiais de construção. Encontre o produto ideal para sua obra.',
}

/** Tipo local para produto retornado pelo Prisma com category incluída */
interface ProductWithCategory {
  id: string
  name: string
  slug: string
  price: number | null | { toNumber?: () => number }
  images: string[]
  featured: boolean
  showPrice: boolean
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
    badge: (p as { badge?: string | null }).badge ?? null,
    category: { name: p.category.name, slug: p.category.slug },
    featured: p.featured,
    showPrice: p.showPrice,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-brand-navy px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">
            Nossos <span className="text-brand-amber">Produtos</span>
          </h1>
          <p className="mt-2 text-white/60">
            Parafusos, fixadores e muito mais para sua obra.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar — filtros */}
          <aside className="w-full lg:w-56 lg:flex-shrink-0">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="mb-4">
                <Suspense>
                  <SearchBar />
                </Suspense>
              </div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-navy/40">
                Categorias
              </div>
              <CategoryFilter categories={categories} activeSlug={categoria} />
            </div>
          </aside>

          {/* Grade de produtos */}
          <section className="flex-1">
            {productSummaries.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center border border-gray-100" data-testid="empty-state">
                <span className="text-5xl mb-4">🔩</span>
                <p className="font-bold text-brand-navy">Nenhum produto encontrado.</p>
                <p className="text-sm text-brand-navy/50 mt-1">Tente outro filtro ou busca.</p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm font-medium text-brand-navy/50">
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
                        href={`/produtos?${new URLSearchParams({
                          ...(categoria ? { categoria } : {}),
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
    </div>
  )
}
