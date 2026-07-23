import { unstable_cache } from 'next/cache'
import { db } from '@/lib/prisma'
import type { CategorySummary, ProductNavItem } from '@/lib/types'

export const getCategoriesForNav = unstable_cache(
  async (): Promise<CategorySummary[]> => {
    return db.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            children: {
              select: { id: true, name: true, slug: true, imageUrl: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    }) as Promise<CategorySummary[]>
  },
  ['nav-categories'],
  { revalidate: 300 }
)

export const getProductsForNav = unstable_cache(
  async (): Promise<ProductNavItem[]> => {
    return db.product.findMany({
      where: { status: 'ativo' },
      select: { name: true, slug: true },
      orderBy: { name: 'asc' },
      take: 30,
    })
  },
  ['nav-products'],
  { revalidate: 300 }
)
