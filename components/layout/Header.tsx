'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, PhoneIcon } from 'lucide-react'
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

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
const whatsappHref = whatsappNumber
  ? `https://wa.me/55${whatsappNumber}?text=Olá,%20gostaria%20de%20um%20orçamento!`
  : '/contato'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-brand-navy shadow-lg shadow-black/30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <GearIcon className="h-7 w-7 text-brand-amber" />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Technic<span className="text-brand-amber">Fix</span>
            </span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-amber',
                pathname === link.href
                  ? 'text-brand-amber font-semibold'
                  : 'text-white/80'
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA WhatsApp desktop */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 rounded-full bg-brand-amber px-5 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-amber-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          Fale pelo WhatsApp
        </a>

        {/* Menu mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:text-brand-amber focus:outline-none"
            >
              <MenuIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-navy border-brand-navy-light">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <GearIcon className="h-6 w-6 text-brand-amber" />
                  Technic<span className="text-brand-amber">Fix</span>
                </SheetTitle>
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
                        'block text-base font-medium transition-colors hover:text-brand-amber',
                        pathname === link.href
                          ? 'text-brand-amber font-semibold'
                          : 'text-white/80'
                      )}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-amber px-5 py-3 text-sm font-bold text-brand-navy"
                >
                  <PhoneIcon className="h-4 w-4" />
                  Fale pelo WhatsApp
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.3-1.8c.21-.16.27-.46.13-.7l-2.18-3.77c-.13-.24-.43-.32-.67-.24l-2.71 1.09c-.57-.44-1.17-.8-1.84-1.08L14.1 1.64c-.04-.26-.27-.46-.54-.46h-4.36c-.27 0-.5.2-.54.46L8.3 4.42C7.63 4.7 7.02 5.07 6.46 5.5L3.75 4.41c-.24-.08-.54 0-.67.24L.9 8.42c-.14.24-.08.54.13.7l2.3 1.8C3.29 11.27 3.25 11.61 3.25 12s.04.73.08 1.08l-2.3 1.8c-.21.16-.27.46-.13.7l2.18 3.77c.13.24.43.32.67.24l2.71-1.09c.57.44 1.17.8 1.84 1.08l.36 2.78c.05.26.27.46.54.46h4.36c.27 0 .5-.2.54-.46l.36-2.78c.67-.28 1.28-.64 1.84-1.08l2.71 1.09c.24.08.54 0 .67-.24l2.18-3.77c.13-.24.08-.54-.13-.7l-2.3-1.8z" />
    </svg>
  )
}
