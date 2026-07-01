import Link from 'next/link'
import Image from 'next/image'
import type { ProductSummary } from '@/lib/types'

interface FeaturedProductsProps {
  products: ProductSummary[]
}

function ProductCard({ product }: { product: ProductSummary }) {
  const firstImage = product.images[0]

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-orange-400 hover:shadow-md transition-all"
      data-testid={`product-card-${product.slug}`}
    >
      <div className="relative w-full aspect-square bg-gray-100">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-300 text-5xl">📦</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-orange-500 font-medium mb-1">
          {product.category.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.price !== null && (
          <p className="mt-2 text-base font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(product.price))}
          </p>
        )}
      </div>
    </Link>
  )
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-12 px-4 bg-white" aria-label="Produtos em Destaque" data-testid="featured-products-section">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          Produtos em Destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
