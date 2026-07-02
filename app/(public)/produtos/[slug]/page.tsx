import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/prisma'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { ProductCTAs } from '@/components/catalog/ProductCTAs'
import { RelatedProducts } from '@/components/catalog/RelatedProducts'

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
    return { title: 'Produto não encontrado | TechnicFix' }
  }

  return {
    title: `${product.name} | TechnicFix`,
    description: product.description?.slice(0, 155) ?? `${product.name} — TechnicFix`,
    openGraph: {
      title: product.name,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, siteConfig] = await Promise.all([
    db.product.findFirst({
      where: { slug, status: 'ativo' },
      include: { category: true },
    }),
    db.siteConfig.findUnique({ where: { id: 'singleton' } }),
  ])

  if (!product) {
    notFound()
  }

  const whatsappNumber = siteConfig?.whatsappNumber ?? ''

  // Exibe preço formatado quando showPrice=true; caso contrário exibe "Sob consulta"
  const priceDisplay = product.showPrice
    ? product.price !== null
      ? Number(product.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : null
    : 'Sob consulta'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-brand-navy px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="text-sm text-white/60" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-brand-amber transition-colors">Início</Link>
              </li>
              <li aria-hidden="true" className="text-white/30">/</li>
              <li>
                <Link href="/produtos" className="hover:text-brand-amber transition-colors">Produtos</Link>
              </li>
              <li aria-hidden="true" className="text-white/30">/</li>
              <li>
                <Link
                  href={`/produtos?categoria=${product.category.slug}`}
                  className="hover:text-brand-amber transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/30">/</li>
              <li className="text-white font-medium truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Galeria */}
          <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Detalhes */}
          <div className="flex flex-col gap-5">
            {/* Badge de categoria */}
            <Link
              href={`/produtos?categoria=${product.category.slug}`}
              className="inline-block self-start rounded-full bg-brand-amber/10 px-3 py-1 text-xs font-bold text-brand-amber hover:bg-brand-amber/20 transition-colors"
            >
              {product.category.name}
            </Link>

            {/* Nome */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-brand-navy leading-tight" data-testid="product-name">
              {product.name}
            </h1>

            {/* Preço ou "Sob consulta" */}
            {priceDisplay && (
              <p className="text-2xl font-extrabold text-brand-navy" data-testid="product-price">
                {priceDisplay}
              </p>
            )}

            {/* CTAs */}
            <div className="rounded-2xl bg-brand-navy/5 p-4 border border-brand-navy/10">
              <ProductCTAs
                productId={product.id}
                productName={product.name}
                productType={product.productType}
                whatsappNumber={whatsappNumber}
                showPrice={product.showPrice}
                stock={product.stock}
              />
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="mt-2">
                <h2 className="mb-2 text-base font-bold text-brand-navy">Descrição</h2>
                <p className="whitespace-pre-line text-sm text-brand-navy/70 leading-relaxed" data-testid="product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Detalhes técnicos */}
            {product.technicalDetails && (
              <div>
                <h2 className="mb-2 text-base font-bold text-brand-navy">Detalhes Técnicos</h2>
                <p
                  className="whitespace-pre-line text-sm text-brand-navy/70 leading-relaxed"
                  data-testid="product-technical-details"
                >
                  {product.technicalDetails}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Produtos Relacionados */}
        <RelatedProducts
          productId={product.id}
          categoryId={product.categoryId}
          relatedProductIds={product.relatedProductIds}
        />
      </div>
    </div>
  )
}
