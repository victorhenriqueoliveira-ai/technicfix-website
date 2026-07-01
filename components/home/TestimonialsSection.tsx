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
    text: 'A Technicfix me surpreendeu com a qualidade dos parafusos e a rapidez na entrega. Recomendo a todos os profissionais da construção civil.',
  },
  {
    id: 2,
    name: 'Ana Paula Rodrigues',
    role: 'Engenheira Civil',
    text: 'Trabalho com a Technicfix há mais de 2 anos. Os materiais têm qualidade consistente e o atendimento é excelente. Parceria de confiança.',
  },
  {
    id: 3,
    name: 'Roberto Silva',
    role: 'Proprietário de Construtora',
    text: 'Preços competitivos, variedade de produtos e entrega rápida. A Technicfix é minha primeira escolha para materiais de obra.',
  },
]

export function TestimonialsSection() {
  return (
    <section
      className="py-12 px-4 bg-gray-100"
      aria-label="Depoimentos"
      data-testid="testimonials-section"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          O que dizem nossos clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              data-testid={`testimonial-${testimonial.id}`}
            >
              {/* Aspas decorativas */}
              <p className="text-5xl text-orange-400 font-serif leading-none mb-2">"</p>
              <p className="text-gray-700 leading-relaxed mb-4">{testimonial.text}</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-orange-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
