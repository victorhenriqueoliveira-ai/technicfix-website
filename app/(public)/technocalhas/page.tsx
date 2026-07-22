import Link from 'next/link'
import { db } from '@/lib/prisma'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import Image from 'next/image'
import { WorkGallery } from '@/components/technocalhas/WorkGallery'

export const metadata = {
  title: 'Technocalhas',
  description: 'Conheça a Technocalhas — empresa especializada em calhas e perfis metálicos.',
  openGraph: {
    title: 'Technocalhas | TechnicFix',
    description: 'Empresa especializada em calhas e perfis metálicos, parceira da TechnicFix.',
  },
}

export default async function TechnocalhasPage() {
  const config = await db.siteConfig.findFirst()

  const whatsappNumber = '55263966'
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=Olá,%20gostaria%20de%20um%20orçamento!`
  const phoneDisplay = '5526-3966'
  const instagramHref = 'https://www.instagram.com/technocalhas/'

  const description =
    config?.technocalhasDescription || 'Empresa especializada em calhas e perfis metálicos.'
  const ctaUrl = config?.technocalhasUrl || '/contato'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#f08e26] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[{ label: 'Technocalhas' }]} />
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-navy shadow-lg"
              aria-label="Logo Technocalhas"
              data-testid="technocalhas-logo"
            >
              <Image
                src="/technocalhas.jpg"
                alt="Technocalhas"
                width={168}
                height={112}
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-brand-navy">Technocalhas</h1>
              <p className="mt-1 text-brand-navy/70 text-sm font-medium">
                Parceira especializada em calhas e perfis metálicos
              </p> 
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Descrição */}
        <div className="mb-10 rounded-2xl bg-brand-navy p-6 text-center shadow-lg sm:p-8">
          <p
            className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            data-testid="technocalhas-description"
          >
            {description}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-brand-amber transition-colors"
              data-testid="technocalhas-instagram"
            >
              <InstagramIcon className="h-5 w-5 shrink-0" />
              @technocalhas
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-brand-amber transition-colors"
              data-testid="technocalhas-phone"
            >
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {phoneDisplay}
            </a>
          </div>
        </div>

        {/* Serviços */}
        <section aria-labelledby="servicos-heading" className="mb-10">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
              O que oferecemos
            </span>
            <h2 id="servicos-heading" className="text-3xl font-extrabold text-brand-navy">
              Nossos Serviços
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                titulo: 'Calhas Metálicas',
                desc: 'Fabricação e instalação de calhas em aço galvanizado para telhados e obras industriais.',
              },
              {
                titulo: 'Perfis Estruturais',
                desc: 'Perfis metálicos para estruturas e coberturas, com corte e dobra sob medida.',
              },
              {
                titulo: 'Projetos Especiais',
                desc: 'Soluções personalizadas para projetos industriais, comerciais e residenciais.',
              },
            ].map((servico) => (
              <div
                key={servico.titulo}
                className="rounded-2xl bg-white p-6 shadow-sm border-2 border-transparent hover:border-brand-amber transition-colors"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-amber" />
                </div>
                <h3 className="mb-2 font-bold text-brand-navy">{servico.titulo}</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed">{servico.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trabalhos */}
        <section aria-labelledby="trabalhos-heading" className="mb-10">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
              Portfólio
            </span>
            <h2 id="trabalhos-heading" className="text-3xl font-extrabold text-brand-navy">
              Nossos Trabalhos
            </h2>
          </div>
          <WorkGallery />
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#f08e26] px-8 py-4 text-base font-bold text-white transition-all hover:bg-bg-[#f08e26]-light hover:scale-105"
          >
            Entre em Contato
          </a>
        </div>
      </div>
    </div>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  )
}
