'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isValidUrl } from '@/lib/utils/image'

export interface BannerData {
  id: string
  imageUrl: string
  title: string
  subtitle?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  order: number
  active: boolean
}

interface HeroProps {
  banners: BannerData[]
}

const FALLBACK_BANNER: BannerData = {
  id: 'fallback',
  imageUrl: '/banner.png',
  title: 'Fixação que não Falha',
  subtitle: null,
  ctaText: null,
  ctaUrl: null,
  order: 0,
  active: true,
}

export function Hero({ banners }: HeroProps) {
  const items = banners.length > 0 ? banners : [FALLBACK_BANNER]
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAutoRotation = () => {
    if (items.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
  }

  const stopAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoRotation()
    return () => stopAutoRotation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length)
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length)
  }

  const banner = items[current]
  const hasImage = isValidUrl(banner.imageUrl)
  const isFallback = !hasImage

  return (
    <section
      aria-label="Banner principal"
      className="relative w-full overflow-hidden"
      style={{ height: '650px' }}
      data-testid="hero-section"
      onMouseEnter={stopAutoRotation}
      onMouseLeave={startAutoRotation}
    >
      {/* Imagem ou fallback amber */}
      {isFallback ? (
        <picture className="w-full h-full" data-testid="hero-fallback">
          <source media="(max-width: 767px)" srcSet="/banner_mobile.png" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner.png"
            alt={banner.title}
            className="w-full h-full object-cover"
            data-testid="hero-image"
          />
        </picture>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover"
          data-testid="hero-image"
        />
      )}

      {/* Seta esquerda */}
      {items.length > 1 && (
        <button
          onClick={prev}
          aria-label="Banner anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          data-testid="hero-prev"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Seta direita */}
      {items.length > 1 && (
        <button
          onClick={next}
          aria-label="Próximo banner"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          data-testid="hero-next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Dots de navegação */}
      {items.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          aria-label="Indicadores de banner"
        >
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ir para banner ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'bg-brand-amber w-6' : 'bg-white/60 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
