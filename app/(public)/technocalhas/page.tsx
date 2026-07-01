import Link from 'next/link'
import { db } from '@/lib/prisma'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata = {
  title: 'Technocalhas | Technicfix',
  description: 'Conheça a Technocalhas — empresa especializada em calhas e perfis metálicos.',
}

export default async function TechnocalhasPage() {
  const config = await db.siteConfig.findFirst()

  const description =
    config?.technocalhasDescription || 'Empresa especializada em calhas e perfis metálicos.'
  const ctaUrl = config?.technocalhasUrl || '/contato'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Technocalhas' }]} />

      <div className="flex flex-col items-center text-center">
        {/* Logo placeholder */}
        <div
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500"
          aria-label="Logo Technocalhas"
          data-testid="technocalhas-logo"
        >
          <span className="text-3xl font-bold text-white">TC</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">Technocalhas</h1>

        <p
          className="mb-8 max-w-2xl text-lg text-gray-600"
          data-testid="technocalhas-description"
        >
          {description}
        </p>

        {/* Serviços */}
        <section aria-labelledby="servicos-heading" className="mb-10 w-full max-w-3xl">
          <h2 id="servicos-heading" className="mb-6 text-xl font-semibold text-gray-800">
            Nossos Serviços
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-5">
              <h3 className="mb-2 font-semibold text-gray-800">Calhas Metálicas</h3>
              <p className="text-sm text-gray-600">
                Fabricação e instalação de calhas em aço galvanizado para telhados e obras industriais.
              </p>
            </div>
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-5">
              <h3 className="mb-2 font-semibold text-gray-800">Perfis Estruturais</h3>
              <p className="text-sm text-gray-600">
                Perfis metálicos para estruturas e coberturas, com corte e dobra sob medida.
              </p>
            </div>
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-5">
              <h3 className="mb-2 font-semibold text-gray-800">Projetos Especiais</h3>
              <p className="text-sm text-gray-600">
                Soluções personalizadas para projetos industriais, comerciais e residenciais.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <Link
          href={ctaUrl}
          className="rounded-md bg-orange-500 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-orange-600"
          data-testid="technocalhas-cta"
        >
          Entre em Contato
        </Link>
      </div>
    </div>
  )
}
