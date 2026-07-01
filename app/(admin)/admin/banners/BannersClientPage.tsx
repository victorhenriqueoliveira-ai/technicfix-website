'use client'

import { useState } from 'react'
import { BannerList } from '@/components/admin/banners/BannerList'
import { BannerForm } from '@/components/admin/banners/BannerForm'

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

type BannersClientPageProps = {
  banners: Banner[]
}

export function BannersClientPage({ banners: initialBanners }: BannersClientPageProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  function handleEdit(banner: Banner) {
    setEditingBanner(banner)
    setShowCreateForm(false)
  }

  function handleCreateSuccess() {
    setShowCreateForm(false)
    // Recarregar a página para buscar os dados atualizados
    window.location.reload()
  }

  function handleEditSuccess() {
    setEditingBanner(null)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os banners do carrossel da homepage. Arraste para reordenar.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true)
            setEditingBanner(null)
          }}
          type="button"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + Novo Banner
        </button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Novo Banner</h2>
          <BannerForm onSuccess={handleCreateSuccess} />
          <button
            onClick={() => setShowCreateForm(false)}
            type="button"
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Formulário de edição */}
      {editingBanner && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Editando: {editingBanner.title}
          </h2>
          <BannerForm banner={editingBanner} onSuccess={handleEditSuccess} />
          <button
            onClick={() => setEditingBanner(null)}
            type="button"
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Lista de banners com drag-and-drop */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Banners cadastrados ({banners.length})
        </h2>
        <BannerList
          banners={banners}
          onEdit={handleEdit}
          onOrderChange={(newOrder) => {
            // Atualiza ordem local otimisticamente
            const reordered = newOrder
              .map((id) => banners.find((b) => b.id === id))
              .filter(Boolean) as Banner[]
            setBanners(reordered)
          }}
        />
      </div>
    </div>
  )
}
