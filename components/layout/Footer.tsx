import Link from 'next/link'
import { env } from '@/lib/env'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
  { href: '/technocalhas', label: 'Technocalhas' },
]

const whatsappNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
const whatsappHref = whatsappNumber
  ? `https://wa.me/55${whatsappNumber}?text=Olá,%20gostaria%20de%20um%20orçamento!`
  : '/contato'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy-dark text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Identidade da marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-7 w-7 text-brand-amber" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.3-1.8c.21-.16.27-.46.13-.7l-2.18-3.77c-.13-.24-.43-.32-.67-.24l-2.71 1.09c-.57-.44-1.17-.8-1.84-1.08L14.1 1.64c-.04-.26-.27-.46-.54-.46h-4.36c-.27 0-.5.2-.54.46L8.3 4.42C7.63 4.7 7.02 5.07 6.46 5.5L3.75 4.41c-.24-.08-.54 0-.67.24L.9 8.42c-.14.24-.08.54.13.7l2.3 1.8C3.29 11.27 3.25 11.61 3.25 12s.04.73.08 1.08l-2.3 1.8c-.21.16-.27.46-.13.7l2.18 3.77c.13.24.43.32.67.24l2.71-1.09c.57.44 1.17.8 1.84 1.08l.36 2.78c.05.26.27.46.54.46h4.36c.27 0 .5-.2.54-.46l.36-2.78c.67-.28 1.28-.64 1.84-1.08l2.71 1.09c.24.08.54 0 .67-.24l2.18-3.77c.13-.24.08-.54-.13-.7l-2.3-1.8z" />
              </svg>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Technic<span className="text-brand-amber">Fix</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-brand-amber mb-1">Fixação que não Falha</p>
            <p className="text-sm text-white/60">
              Parafusos e Fixadores — variedade, qualidade e atendimento especializado para sua obra.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              Links rápidos
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-brand-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              Fale conosco
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/contato"
                  className="text-white/60 transition-colors hover:text-brand-amber"
                >
                  Formulário de contato
                </Link>
              </li>
              {whatsappNumber && (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Faixa amber decorativa */}
        <div className="mt-10 h-px bg-brand-amber/20" />

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-white/40">
          © {year} TechnicFix — Parafusos e Fixadores. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}
