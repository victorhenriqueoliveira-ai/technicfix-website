/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Hero } from '@/components/home/Hero'
import type { BannerData } from '@/components/home/Hero'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock useEffect para evitar timer de autoplay nos testes
jest.useFakeTimers()

const mockBanner: BannerData = {
  id: '1',
  imageUrl: 'https://example.com/banner.jpg',
  title: 'Banner de Teste',
  subtitle: 'Subtítulo do banner',
  ctaText: 'Ver Mais',
  ctaUrl: '/produtos',
  order: 0,
  active: true,
}

describe('Hero', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('renderiza o banner de fallback quando a lista de banners está vazia', () => {
    render(<Hero banners={[]} />)
    expect(
      screen.getByText('Technicfix — Parafusos e Materiais de Obra')
    ).toBeInTheDocument()
  })

  it('renderiza o texto do fallback com subtítulo', () => {
    render(<Hero banners={[]} />)
    expect(
      screen.getByText('Qualidade e durabilidade para seus projetos')
    ).toBeInTheDocument()
  })

  it('renderiza o CTA de fallback com link para /produtos', () => {
    render(<Hero banners={[]} />)
    const cta = screen.getByTestId('hero-cta')
    expect(cta).toBeInTheDocument()
    expect(cta).toHaveAttribute('href', '/produtos')
  })

  it('renderiza o título do primeiro banner quando a lista tem um item', () => {
    render(<Hero banners={[mockBanner]} />)
    expect(screen.getByTestId('hero-title')).toHaveTextContent('Banner de Teste')
  })

  it('renderiza o subtítulo do banner quando fornecido', () => {
    render(<Hero banners={[mockBanner]} />)
    expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('Subtítulo do banner')
  })

  it('renderiza o CTA com href correto quando fornecido no banner', () => {
    render(<Hero banners={[mockBanner]} />)
    const cta = screen.getByTestId('hero-cta')
    expect(cta).toHaveAttribute('href', '/produtos')
    expect(cta).toHaveTextContent('Ver Mais')
  })

  it('renderiza a seção hero com aria-label correto', () => {
    render(<Hero banners={[mockBanner]} />)
    expect(screen.getByRole('region', { name: 'Banner principal' })).toBeInTheDocument()
  })

  it('não renderiza indicadores quando há apenas um banner', () => {
    render(<Hero banners={[mockBanner]} />)
    expect(screen.queryByLabelText('Indicadores de banner')).not.toBeInTheDocument()
  })

  it('renderiza indicadores quando há múltiplos banners', () => {
    const banners: BannerData[] = [
      mockBanner,
      { ...mockBanner, id: '2', title: 'Banner 2' },
    ]
    render(<Hero banners={banners} />)
    expect(screen.getByLabelText('Indicadores de banner')).toBeInTheDocument()
  })
})
