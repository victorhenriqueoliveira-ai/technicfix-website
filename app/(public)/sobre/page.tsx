import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata = {
  title: 'Sobre Nós | TechnicFix — Parafusos e Fixadores',
  description: 'Conheça a história, missão e valores da TechnicFix — fixação que não falha.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-brand-navy px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[{ label: 'Sobre' }]} />
          <h1 className="mt-4 text-4xl font-extrabold text-white">
            Sobre a <span className="text-brand-amber">TechnicFix</span>
          </h1>
          <p className="mt-2 text-white/60">Fixação que não Falha — desde a fundação até hoje.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Coluna de texto */}
          <div className="space-y-8">
            <section aria-labelledby="historia-heading" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 id="historia-heading" className="mb-4 text-xl font-extrabold text-brand-navy">
                Nossa História
              </h2>
              <p className="text-brand-navy/70 leading-relaxed">
                A TechnicFix nasceu da vontade de transformar a maneira como empresas e profissionais
                da construção civil encontram e adquirem materiais de qualidade. Com anos de
                experiência no setor, construímos uma reputação sólida baseada em confiança,
                agilidade e excelência no atendimento.
              </p>
              <p className="mt-3 text-brand-navy/70 leading-relaxed">
                Desde nossa fundação, crescemos continuamente, ampliando nosso portfólio de produtos
                e nossa rede de parceiros para oferecer sempre as melhores soluções para cada projeto.
              </p>
            </section>

            <section aria-labelledby="missao-heading" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 id="missao-heading" className="mb-4 text-xl font-extrabold text-brand-navy">
                Missão e Valores
              </h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Nossa missão é conectar profissionais da construção civil a produtos de alta
                qualidade, com prazo de entrega rápido e suporte especializado.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { titulo: 'Qualidade', desc: 'Produtos selecionados dos melhores fabricantes.' },
                  { titulo: 'Agilidade', desc: 'Processos eficientes para atender no tempo certo.' },
                  { titulo: 'Confiança', desc: 'Relacionamentos duradouros com clientes e parceiros.' },
                  { titulo: 'Inovação', desc: 'Buscamos sempre as melhores soluções do mercado.' },
                ].map((item) => (
                  <li key={item.titulo} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-amber" />
                    <span className="text-sm text-brand-navy/70">
                      <strong className="text-brand-navy">{item.titulo}:</strong> {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="localizacao-heading" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 id="localizacao-heading" className="mb-3 text-xl font-extrabold text-brand-navy">
                Localização
              </h2>
              <p className="text-brand-navy/70 leading-relaxed">
                Estamos localizados em São Paulo, SP, estrategicamente posicionados para atender
                clientes em todo o Brasil com rapidez e eficiência logística.
              </p>
            </section>
          </div>

          {/* Coluna visual */}
          <div className="flex flex-col gap-6">
            <div
              className="flex h-64 w-full items-center justify-center rounded-2xl bg-brand-navy shadow-xl"
              aria-label="Identidade visual TechnicFix"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-amber">
                  <svg className="h-10 w-10 text-brand-navy" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.3-1.8c.21-.16.27-.46.13-.7l-2.18-3.77c-.13-.24-.43-.32-.67-.24l-2.71 1.09c-.57-.44-1.17-.8-1.84-1.08L14.1 1.64c-.04-.26-.27-.46-.54-.46h-4.36c-.27 0-.5.2-.54.46L8.3 4.42C7.63 4.7 7.02 5.07 6.46 5.5L3.75 4.41c-.24-.08-.54 0-.67.24L.9 8.42c-.14.24-.08.54.13.7l2.3 1.8C3.29 11.27 3.25 11.61 3.25 12s.04.73.08 1.08l-2.3 1.8c-.21.16-.27.46-.13.7l2.18 3.77c.13.24.43.32.67.24l2.71-1.09c.57.44 1.17.8 1.84 1.08l.36 2.78c.05.26.27.46.54.46h4.36c.27 0 .5-.2.54-.46l.36-2.78c.67-.28 1.28-.64 1.84-1.08l2.71 1.09c.24.08.54 0 .67-.24l2.18-3.77c.13-.24.08-.54-.13-.7l-2.3-1.8z" />
                  </svg>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  Technic<span className="text-brand-amber">Fix</span>
                </p>
                <p className="text-sm text-brand-amber mt-1">Fixação que não Falha</p>
                <p className="text-xs text-white/40 mt-1">São Paulo, SP</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { numero: '+5.000', label: 'Produtos em estoque' },
                { numero: '+2 anos', label: 'De experiência' },
                { numero: '100%', label: 'Satisfação garantida' },
                { numero: 'Atacado', label: 'e varejo' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-5 text-center shadow-sm border border-gray-100"
                >
                  <p className="text-2xl font-extrabold text-brand-amber">{stat.numero}</p>
                  <p className="text-xs font-medium text-brand-navy/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
