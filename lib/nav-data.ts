import { db } from '@/lib/prisma'
import type { CategorySummary, ProductNavItem } from '@/lib/types'

/**
 * Busca categorias raiz (parentId: null) com até 2 níveis de filhos,
 * ordenadas A–Z. Usada pelo Header server-side.
 */
export async function getCategoriesForNav(): Promise<CategorySummary[]> {
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
}

/**
 * Busca produtos ativos (status='ativo') ordenados A–Z, limitado a 30 itens.
 * Usada pelo Header server-side.
 */
export async function getProductsForNav(): Promise<ProductNavItem[]> {
  return db.product.findMany({
    where: { status: 'ativo' },
    select: { name: true, slug: true },
    orderBy: { name: 'asc' },
    take: 30,
  })
}
