/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/layout/Header'

// Mock next/navigation (necessário para HeaderSearchBar)
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

describe('Header — estrutura 3 camadas (código morto removido)', () => {
  describe('Estrutura geral', () => {
    it('tem className sticky top-0 z-40', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-40')
    })

    it('renderiza sem crash', () => {
      expect(() => render(<Header />)).not.toThrow()
    })
  })

  describe('TopBar — Camada 1', () => {
    it('exibe texto de atendimento via WhatsApp', () => {
      render(<Header />)
      expect(
        screen.getByText(/Atendimento via WhatsApp/i)
      ).toBeInTheDocument()
    })

    it('TopBar tem classe hidden md:block (oculto no mobile)', () => {
      render(<Header />)
      const topBar = screen.getByText(/Atendimento via WhatsApp/i).closest('div')
      expect(topBar).toHaveClass('hidden', 'md:block')
    })
  })

  describe('MainBar — Camada 2', () => {
    it('renderiza o logo TechnicFix com link para /', () => {
      render(<Header />)
      const logoLink = screen.getAllByRole('link').find((el) => el.getAttribute('href') === '/')
      expect(logoLink).toBeInTheDocument()
    })

    it('MainBar contém HeaderSearchBar (input de busca)', () => {
      render(<Header />)
      const searchInput = screen.getByPlaceholderText('Buscar produtos...')
      expect(searchInput).toBeInTheDocument()
    })

    it('MainBar contém link WhatsApp com data-testid whatsapp-cta', () => {
      render(<Header />)
      const whatsappLink = screen.getByTestId('whatsapp-cta')
      expect(whatsappLink).toBeInTheDocument()
      const href = whatsappLink.getAttribute('href') ?? ''
      expect(href === '/contato' || href.includes('wa.me')).toBe(true)
    })
  })

  describe('Código morto removido', () => {
    it('não renderiza CategoryNav como camada 3 do header', () => {
      render(<Header />)
      // CategoryNav foi removido; não deve existir nav de categorias no header
      expect(screen.queryByRole('navigation', { name: /Categorias/i })).toBeNull()
    })

    it('não contém referência a CategoryAccordion (código comentado removido)', () => {
      render(<Header />)
      // Confirma que o drawer não tem nav de categorias
      expect(screen.queryByLabelText(/Categorias/i)).toBeNull()
    })
  })

  describe('Links de nav antigos removidos', () => {
    it('não contém link "Início" na MainBar', () => {
      render(<Header />)
      const inicioLinks = screen.queryAllByRole('link', { name: /^Início$/ })
      expect(inicioLinks.length).toBe(0)
    })

    it('não contém link "Sobre" na MainBar', () => {
      render(<Header />)
      const sobreLinks = screen.queryAllByRole('link', { name: /^Sobre$/ })
      expect(sobreLinks.length).toBe(0)
    })

    it('não contém link "Contato" na MainBar', () => {
      render(<Header />)
      const contatoLinks = screen.queryAllByRole('link', { name: /^Contato$/ })
      expect(contatoLinks.length).toBe(0)
    })
  })
})
