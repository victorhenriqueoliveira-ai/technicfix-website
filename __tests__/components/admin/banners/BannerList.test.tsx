/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock das actions
jest.mock('@/actions/banners', () => ({
  reorderBanners: jest.fn().mockResolvedValue({ success: true }),
  deleteBanner: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock do @dnd-kit para ambiente jsdom (sem suporte a pointer events)
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  sortableKeyboardCoordinates: jest.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
  verticalListSortingStrategy: jest.fn(),
  arrayMove: jest.fn((arr: unknown[], from: number, to: number) => {
    const copy = [...arr]
    const [removed] = copy.splice(from, 1)
    copy.splice(to, 0, removed)
    return copy
  }),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}))

import { BannerList } from '@/components/admin/banners/BannerList'

const banners = [
  {
    id: 'banner-1',
    imageUrl: 'https://example.com/1.jpg',
    title: 'Banner Um',
    subtitle: 'Subtítulo Um',
    ctaText: 'Ver',
    ctaUrl: '/produtos',
    active: true,
    order: 0,
  },
  {
    id: 'banner-2',
    imageUrl: 'https://example.com/2.jpg',
    title: 'Banner Dois',
    subtitle: null,
    ctaText: null,
    ctaUrl: null,
    active: false,
    order: 1,
  },
]

describe('BannerList', () => {
  it('renderiza um item por banner recebido como prop', () => {
    render(<BannerList banners={banners} onEdit={jest.fn()} />)

    expect(screen.getByText('Banner Um')).toBeInTheDocument()
    expect(screen.getByText('Banner Dois')).toBeInTheDocument()
  })

  it('exibe "Ativo" para banner ativo e "Inativo" para banner inativo', () => {
    render(<BannerList banners={banners} onEdit={jest.fn()} />)

    expect(screen.getByText('Ativo')).toBeInTheDocument()
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('exibe subtítulo quando fornecido', () => {
    render(<BannerList banners={banners} onEdit={jest.fn()} />)

    expect(screen.getByText('Subtítulo Um')).toBeInTheDocument()
  })

  it('renderiza botões de Editar e Excluir para cada banner', () => {
    render(<BannerList banners={banners} onEdit={jest.fn()} />)

    const editButtons = screen.getAllByText('Editar')
    const deleteButtons = screen.getAllByText('Excluir')

    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('exibe mensagem quando não há banners', () => {
    render(<BannerList banners={[]} onEdit={jest.fn()} />)

    expect(screen.getByText(/Nenhum banner cadastrado/)).toBeInTheDocument()
  })

  it('chama onEdit com o banner correto ao clicar em Editar', async () => {
    const onEdit = jest.fn()
    render(<BannerList banners={banners} onEdit={onEdit} />)

    const editButtons = screen.getAllByText('Editar')
    editButtons[0].click()

    expect(onEdit).toHaveBeenCalledWith(banners[0])
  })
})
