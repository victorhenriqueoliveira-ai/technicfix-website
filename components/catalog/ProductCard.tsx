'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getProductImageSrc, shimmerDataURL } from '@/lib/utils/image'
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
      <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-sm transition-all duration-200 hover:border-brand-amber hover:shadow-lg hover:shadow-brand-amber/10">
        {/* Imagem */}
        <Link href={`/produtos/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-200 animate-pulse">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              placeholder="blur"
              blurDataURL={shimmerDataURL}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ProductImagePlaceholder label={`Sem imagem para ${product.name}`} />
          )}
        </Link>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col p-4 border-t-2 border-transparent group-hover:border-brand-amber transition-colors">
          {/* Badge de categoria */}
          <Link
            href={`/produtos?categoria=${product.category.slug}`}
            className="mb-1 inline-block self-start rounded-full bg-brand-amber/10 px-2 py-0.5 text-xs font-bold text-brand-amber hover:bg-brand-amber/20 transition-colors"
            data-testid="categoria-badge"
          >
            {product.category.name}
          </Link>

          {/* Nome */}
          <Link href={`/produtos/${product.slug}`} className="mt-1 flex-1">
            <h3 className="text-sm font-bold text-brand-navy line-clamp-2 group-hover:text-brand-amber transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Preço */}
          {product.price !== null && (
            <p className="mt-2 text-base font-extrabold text-brand-navy">
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
                'flex-1 rounded-lg border-2 border-brand-navy px-3 py-1.5 text-xs font-bold text-brand-navy',
                'transition-colors hover:bg-brand-navy hover:text-white',
              )}
              onClick={() => setVarejoOpen(true)}
              data-testid="cta-interesse"
            >
              Tenho interesse
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-lg bg-brand-amber px-3 py-1.5 text-xs font-bold text-brand-navy',
                'transition-colors hover:bg-brand-amber-dark',
              )}
              onClick={() => setAtacadoOpen(true)}
              data-testid="cta-orcamento"
            >
              Orçamento
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
