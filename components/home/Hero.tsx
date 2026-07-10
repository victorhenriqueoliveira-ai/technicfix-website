'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isValidUrl } from '@/lib/utils/image'
import { ExplodingScene } from './HeroDecor'

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

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? ''
const whatsappHref = whatsappNumber
  ? `https://wa.me/55${whatsappNumber}?text=Olá,%20gostaria%20de%20um%20orçamento!`
  : '/contato'

const FALLBACK_BANNER: BannerData = {
  id: 'fallback',
  imageUrl: '',
  title: 'Fixação que não Falha',
  subtitle: 'Parafusos, fixadores e muito mais para sua obra — qualidade garantida.',
  ctaText: null,
  ctaUrl: null,
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
  const hasImage = isValidUrl(banner.imageUrl)

  return (
    <section
      aria-label="Banner principal"
      className="relative w-full overflow-hidden"
      data-testid="hero-section"
    >
      <div className="relative min-h-[480px] md:min-h-[580px] flex items-center justify-center">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-dark" />
        )}

        <div className="absolute inset-0 bg-black/60" />

        <ExplodingScene />

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-amber/40 bg-brand-amber/10 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-amber">
              TechnicFix — Parafusos e Fixadores
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
            data-testid="hero-title"
          >
            {banner.id === 'fallback' ? (
              <>
                Fixação que{' '}
                <span className="text-brand-amber">não Falha</span>
              </>
            ) : (
              banner.title
            )}
          </h1>

          {banner.subtitle && (
            <p
              className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto"
              data-testid="hero-subtitle"
            >
              {banner.subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-whatsapp"
              className="inline-flex items-center gap-2 rounded-full bg-brand-amber px-8 py-4 text-base font-bold text-brand-navy transition-all hover:bg-brand-amber-dark hover:scale-105 shadow-lg shadow-brand-amber/30"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar pelo WhatsApp
            </a>

            {banner.ctaText && banner.ctaUrl ? (
              <Link
                href={banner.ctaUrl}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                data-testid="hero-cta"
              >
                {banner.ctaText}
              </Link>
            ) : (
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                data-testid="hero-cta"
              >
                Ver Produtos
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-amber" />
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" aria-label="Indicadores de banner">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ir para banner ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? 'bg-brand-amber w-6' : 'bg-white/40 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}
