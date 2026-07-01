/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/layout/Header'

// Mock next/navigation
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
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

// Mock Sheet components
jest.mock('@/components/ui/sheet', () => {
  const MockSheet = ({ children }: { children: React.ReactNode }) => <div data-testid="sheet">{children}</div>
  const MockSheetTrigger = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <button data-testid="sheet-trigger" {...props}>{children}</button>
  )
  const MockSheetContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  )
  const MockSheetHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  const MockSheetTitle = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  const MockSheetClose = ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-close">{children}</div>
  MockSheet.displayName = 'Sheet'
  MockSheetTrigger.displayName = 'SheetTrigger'
  MockSheetContent.displayName = 'SheetContent'
  MockSheetHeader.displayName = 'SheetHeader'
  MockSheetTitle.displayName = 'SheetTitle'
  MockSheetClose.displayName = 'SheetClose'
  return {
    Sheet: MockSheet,
    SheetTrigger: MockSheetTrigger,
    SheetContent: MockSheetContent,
    SheetHeader: MockSheetHeader,
    SheetTitle: MockSheetTitle,
    SheetClose: MockSheetClose,
  }
})

describe('Header', () => {
  it('renderiza o logo Technicfix', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    expect(screen.getAllByText('Technicfix').length).toBeGreaterThan(0)
  })

  it('renderiza todos os links de navegação no desktop', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    expect(screen.getAllByText('Início').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Produtos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sobre').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contato').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Technocalhas').length).toBeGreaterThan(0)
  })

  it('marca o link ativo com classe de destaque quando pathname é /', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    const activeLinks = screen.getAllByText('Início')
    const linkWithActive = activeLinks.find((el) =>
      el.className.includes('text-orange-500')
    )
    expect(linkWithActive).toBeDefined()
  })

  it('marca o link /produtos como ativo quando pathname é /produtos', () => {
    mockUsePathname.mockReturnValue('/produtos')
    render(<Header />)
    const activeLinks = screen.getAllByText('Produtos')
    const linkWithActive = activeLinks.find((el) =>
      el.className.includes('text-orange-500')
    )
    expect(linkWithActive).toBeDefined()
  })

  it('não marca link inativo com aria-current=page', () => {
    mockUsePathname.mockReturnValue('/produtos')
    render(<Header />)
    // Pega o primeiro link "Início" no nav desktop
    const inicioLinks = screen.getAllByText('Início')
    // Nenhum deve ter aria-current='page'
    const hasCurrentPage = inicioLinks.some(
      (el) => el.getAttribute('aria-current') === 'page'
    )
    expect(hasCurrentPage).toBe(false)
  })

  it('marca o link ativo com aria-current=page', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    const inicioLinks = screen.getAllByText('Início')
    const hasCurrentPage = inicioLinks.some(
      (el) => el.getAttribute('aria-current') === 'page'
    )
    expect(hasCurrentPage).toBe(true)
  })

  it('renderiza o botão hambúrguer para menu mobile', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    const trigger = screen.getByTestId('sheet-trigger')
    expect(trigger).toBeInTheDocument()
  })

  it('o menu mobile contém o Sheet com os links de navegação', () => {
    mockUsePathname.mockReturnValue('/')
    render(<Header />)
    const sheetContent = screen.getByTestId('sheet-content')
    expect(sheetContent).toBeInTheDocument()
  })
})
