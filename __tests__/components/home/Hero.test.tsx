/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-left" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg data-testid="icon-chevron-right" className={className} />
  ),
}))

jest.useFakeTimers()

const makeBanner = (overrides: Partial<BannerData> = {}): BannerData => ({
  id: '1',
  imageUrl: 'https://example.com/banner.jpg',
  title: 'Banner de Teste',
  subtitle: 'Subtítulo do banner',
  ctaText: 'Ver Mais',
  ctaUrl: '/produtos',
  order: 0,
  active: true,
  ...overrides,
})

describe('Hero', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('Fallback amber', () => {
    it('exibe fallback (picture) quando banners é vazio', () => {
      render(<Hero banners={[]} />)
      expect(screen.getByTestId('hero-fallback')).toBeInTheDocument()
    })

    it('exibe fallback quando banner tem imageUrl vazio', () => {
      render(<Hero banners={[makeBanner({ imageUrl: '' })]} />)
      expect(screen.getByTestId('hero-fallback')).toBeInTheDocument()
    })

    it('não crasha com imageUrl null', () => {
      // @ts-expect-error — teste propositalmente com null
      render(<Hero banners={[makeBanner({ imageUrl: null })]} />)
      expect(screen.getByTestId('hero-fallback')).toBeInTheDocument()
    })

    it('fallback exibe imagem /banner.png', () => {
      render(<Hero banners={[]} />)
      const img = screen.getByTestId('hero-image')
      expect(img).toHaveAttribute('src', '/banner.png')
    })
  })

  describe('Renderização com banners', () => {
    it('renderiza a imagem do banner 0 inicialmente com 3 banners', () => {
      const banners = [
        makeBanner({ id: '1', imageUrl: 'https://example.com/b1.jpg' }),
        makeBanner({ id: '2', imageUrl: 'https://example.com/b2.jpg' }),
        makeBanner({ id: '3', imageUrl: 'https://example.com/b3.jpg' }),
      ]
      render(<Hero banners={banners} />)
      const img = screen.getByTestId('hero-image')
      expect(img).toHaveAttribute('src', 'https://example.com/b1.jpg')
    })

    it('renderiza a seção hero com aria-label correto', () => {
      render(<Hero banners={[makeBanner()]} />)
      expect(screen.getByRole('region', { name: 'Banner principal' })).toBeInTheDocument()
    })

    it('container não tem inline style de height', () => {
      render(<Hero banners={[makeBanner()]} />)
      const section = screen.getByTestId('hero-section')
      expect(section).not.toHaveStyle({ height: '650px' })
      expect(section.getAttribute('style')).toBeFalsy()
    })

    it('container tem classe h-[650px] no className', () => {
      render(<Hero banners={[makeBanner()]} />)
      const section = screen.getByTestId('hero-section')
      expect(section.className).toContain('h-[650px]')
    })

    it('não tem elemento com overlay navy escuro sobre a imagem', () => {
      render(<Hero banners={[makeBanner()]} />)
      // Verifica ausência de overlay bg-black com opacity sobre a imagem
      const overlays = document.querySelectorAll('[class*="bg-black/"]')
      // Somente os botões de seta podem ter bg-black/30 — nenhum overlay de tela cheia
      overlays.forEach((el) => {
        expect(el.tagName).not.toBe('DIV')
      })
    })
  })

  describe('Navegação por setas', () => {
    it('não exibe setas quando há apenas 1 banner', () => {
      render(<Hero banners={[makeBanner()]} />)
      expect(screen.queryByTestId('hero-prev')).not.toBeInTheDocument()
      expect(screen.queryByTestId('hero-next')).not.toBeInTheDocument()
    })

    it('exibe setas quando há mais de 1 banner', () => {
      const banners = [makeBanner({ id: '1' }), makeBanner({ id: '2', title: 'B2' })]
      render(<Hero banners={banners} />)
      expect(screen.getByTestId('hero-prev')).toBeInTheDocument()
      expect(screen.getByTestId('hero-next')).toBeInTheDocument()
    })

    it('clicar na seta direita avança para o banner 1', () => {
      const banners = [
        makeBanner({ id: '1', imageUrl: 'https://example.com/b1.jpg' }),
        makeBanner({ id: '2', imageUrl: 'https://example.com/b2.jpg' }),
        makeBanner({ id: '3', imageUrl: 'https://example.com/b3.jpg' }),
      ]
      render(<Hero banners={banners} />)
      fireEvent.click(screen.getByTestId('hero-next'))
      expect(screen.getByTestId('hero-image')).toHaveAttribute('src', 'https://example.com/b2.jpg')
    })

    it('clicar na seta esquerda a partir do banner 0 vai para o último banner (loop)', () => {
      const banners = [
        makeBanner({ id: '1', imageUrl: 'https://example.com/b1.jpg' }),
        makeBanner({ id: '2', imageUrl: 'https://example.com/b2.jpg' }),
        makeBanner({ id: '3', imageUrl: 'https://example.com/b3.jpg' }),
      ]
      render(<Hero banners={banners} />)
      fireEvent.click(screen.getByTestId('hero-prev'))
      expect(screen.getByTestId('hero-image')).toHaveAttribute('src', 'https://example.com/b3.jpg')
    })
  })

  describe('Dots de navegação', () => {
    it('não renderiza dots quando há apenas 1 banner', () => {
      render(<Hero banners={[makeBanner()]} />)
      expect(screen.queryByLabelText('Indicadores de banner')).not.toBeInTheDocument()
    })

    it('renderiza dots quando há múltiplos banners', () => {
      const banners = [makeBanner({ id: '1' }), makeBanner({ id: '2', title: 'B2' })]
      render(<Hero banners={banners} />)
      expect(screen.getByLabelText('Indicadores de banner')).toBeInTheDocument()
    })

    it('clicar no dot 2 vai para o banner 2', () => {
      const banners = [
        makeBanner({ id: '1', imageUrl: 'https://example.com/b1.jpg' }),
        makeBanner({ id: '2', imageUrl: 'https://example.com/b2.jpg' }),
        makeBanner({ id: '3', imageUrl: 'https://example.com/b3.jpg' }),
      ]
      render(<Hero banners={banners} />)
      const dot3 = screen.getByLabelText('Ir para banner 3')
      fireEvent.click(dot3)
      expect(screen.getByTestId('hero-image')).toHaveAttribute('src', 'https://example.com/b3.jpg')
    })
  })

  describe('Ícones de navegação', () => {
    it('exibe ícone ChevronLeft na seta esquerda', () => {
      const banners = [makeBanner({ id: '1' }), makeBanner({ id: '2', title: 'B2' })]
      render(<Hero banners={banners} />)
      expect(screen.getByTestId('icon-chevron-left')).toBeInTheDocument()
    })

    it('exibe ícone ChevronRight na seta direita', () => {
      const banners = [makeBanner({ id: '1' }), makeBanner({ id: '2', title: 'B2' })]
      render(<Hero banners={banners} />)
      expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument()
    })
  })
})
