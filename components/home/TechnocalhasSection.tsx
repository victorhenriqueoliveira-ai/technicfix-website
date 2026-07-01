import Link from 'next/link'
import type { SiteConfig } from '@/lib/types'

interface TechnocalhasSectionProps {
  siteConfig: Pick<SiteConfig, 'technocalhasDescription' | 'technocalhasUrl'>
}

export function TechnocalhasSection({ siteConfig }: TechnocalhasSectionProps) {
  const { technocalhasDescription, technocalhasUrl } = siteConfig

  return (
    <section
      className="py-16 px-4 bg-brand-amber"
      aria-label="Technocalhas"
      data-testid="technocalhas-section"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Ícone / Identidade */}
        <div className="flex-shrink-0 flex items-center justify-center w-36 h-36 rounded-2xl bg-brand-navy shadow-xl">
          <span
            className="text-4xl font-extrabold text-brand-amber tracking-tight"
            aria-label="Logotipo Technocalhas"
            data-testid="technocalhas-logo"
          >
            TC
          </span>
        </div>

        {/* Texto */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-navy mb-4">Technocalhas</h2>
          {technocalhasDescription && (
            <p
              className="text-lg text-brand-navy/80 mb-6 max-w-xl"
              data-testid="technocalhas-description"
            >
              {technocalhasDescription}
            </p>
          )}
          <Link
            href={technocalhasUrl || '/technocalhas'}
            className="inline-block bg-brand-navy text-white font-bold px-8 py-3 rounded-full hover:bg-brand-navy-light transition-colors"
            data-testid="technocalhas-cta"
          >
            Conheça a Technocalhas
          </Link>
        </div>
      </div>
    </section>
  )
}
