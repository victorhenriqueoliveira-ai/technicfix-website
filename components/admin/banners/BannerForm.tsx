'use client'

import { useTransition, useRef } from 'react'
import { createBanner, updateBanner } from '@/actions/banners'

type Banner = {
  id: string
  imageUrl: string
  title: string
  subtitle?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  active: boolean
  order: number
}

type BannerFormProps = {
  banner?: Banner
  onSuccess?: () => void
}

export function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const action = banner
    ? updateBanner.bind(null, banner.id)
    : createBanner

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(formData)
      if (result.success) {
        formRef.current?.reset()
        onSuccess?.()
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL da Imagem *
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          defaultValue={banner?.imageUrl ?? ''}
          required
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={banner?.title ?? ''}
          required
          placeholder="Título do banner"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
          Subtítulo (opcional)
        </label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          defaultValue={banner?.subtitle ?? ''}
          placeholder="Subtítulo do banner"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">
          Texto do CTA (opcional)
        </label>
        <input
          id="ctaText"
          name="ctaText"
          type="text"
          defaultValue={banner?.ctaText ?? ''}
          placeholder="Ex: Ver produtos"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700">
          URL do CTA (opcional)
        </label>
        <input
          id="ctaUrl"
          name="ctaUrl"
          type="text"
          defaultValue={banner?.ctaUrl ?? ''}
          placeholder="Ex: /produtos"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={banner?.active ?? true}
          value="on"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Ativo (visível na homepage)
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : banner ? 'Atualizar Banner' : 'Criar Banner'}
        </button>
      </div>
    </form>
  )
}
