import { MetadataRoute } from 'next'
import { db } from '@/lib/prisma'
import { env } from '@/lib/env'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { status: 'ativo' },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ])

  const base = env.NEXT_PUBLIC_SITE_URL

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/technocalhas`, changeFrequency: 'monthly', priority: 0.6 },
    ...products.map((p) => ({
      url: `${base}/produtos/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: `${base}/categorias/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
