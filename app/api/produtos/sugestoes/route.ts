import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json([])
  }

  const products = await db.product.findMany({
    where: {
      status: 'ativo',
      name: { contains: q, mode: 'insensitive' },
    },
    select: { id: true, name: true, slug: true, images: true },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    take: 6,
  })

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: (p.images as string[])[0] ?? null,
    }))
  )
}
