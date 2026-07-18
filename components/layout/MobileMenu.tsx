'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { HeaderSearchBar } from '@/components/layout/HeaderSearchBar'
import { CategoryAccordion } from '@/components/layout/CategoryNav'
import type { CategorySummary, ProductNavItem } from '@/lib/types'

interface MobileMenuProps {
  categories: CategorySummary[]
  products: ProductNavItem[]
}

/**
 * Client Component que encapsula toda a interatividade do menu mobile.
 * O Header (Server Component) importa e renderiza este componente,
 * passando categories e products via props — sem fetch de dados aqui.
 */
export function MobileMenu({ categories, products }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden ml-auto" data-testid="mobile-menu">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Abrir menu"
          className="flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100"
          data-testid="hamburger-button"
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent side="right" className="bg-white w-72 p-0 flex flex-col gap-0">
          {/* Cabeçalho do drawer */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Menu</span>
          </div>

          {/* Busca — fecha o Sheet ao confirmar */}
          <div className="px-4 py-3 border-b border-gray-100">
            <HeaderSearchBar
              className="w-full"
              onSearch={() => setOpen(false)}
            />
          </div>

          {/* Categorias */}
          <div className="border-b border-gray-100 px-2 py-2">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Categorias
            </p>
            <CategoryAccordion categories={categories} variant="light" />
          </div>

          {/* Produtos — accordion nativo <details>/<summary> */}
          <div className="border-b border-gray-100 px-2 py-2" data-testid="products-accordion">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-amber border-b border-gray-100">
                <span>Produtos</span>
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>

              <div className="ml-3 flex flex-col pb-1">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/produtos/${product.slug}`}
                    className="block px-2 py-1.5 text-sm text-gray-500 hover:text-brand-amber"
                    onClick={() => setOpen(false)}
                    data-testid={`product-link-${product.slug}`}
                  >
                    {product.name}
                  </Link>
                ))}
                <Link
                  href="/produtos"
                  className="block px-2 py-2 text-sm font-medium text-brand-amber hover:underline"
                  onClick={() => setOpen(false)}
                  data-testid="ver-todos-produtos"
                >
                  Ver todos os produtos
                </Link>
              </div>
            </details>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
