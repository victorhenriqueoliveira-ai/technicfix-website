/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { CategorySummary, ProductNavItem } from '@/lib/types'

// Mock next/navigation (necessário para HeaderSearchBar)
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string
    children: React.ReactNode
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

// Mock do Sheet para viabilizar testes em jsdom (base-ui usa portais/animações)
jest.mock('@/components/ui/sheet', () => {
  const React = require('react')

  interface SheetProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
    [key: string]: unknown
  }

  function Sheet({ open, onOpenChange, children }: SheetProps) {
    return (
      <div data-testid="sheet-root" data-open={open}>
        {React.Children.map(children, (child: React.ReactElement) => {
          if (!child) return null
          return React.cloneElement(child, { __open: open, __onOpenChange: onOpenChange })
        })}
      </div>
    )
  }

  interface SheetTriggerProps {
    children?: React.ReactNode
    __onOpenChange?: (open: boolean) => void
    __open?: boolean
    'aria-label'?: string
    className?: string
    'data-testid'?: string
    [key: string]: unknown
  }

  function SheetTrigger({ children, __onOpenChange, 'aria-label': ariaLabel, className, 'data-testid': testId }: SheetTriggerProps) {
    return (
      <button
        aria-label={ariaLabel}
        className={className}
        data-testid={testId ?? 'sheet-trigger'}
        onClick={() => __onOpenChange?.(true)}
      >
        {children}
      </button>
    )
  }

  interface SheetContentProps {
    children?: React.ReactNode
    __open?: boolean
    __onOpenChange?: (open: boolean) => void
    side?: string
    className?: string
    [key: string]: unknown
  }

  function SheetContent({ children, __open }: SheetContentProps) {
    if (!__open) return null
    return <div data-testid="sheet-content">{children}</div>
  }

  return { Sheet, SheetTrigger, SheetContent }
})

// ---- Dados de teste ----

function makeCategory(
  id: string,
  name: string,
  slug: string,
  children: CategorySummary[] = []
): CategorySummary {
  return { id, name, slug, imageUrl: null, children }
}

const categorias: CategorySummary[] = [
  makeCategory('c1', 'Parafusos', 'parafusos'),
  makeCategory('c2', 'Ferramentas', 'ferramentas', [
    makeCategory('c2-1', 'Chaves', 'chaves'),
  ]),
]

const produtos: ProductNavItem[] = [
  { name: 'Parafuso M8', slug: 'parafuso-m8' },
  { name: 'Bucha S6', slug: 'bucha-s6' },
]

// ---- Testes ----

describe('MobileMenu', () => {
  describe('Botão hamburguer', () => {
    it('renderiza o botão hamburguer sem lançar erros com categories=[] e products=[]', () => {
      expect(() =>
        render(<MobileMenu categories={[]} products={[]} />)
      ).not.toThrow()
    })

    it('botão hamburguer tem aria-label "Abrir menu"', () => {
      render(<MobileMenu categories={[]} products={[]} />)
      expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
    })

    it('clicar no botão hamburguer abre o Sheet (open muda para true)', () => {
      render(<MobileMenu categories={[]} products={[]} />)
      const btn = screen.getByTestId('hamburger-button')
      expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument()
      fireEvent.click(btn)
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
    })
  })

  describe('Sheet aberto — conteúdo', () => {
    function renderAberto() {
      const utils = render(<MobileMenu categories={categorias} products={produtos} />)
      fireEvent.click(screen.getByTestId('hamburger-button'))
      return utils
    }

    it('HeaderSearchBar está presente no Sheet com a prop onSearch configurada', () => {
      renderAberto()
      // HeaderSearchBar renderiza um input de busca
      expect(screen.getByPlaceholderText('Buscar produtos...')).toBeInTheDocument()
    })

    it('chamar onSearch (simulando busca confirmada) fecha o Sheet (open muda para false)', () => {
      renderAberto()
      // Sheet está aberto
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument()

      // Submete o formulário de busca com texto válido
      const input = screen.getByPlaceholderText('Buscar produtos...')
      fireEvent.change(input, { target: { value: 'parafuso' } })
      const form = input.closest('form')!
      fireEvent.submit(form)

      // Sheet deve fechar
      expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument()
    })

    it('CategoryAccordion é renderizado com as categorias passadas via prop', () => {
      renderAberto()
      expect(screen.getByTestId('category-accordion')).toBeInTheDocument()
      expect(screen.getByText('Parafusos')).toBeInTheDocument()
      expect(screen.getByText('Ferramentas')).toBeInTheDocument()
    })

    it('accordion de Produtos renderiza links para cada produto em products', () => {
      renderAberto()
      expect(screen.getByTestId('product-link-parafuso-m8')).toBeInTheDocument()
      expect(screen.getByTestId('product-link-bucha-s6')).toBeInTheDocument()
      expect(screen.getByTestId('product-link-parafuso-m8')).toHaveAttribute(
        'href',
        '/produtos/parafuso-m8'
      )
      expect(screen.getByTestId('product-link-bucha-s6')).toHaveAttribute(
        'href',
        '/produtos/bucha-s6'
      )
    })

    it('accordion de Produtos sempre exibe "Ver todos os produtos" apontando para /produtos', () => {
      renderAberto()
      const verTodos = screen.getByTestId('ver-todos-produtos')
      expect(verTodos).toBeInTheDocument()
      expect(verTodos).toHaveAttribute('href', '/produtos')
      expect(verTodos).toHaveTextContent('Ver todos os produtos')
    })

    it('com products=[], accordion de Produtos exibe apenas "Ver todos os produtos"', () => {
      render(<MobileMenu categories={[]} products={[]} />)
      fireEvent.click(screen.getByTestId('hamburger-button'))

      const verTodos = screen.getByTestId('ver-todos-produtos')
      expect(verTodos).toBeInTheDocument()
      // Não deve existir outros links de produtos
      expect(screen.queryByTestId('product-link-parafuso-m8')).not.toBeInTheDocument()
    })
  })

  describe('Integração — MobileMenu em Header mockado', () => {
    it('MobileMenu inserido em um Header mockado renderiza sem erro com dados reais de categoria', () => {
      function MockHeader() {
        return (
          <header>
            <MobileMenu categories={categorias} products={produtos} />
          </header>
        )
      }
      expect(() => render(<MockHeader />)).not.toThrow()
      expect(screen.getByTestId('hamburger-button')).toBeInTheDocument()
    })
  })

  describe('Visibilidade mobile', () => {
    it('container raiz tem classe md:hidden (oculto no desktop)', () => {
      render(<MobileMenu categories={[]} products={[]} />)
      const container = screen.getByTestId('mobile-menu')
      expect(container).toHaveClass('md:hidden')
    })
  })
})
