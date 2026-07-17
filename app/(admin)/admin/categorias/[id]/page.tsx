import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/categories/CategoryForm'
import { updateCategory } from '@/actions/categories'

interface EditCategoriaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoriaPage({ params }: EditCategoriaPageProps) {
  const { id } = await params

  const [category, rootCategories] = await Promise.all([
    db.category.findUnique({ where: { id } }),
    db.category.findMany({
      where: { parentId: null, NOT: { id } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

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
          parentId: category.parentId,
        }}
        categories={rootCategories}
        action={boundAction}
      />
    </div>
  )
}
