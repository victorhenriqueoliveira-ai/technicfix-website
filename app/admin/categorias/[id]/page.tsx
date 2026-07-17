import { db } from '@/lib/prisma'
import { updateCategory } from '@/actions/categories'
import { redirect, notFound } from 'next/navigation'

interface EditarCategoriaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarCategoriaPage({ params }: EditarCategoriaPageProps) {
  const { id } = await params

  const [categoria, categoriasRaiz] = await Promise.all([
    db.category.findUnique({ where: { id } }),
    db.category.findMany({
      where: { parentId: null, NOT: { id } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  if (!categoria) {
    notFound()
  }

  async function handleUpdate(formData: FormData) {
    'use server'
    const result = await updateCategory(id, formData)
    if (result.success) {
      redirect('/admin/categorias')
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-gray-50 p-8">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Categoria</h1>

        <form action={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              defaultValue={categoria.name}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              defaultValue={categoria.slug}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL da Imagem <span className="text-sm text-gray-400">(opcional)</span>
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={categoria.imageUrl ?? ''}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
              Categoria-pai <span className="text-sm text-gray-400">(opcional)</span>
            </label>
            <select
              id="parentId"
              name="parentId"
              defaultValue={categoria.parentId ?? ''}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— Nenhuma (categoria raiz) —</option>
              {categoriasRaiz.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Salvar Alterações
            </button>
            <a
              href="/admin/categorias"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}
