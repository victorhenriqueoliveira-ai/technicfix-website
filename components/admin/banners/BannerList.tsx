'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderBanners, deleteBanner } from '@/actions/banners'

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

type SortableItemProps = {
  banner: Banner
  onDelete: (id: string) => void
  onEdit: (banner: Banner) => void
}

function SortableItem({ banner, onDelete, onEdit }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: banner.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
    >
      {/* Handle de arrasto */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        aria-label="Arrastar para reordenar"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8-16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      </button>

      {/* Miniatura */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="h-12 w-20 rounded object-cover"
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = '/placeholder-banner.svg'
        }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-gray-900">{banner.title}</p>
        {banner.subtitle && (
          <p className="truncate text-sm text-gray-500">{banner.subtitle}</p>
        )}
      </div>

      {/* Status */}
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          banner.active
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {banner.active ? 'Ativo' : 'Inativo'}
      </span>

      {/* Ações */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(banner)}
          type="button"
          className="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(banner.id)}
          type="button"
          className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

type BannerListProps = {
  banners: Banner[]
  onEdit: (banner: Banner) => void
  onOrderChange?: (newOrder: string[]) => void
}

export function BannerList({ banners: initialBanners, onEdit, onOrderChange }: BannerListProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = banners.findIndex((b) => b.id === active.id)
    const newIndex = banners.findIndex((b) => b.id === over.id)

    const newBanners = arrayMove(banners, oldIndex, newIndex)
    const newOrder = newBanners.map((b) => b.id)

    setBanners(newBanners)
    onOrderChange?.(newOrder)

    startTransition(() => {
      reorderBanners(newOrder)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    startTransition(async () => {
      await deleteBanner(id)
      setBanners((prev) => prev.filter((b) => b.id !== id))
    })
  }

  if (banners.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        Nenhum banner cadastrado. Crie o primeiro banner acima.
      </p>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2" data-testid="banner-list">
          {banners.map((banner) => (
            <SortableItem key={banner.id} banner={banner} onDelete={handleDelete} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
