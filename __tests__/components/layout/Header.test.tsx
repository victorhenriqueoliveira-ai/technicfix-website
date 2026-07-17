/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/layout/Header'
import { CategorySummary } from '@/lib/types'

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

// Mock next/image (necessário para CategoryNav)
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

const mockCategories: CategorySummary[] = [
  {
    id: '1',
    name: 'Parafusos',
    slug: 'parafusos',
    imageUrl: null,
    children: [
      { id: '1-1', name: 'Parafusos Allen', slug: 'parafusos-allen', imageUrl: null, children: [] },
    ],
  },
  {
    id: '2',
    name: 'Porcas',
    slug: 'porcas',
    imageUrl: null,
    children: [],
  },
  {
    id: '3',
    name: 'Arruelas',
    slug: 'arruelas',
    imageUrl: null,
    children: [],
  },
]

describe('Header — nova estrutura 3 camadas', () => {
  describe('Estrutura geral', () => {
    it('tem className sticky top-0 z-40', () => {
      const { container } = render(<Header categories={[]} />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-40')
    })

    it('renderiza sem crash com categories: []', () => {
      expect(() => render(<Header categories={[]} />)).not.toThrow()
    })

    it('renderiza sem crash com categories indefinido (default [])', () => {
      expect(() => render(<Header />)).not.toThrow()
    })

    it('renderiza sem crash com 3 categorias', () => {
      expect(() => render(<Header categories={mockCategories} />)).not.toThrow()
    })
  })

  describe('TopBar — Camada 1', () => {
    it('exibe texto de entrega e atendimento', () => {
      render(<Header categories={[]} />)
      expect(
        screen.getByText(/Entrega para todo o Brasil/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Atendimento via WhatsApp/i)
      ).toBeInTheDocument()
    })

    it('TopBar tem classe hidden md:block (oculto no mobile)', () => {
      render(<Header categories={[]} />)
      const topBar = screen.getByText(/Entrega para todo o Brasil/i).closest('div')
      expect(topBar).toHaveClass('hidden', 'md:block')
    })
  })

  describe('MainBar — Camada 2', () => {
    it('renderiza o logo TechnicFix com link para /', () => {
      render(<Header categories={[]} />)
      // O logo é um link para / contendo texto "Technic" e "Fix"
      const logoLink = screen.getAllByRole('link').find((el) => el.getAttribute('href') === '/')
      expect(logoLink).toBeInTheDocument()
      expect(logoLink?.textContent).toMatch(/Technic/i)
      expect(logoLink?.textContent).toMatch(/Fix/i)
    })

    it('MainBar contém HeaderSearchBar (input de busca)', () => {
      render(<Header categories={[]} />)
      const searchInput = screen.getByPlaceholderText('Buscar produtos...')
      expect(searchInput).toBeInTheDocument()
    })

    it('MainBar contém link WhatsApp com data-testid whatsapp-cta', () => {
      render(<Header categories={[]} />)
      const whatsappLink = screen.getByTestId('whatsapp-cta')
      expect(whatsappLink).toBeInTheDocument()
      // href deve conter wa.me (quando env var definida) ou /contato (fallback)
      const href = whatsappLink.getAttribute('href') ?? ''
      expect(href === '/contato' || href.includes('wa.me')).toBe(true)
    })
  })

  describe('CategoryNav — Camada 3', () => {
    it('renderiza CategoryNav com categories: [] sem crash', () => {
      render(<Header categories={[]} />)
      // CategoryNav desktop nav deve estar presente mesmo vazio
      expect(screen.queryByRole('navigation', { name: /Categorias/i })).not.toBeNull()
    })

    it('CategoryNav recebe o array correto de 3 categorias', () => {
      render(<Header categories={mockCategories} />)
      // Nomes das categorias devem aparecer na nav
      expect(screen.getAllByText('Parafusos').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Porcas').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Arruelas').length).toBeGreaterThan(0)
    })
  })

  describe('Links de nav antigos removidos', () => {
    it('não contém link "Início" na MainBar', () => {
      render(<Header categories={[]} />)
      // O link "Início" dos nav links antigos não deve existir
      const inicioLinks = screen.queryAllByRole('link', { name: /^Início$/ })
      expect(inicioLinks.length).toBe(0)
    })

    it('não contém link "Sobre" na MainBar', () => {
      render(<Header categories={[]} />)
      const sobreLinks = screen.queryAllByRole('link', { name: /^Sobre$/ })
      expect(sobreLinks.length).toBe(0)
    })

    it('não contém link "Contato" na MainBar', () => {
      render(<Header categories={[]} />)
      const contatoLinks = screen.queryAllByRole('link', { name: /^Contato$/ })
      expect(contatoLinks.length).toBe(0)
    })

    it('não contém link "Technocalhas" na MainBar', () => {
      render(<Header categories={[]} />)
      const technocalhasLinks = screen.queryAllByRole('link', { name: /^Technocalhas$/ })
      expect(technocalhasLinks.length).toBe(0)
    })
  })
})
