import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { getCategoriesWithProducts } from '@/lib/data/categories'
import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { CategoryProductSection } from '@/components/home/CategoryProductSection'
import { env } from '@/lib/env'

const siteUrl = env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: {
    absolute: 'TechnicFix — Parafusos e Fixadores | Fixação que não Falha',
  },
  description:
    'Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra. Atacado e varejo.',
  openGraph: {
    title: 'TechnicFix — Parafusos e Fixadores | Fixação que não Falha',
    description:
      'Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra.',
    url: siteUrl,
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
  },
}

async function getBanners() {
  return db.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
}

async function getSiteConfig() {
  return db.siteConfig.findUnique({ where: { id: 'singleton' } })
}

export default async function HomePage() {
  const [banners, categoriesWithProducts, config] = await Promise.all([
    getBanners(),
    getCategoriesWithProducts(8),
    getSiteConfig(),
  ])

  const whatsappNumber = config?.whatsappNumber?.replace(/\D/g, '') ?? ''

  return (
    <>
      <Hero banners={banners} />
      <BenefitsBar />
      {categoriesWithProducts.map((cat) => (
        <CategoryProductSection key={cat.id} category={cat} whatsappNumber={whatsappNumber} />
      ))}
    </>
  )
}
