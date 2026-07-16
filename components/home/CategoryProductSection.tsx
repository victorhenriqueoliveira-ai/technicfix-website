import Link from 'next/link'
import type { CategoryWithProducts } from '@/lib/types'
import { HomepageProductCard } from '@/components/home/HomepageProductCard'

interface CategoryProductSectionProps {
  category: CategoryWithProducts
  whatsappNumber: string
}

export function CategoryProductSection({ category, whatsappNumber }: CategoryProductSectionProps) {
  if (category.products.length === 0) {
    return null
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título estilo Jofepar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-brand-amber" />
          <h2 className="text-xl font-black uppercase tracking-wide text-brand-navy">
            {category.name}
          </h2>
          <div className="flex-1 h-px bg-gray-200 ml-2" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.products.map(p => (
            <HomepageProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        {/* Ver todos */}
        <div className="mt-6 text-right">
          <Link
            href={`/produtos?categoria=${category.slug}`}
            className="text-sm font-medium text-brand-amber hover:underline"
          >
            Ver todos em {category.name} →
          </Link>
        </div>
      </div>
    </section>
  )
}
