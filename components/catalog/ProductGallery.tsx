'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200"
        aria-label="Sem imagem disponível"
        data-testid="gallery-placeholder"
      >
        <span className="text-sm text-gray-500">Sem imagem</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[activeIndex]}
          alt={`${productName} — imagem ${activeIndex + 1}`}
          fill
          unoptimized
          className="object-cover"
          data-testid="gallery-main-image"
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Miniaturas">
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              role="listitem"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                idx === activeIndex
                  ? 'border-orange-500'
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
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
