import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata = {
  title: 'Sobre Nós | Technicfix',
  description: 'Conheça a história, missão e valores da Technicfix.',
}

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Sobre' }]} />

      <h1 className="mb-8 text-3xl font-bold text-gray-900">Sobre a Technicfix</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Coluna de texto */}
        <div className="space-y-8">
          {/* História */}
          <section aria-labelledby="historia-heading">
            <h2 id="historia-heading" className="mb-3 text-xl font-semibold text-gray-800">
              Nossa História
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A Technicfix nasceu da vontade de transformar a maneira como empresas e profissionais
              da construção civil encontram e adquirem materiais de qualidade. Com anos de
              experiência no setor, construímos uma reputação sólida baseada em confiança,
              agilidade e excelência no atendimento.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Desde nossa fundação, crescemos continuamente, ampliando nosso portfólio de produtos
              e nossa rede de parceiros para oferecer sempre as melhores soluções para cada projeto.
            </p>
          </section>

          {/* Missão e Valores */}
          <section aria-labelledby="missao-heading">
            <h2 id="missao-heading" className="mb-3 text-xl font-semibold text-gray-800">
              Missão e Valores
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nossa missão é conectar profissionais da construção civil a produtos de alta
              qualidade, com prazo de entrega rápido e suporte especializado.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span><strong>Qualidade:</strong> Produtos selecionados dos melhores fabricantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span><strong>Agilidade:</strong> Processos eficientes para atender no tempo certo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span><strong>Confiança:</strong> Relacionamentos duradouros com clientes e parceiros.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span><strong>Inovação:</strong> Buscamos sempre as melhores soluções do mercado.</span>
              </li>
            </ul>
          </section>

          {/* Localização */}
          <section aria-labelledby="localizacao-heading">
            <h2 id="localizacao-heading" className="mb-3 text-xl font-semibold text-gray-800">
              Localização
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Estamos localizados em São Paulo, SP, estrategicamente posicionados para atender
              clientes em todo o Brasil com rapidez e eficiência logística.
            </p>
          </section>
        </div>

        {/* Coluna de imagem placeholder */}
        <div className="flex items-center justify-center">
          <div
            className="flex h-80 w-full max-w-md items-center justify-center rounded-xl bg-orange-50 border-2 border-orange-200"
            aria-label="Imagem da empresa (placeholder)"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500">
                <span className="text-2xl font-bold text-white">TF</span>
              </div>
              <p className="text-sm text-gray-500">Technicfix</p>
              <p className="text-xs text-gray-400">São Paulo, SP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
