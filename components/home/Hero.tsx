'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  imageUrl: '',
  title: 'Technicfix — Parafusos e Materiais de Obra',
  subtitle: 'Qualidade e durabilidade para seus projetos',
  ctaText: 'Ver Produtos',
  ctaUrl: '/produtos',
  order: 0,
  active: true,
}

export function Hero({ banners }: HeroProps) {
  const items = banners.length > 0 ? banners : [FALLBACK_BANNER]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

  const banner = items[current]

  return (
    <section
      aria-label="Banner principal"
      className="relative w-full overflow-hidden bg-orange-600"
      data-testid="hero-section"
    >
      <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        {/* Imagem de fundo (se existir URL válida) */}
        {isValidUrl(banner.imageUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800" />
        )}

        {/* Overlay escuro para contraste */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Conteúdo */}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" data-testid="hero-title">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-lg md:text-xl mb-6 text-orange-100" data-testid="hero-subtitle">
              {banner.subtitle}
            </p>
          )}
          {banner.ctaText && banner.ctaUrl && (
            <Link
              href={banner.ctaUrl}
              className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors"
              data-testid="hero-cta"
            >
              {banner.ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Indicadores de slide */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" aria-label="Indicadores de banner">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ir para banner ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
