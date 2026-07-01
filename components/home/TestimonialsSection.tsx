interface Testimonial {
  id: number
  name: string
  role: string
  text: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Mendes',
    role: 'Mestre de Obras',
    text: 'A TechnicFix me surpreendeu com a qualidade dos parafusos e a rapidez na entrega. Recomendo a todos os profissionais da construção civil.',
  },
  {
    id: 2,
    name: 'Ana Paula Rodrigues',
    role: 'Engenheira Civil',
    text: 'Trabalho com a TechnicFix há mais de 2 anos. Os materiais têm qualidade consistente e o atendimento é excelente. Parceria de confiança.',
  },
  {
    id: 3,
    name: 'Roberto Silva',
    role: 'Proprietário de Construtora',
    text: 'Preços competitivos, variedade de produtos e entrega rápida. A TechnicFix é minha primeira escolha para materiais de obra.',
  },
]

export function TestimonialsSection() {
  return (
    <section
      className="py-16 px-4 bg-brand-navy"
      aria-label="Depoimentos"
      data-testid="testimonials-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
            Quem usa, aprova
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            O que dizem nossos clientes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-brand-navy-light rounded-2xl p-6 border border-white/10"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <p className="text-5xl text-brand-amber font-serif leading-none mb-2">"</p>
              <p className="text-white/80 leading-relaxed mb-6">{testimonial.text}</p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-brand-amber">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
