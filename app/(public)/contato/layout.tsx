import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contato | Technicfix',
  description:
    'Entre em contato com a Technicfix. Solicite orçamentos e tire suas dúvidas sobre parafusos, fixações e materiais de construção.',
}

export default function ContatoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
