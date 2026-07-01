'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getProductImageSrc } from '@/lib/utils/image'
import type { ProductSummary } from '@/lib/types'
import { LeadVarejoModal } from '@/components/leads/LeadVarejoModal'
import { LeadAtacadoModal } from '@/components/leads/LeadAtacadoModal'
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder'

interface ProductCardProps {
  product: ProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getProductImageSrc(product.images)
  const [varejoOpen, setVarejoOpen] = useState(false)
  const [atacadoOpen, setAtacadoOpen] = useState(false)

  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Imagem */}
        <Link href={`/produtos/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          ) : (
            <ProductImagePlaceholder label={`Sem imagem para ${product.name}`} />
          )}
        </Link>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col p-4">
          {/* Badge de categoria */}
          <Link
            href={`/produtos?categoria=${product.category.slug}`}
            className="mb-1 inline-block self-start rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 hover:bg-orange-200"
            data-testid="categoria-badge"
          >
            {product.category.name}
          </Link>

          {/* Nome */}
          <Link href={`/produtos/${product.slug}`} className="mt-1 flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600">
              {product.name}
            </h3>
          </Link>

          {/* Preço */}
          {product.price !== null && (
            <p className="mt-2 text-base font-semibold text-gray-800">
              {Number(product.price).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md border border-orange-500 px-3 py-1.5 text-xs font-medium text-orange-600',
                'transition-colors hover:bg-orange-50',
              )}
              onClick={() => setVarejoOpen(true)}
              data-testid="cta-interesse"
            >
              Tenho interesse
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white',
                'transition-colors hover:bg-orange-600',
              )}
              onClick={() => setAtacadoOpen(true)}
              data-testid="cta-orcamento"
            >
              Solicitar orçamento
            </button>
          </div>
        </div>
      </article>

      <LeadVarejoModal
        productId={product.id}
        productName={product.name}
        open={varejoOpen}
        onClose={() => setVarejoOpen(false)}
      />
      <LeadAtacadoModal
        productId={product.id}
        productName={product.name}
        open={atacadoOpen}
        onClose={() => setAtacadoOpen(false)}
      />
    </>
  )
}
