'use client'

import { useState } from 'react'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils/image'
import { ProductImagePlaceholder } from '@/components/ui/ProductImagePlaceholder'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Filtra apenas URLs válidas
  const validImages = images.filter(isValidUrl)

  if (validImages.length === 0) {
    return (
      <div
        className="aspect-square w-full rounded-lg overflow-hidden"
        data-testid="gallery-placeholder"
      >
        <ProductImagePlaceholder label="Sem imagem disponível" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={validImages[activeIndex]}
          alt={`${productName} — imagem ${activeIndex + 1}`}
          fill
          className="object-cover"
          data-testid="gallery-main-image"
        />
      </div>

      {/* Miniaturas */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Miniaturas">
          {validImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              role="listitem"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                idx === activeIndex
                  ? 'border-brand-amber'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`Ver imagem ${idx + 1}`}
              aria-pressed={idx === activeIndex}
              data-testid={`gallery-thumb-${idx}`}
            >
              <Image
                src={src}
                alt={`${productName} — miniatura ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
