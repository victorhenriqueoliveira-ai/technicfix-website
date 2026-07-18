'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductNavItem } from '@/lib/types'

interface ProductsDropdownProps {
  products: ProductNavItem[]
}

/**
 * Dropdown de produtos para uso no Header desktop.
 * Abre ao hover (onMouseEnter) e fecha ao sair (onMouseLeave).
 * Invisível em mobile — o acordeão de produtos mobile está no MobileMenu.
 */
export function ProductsDropdown({ products }: ProductsDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div
      className="relative hidden md:flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-testid="products-dropdown-root"
    >
      <button
        className="flex items-center gap-1 text-sm font-medium px-3 py-2 hover:bg-white/10 text-white focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Produtos
        <span aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 bg-white shadow-xl rounded-b-lg z-50 min-w-[220px] py-2"
          role="menu"
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/produtos/${product.slug}`}
              className="block px-4 py-1.5 text-sm text-brand-navy hover:bg-gray-50 hover:text-brand-amber"
              role="menuitem"
            >
              {product.name}
            </Link>
          ))}

          <Link
            href="/produtos"
            className="block px-4 py-2 text-sm font-semibold text-brand-amber hover:bg-gray-50 border-t border-gray-100 mt-1"
            role="menuitem"
            data-testid="ver-todos-link"
          >
            Ver todos os produtos
          </Link>
        </div>
      )}
    </div>
  )
}
