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
              'block rounded-xl px-3 py-2 text-sm font-bold transition-colors',
              !activeSlug
                ? 'bg-brand-amber text-brand-navy'
                : 'text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy',
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
                'block rounded-xl px-3 py-2 text-sm font-bold transition-colors',
                activeSlug === cat.slug
                  ? 'bg-brand-amber text-brand-navy'
                  : 'text-brand-navy/60 hover:bg-brand-navy/5 hover:text-brand-navy',
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
