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
          className="flex-1 rounded-md border border-orange-500 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
          onClick={() => setVarejoOpen(true)}
          data-testid="cta-interesse"
        >
          Tenho interesse
        </button>
        <button
          type="button"
          className="flex-1 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
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
