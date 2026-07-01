import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { Hero } from '@/components/home/Hero'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TechnocalhasSection } from '@/components/home/TechnocalhasSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { LeadGeneralForm } from '@/components/home/LeadGeneralForm'
import { DiferenciaisSection } from '@/components/home/DiferenciaisSection'
import type { ProductSummary } from '@/lib/types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://technicfix.com.br'

export const metadata: Metadata = {
  title: 'TechnicFix — Parafusos e Fixadores | Fixação que não Falha',
  description:
    'Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra. Atacado e varejo.',
  openGraph: {
    title: 'TechnicFix — Parafusos e Fixadores | Fixação que não Falha',
    description:
      'Loja especializada em parafusos, fixadores e materiais de construção. Qualidade e atendimento especializado para sua obra.',
    url: siteUrl,
    images: [{ url: `${siteUrl}/og-image.jpg` }],
  },
}

async function getBanners() {
  return db.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
}

async function getCategories() {
  return db.category.findMany({
    take: 8,
    orderBy: { name: 'asc' },
  })
}

type ProductRow = {
  id: string
  name: string
  slug: string
  price: { toNumber: () => number } | null
  images: string[]
  featured: boolean
  category: { name: string; slug: string }
}

async function getFeaturedProducts() {
  const rows = (await db.product.findMany({
    where: { featured: true, status: 'ativo' },
    take: 8,
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { name: 'asc' },
  })) as ProductRow[]

  const products: ProductSummary[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price !== null ? Number(p.price) : null,
    images: p.images,
    category: p.category,
    featured: p.featured,
  }))

  return products
}

async function getSiteConfig() {
  return db.siteConfig.findUnique({ where: { id: 'singleton' } })
}

export default async function HomePage() {
  const [banners, categories, featured, siteConfig] = await Promise.all([
    getBanners(),
    getCategories(),
    getFeaturedProducts(),
    getSiteConfig(),
  ])

  const config = siteConfig ?? {
    storeName: 'Technicfix',
    whatsappNumber: '',
    contactEmail: '',
    technocalhasUrl: '/technocalhas',
    technocalhasDescription: 'Conheça nossa parceira especializada em calhas e soluções para telhados.',
  }

  return (
    <>
      <Hero banners={banners} />
      <DiferenciaisSection />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featured} />
      <TechnocalhasSection siteConfig={config} />
      <TestimonialsSection />
      <LeadGeneralForm />
    </>
  )
}
