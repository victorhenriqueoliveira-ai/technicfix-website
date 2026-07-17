import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { CategoryNav, CategoryAccordion } from '@/components/layout/CategoryNav'
import { HeaderSearchBar } from '@/components/layout/HeaderSearchBar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CategorySummary } from '@/lib/types'

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
const whatsappHref = whatsappNumber
  ? `https://wa.me/55${whatsappNumber}`
  : '/contato'

interface HeaderProps {
  categories?: CategorySummary[]
}

export function Header({ categories = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Camada 1 — TopBar: desktop only */}
      <div className="hidden md:block bg-brand-navy-dark text-white/70 text-xs py-1.5 px-4 text-center">
        Atendimento via WhatsApp · Variedade de Fixadores
      </div>

      {/* Camada 2 — MainBar: logo + busca + CTA */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo_technicfix.png"
              alt="Technicfix"
              width={168}
              height={112}
              priority
              className="object-contain"
            />
          </Link>

          {/* Busca — oculta no mobile, encolhe em telas intermediárias */}
          <div className="hidden md:flex flex-1 min-w-0">
            <HeaderSearchBar className="w-full" />
          </div>

          {/* WhatsApp CTA — desktop only */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="whatsapp-cta"
            className="hidden md:flex items-center gap-2 rounded-full bg-brand-amber px-5 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-amber-dark shrink-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          {/* Hamburguer — mobile only, empurrado para a direita */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger
                aria-label="Abrir menu"
                className="flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-72 p-0 flex flex-col gap-0">
                {/* Cabeçalho do drawer */}
                <div className="flex items-center px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Menu</span>
                </div>
                {/* Busca */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <HeaderSearchBar className="w-full" />
                </div>
                {/* Categorias */}
                {/* <nav className="flex-1 overflow-y-auto" aria-label="Categorias">
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Categorias
                  </p>
                  <CategoryAccordion categories={categories} variant="light" />
                </nav> */}
                {/* WhatsApp — rodapé do drawer */}
                <div className="p-4 border-t border-gray-100">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-amber py-3 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-amber-dark"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>

      {/* Camada 3 — CategoryNav (desktop)
      <CategoryNav categories={categories} /> */}
    </header>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
