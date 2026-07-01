# Contexto — task_15

## Requisitos do PRD

- SEO: metadata por página (title, description, og:image, canonical)
- Sitemap dinâmico gerado pelo Next.js (todos os produtos e categorias do banco)
- robots.txt permitindo indexação pública, bloqueando /admin

## Especificação Técnica

### `generateMetadata` por página (App Router)

Adicionar a cada página pública existente:

**`app/(public)/page.tsx`** (homepage):
```typescript
export const metadata: Metadata = {
  title: 'Technicfix — Parafusos, Fixações e Materiais de Obra',
  description: 'Loja especializada em parafusos, fixações e materiais de construção. Atacado e varejo.',
  openGraph: { title: '...', description: '...', url: process.env.NEXT_PUBLIC_SITE_URL },
}
```

**`app/(public)/produtos/page.tsx`** — metadata estático genérico para catálogo.

**`app/(public)/produtos/[slug]/page.tsx`** — `generateMetadata` dinâmico:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await db.product.findUnique({ where: { slug: params.slug } })
  if (!product) return { title: 'Produto não encontrado' }
  return {
    title: `${product.name} | Technicfix`,
    description: product.description?.slice(0, 155) ?? `${product.name} — Technicfix`,
    openGraph: {
      title: product.name,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}
```

**`app/(public)/sobre/page.tsx`**, **`/contato/page.tsx`**, **`/technocalhas/page.tsx`** — metadata estático.

### `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { db } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    db.product.findMany({ where: { status: 'ativo' }, select: { slug: true, updatedAt: true } }),
    db.category.findMany({ select: { slug: true, updatedAt: true } }),
  ])
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://technicfix.com.br'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/technocalhas`, changeFrequency: 'monthly', priority: 0.6 },
    ...products.map(p => ({ url: `${base}/produtos/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...categories.map(c => ({ url: `${base}/categorias/${c.slug}`, lastModified: c.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ]
}
```

### `app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://technicfix.com.br'}/sitemap.xml`,
  }
}
```

## Estado de dependências

- task_05, task_06, task_08 (integradas): todas as páginas públicas existem
- task_02 (integrada): `db` disponível para queries dinâmicas

## Importante para o worker

- NÃO modificar lógica das páginas existentes — apenas adicionar metadata/generateMetadata
- NÃO criar novas páginas além de sitemap.ts e robots.ts
- Criar testes unitários: sitemap retorna entradas para produtos/categorias/páginas fixas, robots bloqueia /admin, generateMetadata produto retorna title correto
- NÃO executar npm install
