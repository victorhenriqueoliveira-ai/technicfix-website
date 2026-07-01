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
      className="group block rounded-2xl overflow-hidden border-2 border-transparent bg-white shadow-sm hover:border-brand-amber hover:shadow-lg hover:shadow-brand-amber/10 transition-all duration-200"
      data-testid={`product-card-${product.slug}`}
    >
      <div className="relative w-full aspect-square bg-gray-50">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-brand-navy/5">
            <svg className="h-14 w-14 text-brand-navy/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.73-.07-1.08l2.3-1.8c.21-.16.27-.46.13-.7l-2.18-3.77c-.13-.24-.43-.32-.67-.24l-2.71 1.09c-.57-.44-1.17-.8-1.84-1.08L14.1 1.64c-.04-.26-.27-.46-.54-.46h-4.36c-.27 0-.5.2-.54.46L8.3 4.42C7.63 4.7 7.02 5.07 6.46 5.5L3.75 4.41c-.24-.08-.54 0-.67.24L.9 8.42c-.14.24-.08.54.13.7l2.3 1.8C3.29 11.27 3.25 11.61 3.25 12s.04.73.08 1.08l-2.3 1.8c-.21.16-.27.46-.13.7l2.18 3.77c.13.24.43.32.67.24l2.71-1.09c.57.44 1.17.8 1.84 1.08l.36 2.78c.05.26.27.46.54.46h4.36c.27 0 .5-.2.54-.46l.36-2.78c.67-.28 1.28-.64 1.84-1.08l2.71 1.09c.24.08.54 0 .67-.24l2.18-3.77c.13-.24.08-.54-.13-.7l-2.3-1.8z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 border-t-2 border-transparent group-hover:border-brand-amber transition-colors">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-amber mb-1">
          {product.category.name}
        </p>
        <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-amber transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.price !== null && (
          <p className="mt-2 text-base font-extrabold text-brand-navy">
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
    <section className="py-16 px-4 bg-gray-50" aria-label="Produtos em Destaque" data-testid="featured-products-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-amber mb-2">
            Seleção Especial
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
            Produtos em Destaque
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-navy px-8 py-3 text-sm font-bold text-brand-navy transition-all hover:bg-brand-navy hover:text-white"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  )
}
