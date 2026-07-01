import { CategoryForm } from '@/components/admin/categories/CategoryForm'
import { createCategory } from '@/actions/categories'

export default function NovaCategoriaPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nova Categoria</h1>
      <CategoryForm action={createCategory} />
    </div>
  )
}
