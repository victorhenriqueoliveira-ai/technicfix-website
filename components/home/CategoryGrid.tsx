import Link from 'next/link'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils/image'

export interface CategoryData {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
}

interface CategoryGridProps {
  categories: CategoryData[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 px-4 bg-white" aria-label="Categorias">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
            Nosso Catálogo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
            Explore as Categorias
          </h2>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-testid="category-grid"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group block rounded-2xl overflow-hidden border-2 border-transparent bg-gray-50 hover:border-brand-amber hover:shadow-lg hover:shadow-brand-amber/10 transition-all duration-200"
              data-testid={`category-card-${category.slug}`}
            >
              <div className="relative w-full aspect-square bg-gray-100">
                {isValidUrl(category.imageUrl) ? (
                  <Image
                    src={category.imageUrl!}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-brand-navy/5 gap-2">
                    <ScrewIcon className="h-10 w-10 text-brand-navy/30" />
                    <span className="text-2xl font-extrabold text-brand-navy/20">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 border-t-2 border-transparent group-hover:border-brand-amber transition-colors">
                <span className="block text-sm font-bold text-brand-navy group-hover:text-brand-amber transition-colors text-center">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScrewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v2h14V5c0-1.1-.9-2-2-2zm2 4H5v2h14V7zm0 3H5v2h14v-2zm-7 3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}
