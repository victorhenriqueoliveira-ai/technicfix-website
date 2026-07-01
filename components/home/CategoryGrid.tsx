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
    <section className="py-12 px-4 bg-gray-50" aria-label="Categorias">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          Categorias
        </h2>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-testid="category-grid"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-orange-400 hover:shadow-md transition-all"
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
                  <div className="w-full h-full flex items-center justify-center bg-orange-50">
                    <span className="text-4xl text-orange-300 font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="block text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors text-center">
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
