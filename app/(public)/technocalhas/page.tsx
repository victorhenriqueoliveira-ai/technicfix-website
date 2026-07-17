import Link from 'next/link'
import { db } from '@/lib/prisma'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

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

  const description =
    config?.technocalhasDescription || 'Empresa especializada em calhas e perfis metálicos.'
  const ctaUrl = config?.technocalhasUrl || '/contato'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-amber px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[{ label: 'Technocalhas' }]} />
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-navy shadow-lg"
              aria-label="Logo Technocalhas"
              data-testid="technocalhas-logo"
            >
              <span className="text-2xl font-extrabold text-brand-amber">TC</span>
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
        <div className="mb-10 rounded-2xl bg-brand-navy p-8 text-center shadow-lg">
          <p
            className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            data-testid="technocalhas-description"
          >
            {description}
          </p>
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

        {/* CTA */}
        <div className="text-center">
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-4 text-base font-bold text-white transition-all hover:bg-brand-navy-light hover:scale-105"
            data-testid="technocalhas-cta"
          >
            Entre em Contato
          </Link>
        </div>
      </div>
    </div>
  )
}
