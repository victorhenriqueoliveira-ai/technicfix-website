import { MessageCircle, ShieldCheck, Package } from 'lucide-react'

const BENEFITS = [
  {
    Icon: MessageCircle,
    title: 'Atendimento via WhatsApp',
    description: 'Resposta rápida',
  },
  {
    Icon: ShieldCheck,
    title: 'Qualidade Garantida',
    description: 'Produtos certificados',
  },
  {
    Icon: Package,
    title: 'Variedade de Fixadores',
    description: 'Parafusos, porcas, arruelas e mais',
  },
] as const

export function BenefitsBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex flex-col items-center text-center gap-2">
            <b.Icon className="w-8 h-8 text-brand-navy stroke-[1.5]" />
            <span className="text-sm font-bold text-brand-navy uppercase tracking-wide">
              {b.title}
            </span>
            <span className="text-xs text-gray-500">{b.description}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
