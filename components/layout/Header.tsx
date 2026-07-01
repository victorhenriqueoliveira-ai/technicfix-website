'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
  { href: '/technocalhas', label: 'Technocalhas' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-orange-500">Technicfix</span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-orange-500',
                pathname === link.href
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-700'
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Menu mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              <MenuIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-orange-500">Technicfix</SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-4 p-4"
                aria-label="Navegação mobile"
              >
                {navLinks.map((link) => (
                  <SheetClose key={link.href} render={<span />}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block text-base font-medium transition-colors hover:text-orange-500',
                        pathname === link.href
                          ? 'text-orange-500 font-semibold'
                          : 'text-gray-700'
                      )}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
