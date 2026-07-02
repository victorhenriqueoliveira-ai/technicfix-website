import Link from 'next/link'
import { db } from '@/lib/prisma'
import { DeleteProductButton } from '@/components/admin/products/DeleteProductButton'

/**
 * Retorna as props visuais do badge de estoque conforme o nível.
 * Exportada para facilitar testes unitários.
 */
export function getStockDisplay(stock: number): { className: string; text: string; hasBadge: boolean } {
  if (stock === 0) {
    return {
      className:
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800',
      text: 'Esgotado',
      hasBadge: true,
    }
  }
  if (stock <= 5) {
    return {
      className:
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800',
      text: String(stock),
      hasBadge: true,
    }
  }
  return { className: 'text-gray-500', text: String(stock), hasBadge: false }
}

interface ProdutosPageProps {
  searchParams: Promise<{
    busca?: string
    categoria?: string
    status?: string
    pagina?: string
  }>
}

const PER_PAGE = 20

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const { busca, categoria, status, pagina } = await searchParams
  const page = Math.max(1, Number(pagina ?? 1))
  const skip = (page - 1) * PER_PAGE

  const where = {
    ...(busca ? { name: { contains: busca, mode: 'insensitive' as const } } : {}),
    ...(categoria ? { categoryId: categoria } : {}),
    ...(status === 'ativo' || status === 'inativo' ? { status: status as 'ativo' | 'inativo' } : {}),
  }

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PER_PAGE,
      include: { category: true },
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Novo produto
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="busca"
          defaultValue={busca ?? ''}
          placeholder="Buscar por nome..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="categoria"
          defaultValue={categoria ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <button
          type="submit"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Filtrar
        </button>

        {(busca || categoria || status) && (
          <Link
            href="/admin/produtos"
            className="rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpar filtros
          </Link>
        )}
      </form>

      {/* Tabela */}
      {products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Destaque
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {product.category.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {product.sku ? (
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                          {product.sku}
                        </code>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {(() => {
                        const { className, text } = getStockDisplay(product.stock)
                        return <span className={className}>{text}</span>
                      })()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {product.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {product.featured ? (
                        <span className="text-yellow-500">★</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {skip + 1}–{Math.min(skip + PER_PAGE, total)} de {total} produtos
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?busca=${busca ?? ''}&categoria=${categoria ?? ''}&status=${status ?? ''}&pagina=${page - 1}`}
                    className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50"
                  >
                    ← Anterior
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?busca=${busca ?? ''}&categoria=${categoria ?? ''}&status=${status ?? ''}&pagina=${page + 1}`}
                    className="rounded-md border border-gray-300 px-3 py-1 hover:bg-gray-50"
                  >
                    Próximo →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
