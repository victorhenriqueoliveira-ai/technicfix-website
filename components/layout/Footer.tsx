import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
  { href: '/technocalhas', label: 'Technocalhas' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Identidade da loja */}
          <div>
            <p className="text-xl font-bold text-orange-500">Technicfix</p>
            <p className="mt-2 text-sm text-gray-400">
              Soluções em construção e instalações para sua obra.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Links rápidos
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Contato
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/contato"
                  className="transition-colors hover:text-orange-500"
                >
                  Fale conosco
                </Link>
              </li>
              {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
                <li>
                  <a
                    href={`https://wa.me/55${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-orange-500"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          © {year} Technicfix. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
