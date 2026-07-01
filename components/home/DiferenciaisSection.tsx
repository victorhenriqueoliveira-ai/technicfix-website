const DIFERENCIAIS = [
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
    titulo: 'Atendimento Especializado',
    descricao: 'Equipe treinada para indicar o fixador certo para cada aplicação.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.54 15.46 0 12.33 0c-1.7 0-3.23.72-4.33 1.83L6 4 4 2C2.9 2 2 2.9 2 4v16c0 1.1.9 2 2 2s2-.9 2-2v-4l2-2 1.25 1.25C10.27 17.31 11.25 18 12.33 18c1.7 0 3.23-.72 4.33-1.83L18 14.5V18h4V8c0-1.1-.9-2-2-2z" />
      </svg>
    ),
    titulo: 'Grande Variedade',
    descricao: 'Parafusos, buchas, porcas, arruelas, fixadores e muito mais em estoque.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    titulo: 'Entrega Rápida',
    descricao: 'Agilidade na separação e entrega para não parar sua obra.',
  },
  {
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
    titulo: 'Qualidade Garantida',
    descricao: 'Produtos de procedência comprovada com durabilidade e resistência.',
  },
]

export function DiferenciaisSection() {
  return (
    <section className="py-16 px-4 bg-brand-navy" aria-label="Diferenciais">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
            Por que escolher a TechnicFix
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Fixação que não Falha
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFERENCIAIS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-navy-light border border-white/10 hover:border-brand-amber/40 transition-colors"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-brand-amber/10 text-brand-amber mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.titulo}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
