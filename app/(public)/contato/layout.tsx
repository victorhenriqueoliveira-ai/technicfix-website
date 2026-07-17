import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com a TechnicFix. Solicite orçamentos e tire suas dúvidas sobre parafusos, fixadores e materiais de construção.',
  openGraph: {
    title: 'Contato | TechnicFix',
    description: 'Entre em contato com a TechnicFix. Solicite orçamentos e tire suas dúvidas.',
  },
}

export default function ContatoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
