import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/categories/CategoryForm'
import { updateCategory } from '@/actions/categories'

interface EditCategoriaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoriaPage({ params }: EditCategoriaPageProps) {
  const { id } = await params
  const category = await db.category.findUnique({ where: { id } })

  if (!category) {
    notFound()
  }

  const boundAction = updateCategory.bind(null, category.id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Categoria</h1>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          imageUrl: category.imageUrl,
        }}
        action={boundAction}
      />
    </div>
  )
}
