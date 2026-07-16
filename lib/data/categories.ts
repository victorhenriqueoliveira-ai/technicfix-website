import { db } from '@/lib/prisma'
import type { CategorySummary, CategoryWithProducts } from '@/lib/types'

/**
 * Retorna todas as categorias-raiz (parentId: null) com seus filhos ordenados por nome.
 * Utilizada pelo layout.tsx para popular o Header/nav.
 */
export async function getCategoriesWithChildren(): Promise<CategorySummary[]> {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl ?? null,
    children: cat.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      imageUrl: child.imageUrl ?? null,
      children: [],
    })),
  }))
}

/**
 * Retorna categorias-raiz com pelo menos 1 produto ativo, incluindo até `limit` produtos
 * por categoria (ordenados por featured desc, createdAt desc).
 * Utilizada pelo page.tsx para as seções da homepage.
 */
export async function getCategoriesWithProducts(
  limit = 8,
): Promise<CategoryWithProducts[]> {
  const categories = await db.category.findMany({
    where: {
      parentId: null,
      products: { some: { status: 'ativo' } },
    },
    include: {
      products: {
        where: { status: 'ativo' },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    products: cat.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price != null
        ? (typeof (p.price as { toNumber?: () => number }).toNumber === 'function'
            ? (p.price as { toNumber: () => number }).toNumber()
            : Number(p.price))
        : null,
      images: p.images as string[],
      badge: null,
      featured: p.featured,
      showPrice: p.showPrice,
      category: {
        name: p.category.name,
        slug: p.category.slug,
      },
    })),
  }))
}
