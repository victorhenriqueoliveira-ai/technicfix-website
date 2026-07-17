'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CategorySummary } from '@/lib/types'

interface CategoryNavProps {
  categories: CategorySummary[]
}

/**
 * Barra de navegação de categorias com mega-dropdown no desktop
 * e acordeão no mobile (para integração no Sheet do Header).
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <>
      {/* Desktop: nav horizontal com mega-dropdown */}
      <div className="bg-brand-navy hidden md:block">
        <nav
          className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8"
          aria-label="Categorias de produtos"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {cat.children.length > 0 ? (
                <button
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-2 hover:bg-white/10 focus:outline-none"
                  aria-expanded={hoveredId === cat.id}
                  aria-haspopup="true"
                >
                  <CategoryIcon category={cat} />
                  {cat.name}
                </button>
              ) : (
                <Link
                  href={`/produtos?categoria=${cat.slug}`}
                  className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-2 hover:bg-white/10"
                >
                  <CategoryIcon category={cat} />
                  {cat.name}
                </Link>
              )}

              {/* Mega-dropdown */}
              {hoveredId === cat.id && cat.children.length > 0 && (
                <div
                  className="absolute top-full left-0 bg-white shadow-xl rounded-b-lg z-50 min-w-[180px] py-2"
                  role="menu"
                >
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/produtos?categoria=${child.slug}`}
                      className="block px-4 py-1.5 text-sm text-brand-navy hover:bg-gray-50 hover:text-brand-amber"
                      role="menuitem"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile: acordeão de categorias (para uso no Sheet do Header) */}
      <CategoryAccordion categories={categories} />
    </>
  )
}

/**
 * Ícone da categoria: usa next/image se imageUrl disponível,
 * ou círculo amber com inicial do nome.
 */
function CategoryIcon({ category }: { category: CategorySummary }) {
  if (category.imageUrl) {
    return (
      <Image
        src={category.imageUrl}
        alt={category.name}
        width={20}
        height={20}
        className="h-5 w-5 rounded-full object-cover"
      />
    )
  }

  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-amber text-xs font-bold text-brand-navy"
      aria-hidden="true"
    >
      {category.name.charAt(0).toUpperCase()}
    </span>
  )
}

interface CategoryAccordionProps {
  categories: CategorySummary[]
  variant?: 'dark' | 'light'
}

/**
 * Acordeão de categorias para uso no Sheet mobile do Header.
 * Exportado separadamente para que o Header possa injetar no Sheet.
 */
export function CategoryAccordion({ categories, variant = 'dark' }: CategoryAccordionProps) {
  const text = variant === 'light' ? 'text-gray-700' : 'text-white/80'
  const textHover = variant === 'light' ? 'hover:text-brand-amber' : 'hover:text-brand-amber'
  const chevron = variant === 'light' ? 'text-gray-400' : 'text-white/60'
  const childText = variant === 'light' ? 'text-gray-500' : 'text-white/70'
  const divider = variant === 'light' ? 'border-b border-gray-100' : ''

  return (
    <div className="flex flex-col" data-testid="category-accordion">
      {categories.map((cat) => (
        <details key={cat.id} className={`group ${divider}`}>
          <summary
            className={[
              'flex cursor-pointer list-none items-center justify-between',
              `px-2 py-2.5 text-sm font-medium ${text} ${textHover}`,
              cat.children.length === 0 ? '' : '',
            ].join(' ')}
          >
            {cat.children.length > 0 ? (
              <span>{cat.name}</span>
            ) : (
              <Link
                href={`/produtos?categoria=${cat.slug}`}
                className={`flex-1 ${textHover}`}
                onClick={(e) => e.stopPropagation()}
              >
                {cat.name}
              </Link>
            )}
            {cat.children.length > 0 && (
              <span className={`ml-2 ${chevron} group-open:rotate-180 transition-transform`}>
                ▾
              </span>
            )}
          </summary>

          {cat.children.length > 0 && (
            <div className="ml-3 flex flex-col pb-1">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/produtos?categoria=${child.slug}`}
                  className={`block px-2 py-1.5 text-sm ${childText} hover:text-brand-amber`}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </details>
      ))}
    </div>
  )
}
