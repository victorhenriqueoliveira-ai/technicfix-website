import { db } from '@/lib/prisma'
import { CategoryForm } from '@/components/admin/categories/CategoryForm'
import { createCategory } from '@/actions/categories'

export default async function NovaCategoriaPage() {
  const rootCategories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nova Categoria</h1>
      <CategoryForm action={createCategory} categories={rootCategories} />
    </div>
  )
}
