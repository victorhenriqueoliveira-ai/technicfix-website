import Link from 'next/link'
import { db } from '@/lib/prisma'
import { DeleteCategoryButton } from '@/components/admin/categories/DeleteCategoryButton'

export default async function CategoriasPage() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <Link
          href="/admin/categorias/nova"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nova categoria
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Produtos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                      {category.slug}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category._count.products}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/categorias/${category.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </Link>
                      <DeleteCategoryButton id={category.id} name={category.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
