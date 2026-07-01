import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Category {
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  activeSlug?: string
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  return (
    <nav aria-label="Filtro por categoria">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/produtos"
            className={cn(
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
              !activeSlug
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
            data-testid="filtro-todos"
            aria-current={!activeSlug ? 'page' : undefined}
          >
            Todos
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/produtos?categoria=${cat.slug}`}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activeSlug === cat.slug
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
              aria-current={activeSlug === cat.slug ? 'page' : undefined}
              data-testid={`filtro-${cat.slug}`}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
