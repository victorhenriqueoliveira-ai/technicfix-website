'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils/slugify'
import type { CategoryActionResult } from '@/actions/categories'

interface CategoryFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
    parentId?: string | null
  }
  categories?: { id: string; name: string }[]
  action: (formData: FormData) => Promise<CategoryActionResult>
}

export function CategoryForm({ initialData, categories, action }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value
    setName(newName)
    if (!slugManuallyEdited) {
      setSlug(slugify(newName))
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value)
    setSlugManuallyEdited(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('slug', slug)

    startTransition(async () => {
      const result = await action(formData)
      if (!result.success) {
        setError(result.error)
      } else {
        router.push('/admin/categorias')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          value={name}
          onChange={handleNameChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Parafusos"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug
          <span className="ml-1 text-xs text-gray-400">(gerado automaticamente)</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          minLength={2}
          value={slug}
          onChange={handleSlugChange}
          pattern="[a-z0-9-]+"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: parafusos"
        />
        <p className="mt-1 text-xs text-gray-500">
          Apenas letras minúsculas, números e hífens.
        </p>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          URL da Imagem
          <span className="ml-1 text-xs text-gray-400">(opcional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={initialData?.imageUrl ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/imagem.png"
        />
      </div>

      {categories && categories.length > 0 && (
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria-pai
            <span className="ml-1 text-xs text-gray-400">(opcional)</span>
          </label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={initialData?.parentId ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Nenhuma (categoria raiz) —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categorias')}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
