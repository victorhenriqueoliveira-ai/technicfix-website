import Link from 'next/link'
import type { SiteConfig } from '@/lib/types'

interface TechnocalhasSectionProps {
  siteConfig: Pick<SiteConfig, 'technocalhasDescription' | 'technocalhasUrl'>
}

export function TechnocalhasSection({ siteConfig }: TechnocalhasSectionProps) {
  const { technocalhasDescription, technocalhasUrl } = siteConfig

  return (
    <section
      className="py-16 px-4 bg-orange-600 text-white"
      aria-label="Technocalhas"
      data-testid="technocalhas-section"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Logo / Identidade */}
        <div className="flex-shrink-0 flex items-center justify-center w-40 h-40 rounded-full bg-white/10 border-4 border-white/30">
          <span
            className="text-6xl font-extrabold text-white tracking-tight"
            aria-label="Logotipo Technocalhas"
            data-testid="technocalhas-logo"
          >
            TC
          </span>
        </div>

        {/* Texto */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Technocalhas</h2>
          {technocalhasDescription && (
            <p
              className="text-lg text-orange-100 mb-6 max-w-xl"
              data-testid="technocalhas-description"
            >
              {technocalhasDescription}
            </p>
          )}
          <Link
            href={technocalhasUrl || '/technocalhas'}
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors"
            data-testid="technocalhas-cta"
          >
            Conheça a Technocalhas
          </Link>
        </div>
      </div>
    </section>
  )
}
