import { db } from '@/lib/prisma'
import Link from 'next/link'
import { deleteCategory } from '@/actions/categories'

export default async function AdminCategoriasPage() {
  const categorias = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
  })

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <Link
          href="/admin/categorias/nova"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Nova Categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
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
                  Categoria-pai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Produtos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Subcategorias
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {cat.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {cat.parent?.name ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {cat._count.products}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {cat._count.children}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link
                      href={`/admin/categorias/${cat.id}`}
                      className="mr-3 text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        'use server'
                        await deleteCategory(cat.id)
                      }}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          if (!confirm(`Excluir a categoria "${cat.name}"?`)) e.preventDefault()
                        }}
                      >
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
