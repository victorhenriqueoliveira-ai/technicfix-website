'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils/slugify'
import { ImageUploader } from '@/components/admin/products/ImageUploader'
import type { ProductActionResult } from '@/actions/products'

interface Category {
  id: string
  name: string
}

interface RelatedProductOption {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  action: (formData: FormData) => Promise<ProductActionResult>
  allProducts?: RelatedProductOption[]
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
    technicalDetails: string | null
    price: number | null
    sku: string | null
    stock: number
    categoryId: string
    featured: boolean
    status: 'ativo' | 'inativo'
    images: string[]
    showPrice: boolean
    productType: 'varejo' | 'atacado' | 'ambos'
    relatedProductIds: string[]
  }
}

export function ProductForm({ categories, action, allProducts = [], initialData }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug)
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [selectedRelatedIds, setSelectedRelatedIds] = useState<string[]>(
    initialData?.relatedProductIds ?? []
  )

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
    formData.set('images', JSON.stringify(images))
    formData.set('relatedProductIds', JSON.stringify(selectedRelatedIds))

    startTransition(async () => {
      const result = await action(formData)
      if (!result.success) {
        setError(result.error)
      } else {
        router.push('/admin/produtos')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Nome */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Nome <span className="text-red-500">*</span>
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
          placeholder="Ex: Parafuso Sextavado M8"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          Slug <span className="ml-1 text-xs text-gray-400">(gerado automaticamente)</span>
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
          placeholder="Ex: parafuso-sextavado-m8"
        />
        <p className="mt-1 text-xs text-gray-500">
          Apenas letras minúsculas, números e hífens.
        </p>
      </div>

      {/* Categoria */}
      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-gray-700">
          Categoria <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={initialData?.categoryId ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preço e SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            Preço <span className="ml-1 text-xs text-gray-400">(opcional)</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialData?.price ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0,00"
          />
        </div>

        <div>
          <label htmlFor="sku" className="mb-1 block text-sm font-medium text-gray-700">
            SKU <span className="ml-1 text-xs text-gray-400">(opcional)</span>
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={initialData?.sku ?? ''}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: PRD-001"
          />
        </div>
      </div>

      {/* Estoque */}
      <div>
        <label htmlFor="stock" className="mb-1 block text-sm font-medium text-gray-700">
          Estoque
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          defaultValue={initialData?.stock ?? 0}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o produto..."
        />
      </div>

      {/* Detalhes técnicos */}
      <div>
        <label htmlFor="technicalDetails" className="mb-1 block text-sm font-medium text-gray-700">
          Detalhes Técnicos <span className="ml-1 text-xs text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="technicalDetails"
          name="technicalDetails"
          rows={4}
          defaultValue={initialData?.technicalDetails ?? ''}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Especificações técnicas..."
        />
      </div>

      {/* Status e Destaque */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status ?? 'ativo'}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="hidden"
              name="featured"
              value="false"
            />
            <input
              id="featured"
              name="featured"
              type="checkbox"
              value="true"
              defaultChecked={initialData?.featured ?? false}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onChange={(e) => {
                const hiddenInput = e.currentTarget.form?.querySelector(
                  'input[name="featured"][type="hidden"]'
                ) as HTMLInputElement | null
                if (hiddenInput) {
                  hiddenInput.value = e.currentTarget.checked ? 'true' : 'false'
                }
              }}
            />
            Produto em destaque
          </label>
        </div>
      </div>

      {/* Upload de imagens */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Imagens do produto
        </label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Exibir preço */}
      <div className="flex items-center gap-2">
        <input
          id="showPrice"
          name="showPrice"
          type="checkbox"
          defaultChecked={initialData?.showPrice ?? true}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showPrice" className="cursor-pointer text-sm font-medium text-gray-700">
          Exibir preço
          <span className="ml-1 text-xs font-normal text-gray-400">(desmarque para "Sob consulta")</span>
        </label>
      </div>

      {/* Tipo de público */}
      <div>
        <label htmlFor="productType" className="mb-1 block text-sm font-medium text-gray-700">
          Tipo de público
        </label>
        <select
          id="productType"
          name="productType"
          defaultValue={initialData?.productType ?? 'ambos'}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ambos">Ambos</option>
          <option value="varejo">Varejo</option>
          <option value="atacado">Atacado</option>
        </select>
      </div>

      {/* Produtos relacionados */}
      {allProducts.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Produtos relacionados
            <span className="ml-1 text-xs font-normal text-gray-400">(opcional)</span>
          </label>
          <div className="max-h-48 overflow-y-auto rounded-md border border-gray-300 p-2">
            {allProducts
              .filter((p) => p.id !== initialData?.id)
              .map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedRelatedIds.includes(p.id)}
                    onChange={(e) => {
                      setSelectedRelatedIds((prev) =>
                        e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)
                      )
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{p.name}</span>
                </label>
              ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {selectedRelatedIds.length > 0
              ? `${selectedRelatedIds.length} produto(s) selecionado(s)`
              : 'Nenhum produto relacionado selecionado'}
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar produto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/produtos')}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
