'use client'

import { useState } from 'react'
import { LeadVarejoModal } from '@/components/leads/LeadVarejoModal'
import { LeadAtacadoModal } from '@/components/leads/LeadAtacadoModal'

interface ProductCTAsProps {
  productId: string
  productName: string
}

export function ProductCTAs({ productId, productName }: ProductCTAsProps) {
  const [varejoOpen, setVarejoOpen] = useState(false)
  const [atacadoOpen, setAtacadoOpen] = useState(false)

  return (
    <>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 rounded-xl border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          onClick={() => setVarejoOpen(true)}
          data-testid="cta-interesse"
        >
          Tenho interesse
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl bg-brand-amber px-4 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-amber-dark"
          onClick={() => setAtacadoOpen(true)}
          data-testid="cta-orcamento"
        >
          Solicitar orçamento
        </button>
      </div>

      <LeadVarejoModal
        productId={productId}
        productName={productName}
        open={varejoOpen}
        onClose={() => setVarejoOpen(false)}
      />
      <LeadAtacadoModal
        productId={productId}
        productName={productName}
        open={atacadoOpen}
        onClose={() => setAtacadoOpen(false)}
      />
    </>
  )
}
