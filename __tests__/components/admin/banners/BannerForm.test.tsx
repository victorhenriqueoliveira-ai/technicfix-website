/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/actions/banners', () => ({
  createBanner: jest.fn().mockResolvedValue({ success: true }),
  updateBanner: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock de useTransition para evitar problemas com React concorrente em jsdom
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: () => [false, (fn: () => void) => fn()],
}))

import { BannerForm } from '@/components/admin/banners/BannerForm'

describe('BannerForm', () => {
  it('exibe campo de título', () => {
    render(<BannerForm />)
    expect(screen.getByLabelText(/título \*/i)).toBeInTheDocument()
  })

  it('exibe campo de subtítulo', () => {
    render(<BannerForm />)
    expect(screen.getByLabelText(/subtítulo/i)).toBeInTheDocument()
  })

  it('exibe campo de texto do CTA', () => {
    render(<BannerForm />)
    expect(screen.getByLabelText(/texto do cta/i)).toBeInTheDocument()
  })

  it('exibe campo de URL do CTA', () => {
    render(<BannerForm />)
    expect(screen.getByLabelText(/url do cta/i)).toBeInTheDocument()
  })

  it('exibe campo de URL da imagem', () => {
    render(<BannerForm />)
    expect(screen.getByLabelText(/url da imagem/i)).toBeInTheDocument()
  })

  it('exibe checkbox de ativo', () => {
    render(<BannerForm />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('preenche campos com valores do banner ao editar', () => {
    const banner = {
      id: 'banner-1',
      imageUrl: 'https://example.com/img.jpg',
      title: 'Meu Banner',
      subtitle: 'Meu Subtítulo',
      ctaText: 'Ver produtos',
      ctaUrl: '/produtos',
      active: true,
      order: 0,
    }

    render(<BannerForm banner={banner} />)

    expect(screen.getByDisplayValue('Meu Banner')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Meu Subtítulo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Ver produtos')).toBeInTheDocument()
    expect(screen.getByDisplayValue('/produtos')).toBeInTheDocument()
  })

  it('exibe botão "Criar Banner" no modo de criação', () => {
    render(<BannerForm />)
    expect(screen.getByRole('button', { name: /criar banner/i })).toBeInTheDocument()
  })

  it('exibe botão "Atualizar Banner" no modo de edição', () => {
    const banner = {
      id: 'b1',
      imageUrl: 'https://example.com/img.jpg',
      title: 'Banner',
      subtitle: null,
      ctaText: null,
      ctaUrl: null,
      active: true,
      order: 0,
    }
    render(<BannerForm banner={banner} />)
    expect(screen.getByRole('button', { name: /atualizar banner/i })).toBeInTheDocument()
  })
})
