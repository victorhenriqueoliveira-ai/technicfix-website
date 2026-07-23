import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { getCategoriesWithProducts } from '@/lib/data/categories'
import { Hero } from '@/components/home/Hero'
import { BenefitsBar } from '@/components/home/BenefitsBar'
import { CategoryProductSection } from '@/components/home/CategoryProductSection'
import { env } from '@/lib/env'

export const revalidate = 300

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

const getBanners = unstable_cache(
  () => db.banner.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ['home-banners'],
  { revalidate: 300 }
)

const getSiteConfig = unstable_cache(
  () => db.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ['site-config'],
  { revalidate: 300 }
)

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
