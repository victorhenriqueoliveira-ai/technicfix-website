import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { ProductCTAs } from '@/components/catalog/ProductCTAs'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findFirst({
    where: { slug },
    select: { name: true, description: true, images: true },
  })

  if (!product) {
    return { title: 'Produto não encontrado | Technicfix' }
  }

  return {
    title: `${product.name} | Technicfix`,
    description: product.description?.slice(0, 155) ?? `${product.name} — Technicfix`,
    openGraph: {
      title: product.name,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await db.product.findFirst({
    where: { slug, status: 'ativo' },
    include: { category: true },
  })

  if (!product) {
    notFound()
  }

  const priceFormatted =
    product.price !== null
      ? Number(product.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li>
            <Link href="/" className="hover:text-orange-600">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/produtos" className="hover:text-orange-600">
              Produtos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/produtos?categoria=${product.category.slug}`}
              className="hover:text-orange-600"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Galeria */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Detalhes */}
        <div className="flex flex-col gap-4">
          {/* Categoria */}
          <Link
            href={`/produtos?categoria=${product.category.slug}`}
            className="inline-block self-start rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 hover:bg-orange-200"
          >
            {product.category.name}
          </Link>

          {/* Nome */}
          <h1 className="text-2xl font-bold text-gray-900" data-testid="product-name">
            {product.name}
          </h1>

          {/* Preço */}
          {priceFormatted && (
            <p className="text-xl font-semibold text-gray-800" data-testid="product-price">
              {priceFormatted}
            </p>
          )}

          {/* CTAs */}
          <ProductCTAs productId={product.id} productName={product.name} />

          {/* Descrição */}
          {product.description && (
            <div className="mt-4">
              <h2 className="mb-2 text-base font-semibold text-gray-800">Descrição</h2>
              <p className="whitespace-pre-line text-sm text-gray-600" data-testid="product-description">
                {product.description}
              </p>
            </div>
          )}

          {/* Detalhes técnicos */}
          {product.technicalDetails && (
            <div className="mt-2">
              <h2 className="mb-2 text-base font-semibold text-gray-800">Detalhes Técnicos</h2>
              <p
                className="whitespace-pre-line text-sm text-gray-600"
                data-testid="product-technical-details"
              >
                {product.technicalDetails}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
