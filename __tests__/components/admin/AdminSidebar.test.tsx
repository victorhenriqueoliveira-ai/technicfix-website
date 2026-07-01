/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock usePathname
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <svg data-testid="icon-dashboard" />,
  Package: () => <svg data-testid="icon-package" />,
  Tag: () => <svg data-testid="icon-tag" />,
  Image: () => <svg data-testid="icon-image" />,
  Users: () => <svg data-testid="icon-users" />,
  Settings: () => <svg data-testid="icon-settings" />,
}))

import { AdminSidebar } from '@/components/admin/AdminSidebar'

describe('AdminSidebar', () => {
  it('renderiza todos os 6 links de navegação', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Categorias')).toBeInTheDocument()
    expect(screen.getByText('Banners')).toBeInTheDocument()
    expect(screen.getByText('Leads')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('aplica aria-current=page ao link Dashboard quando pathname é /admin', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('aria-current', 'page')
  })

  it('aplica aria-current=page ao link Produtos quando pathname começa com /admin/produtos', () => {
    mockUsePathname.mockReturnValue('/admin/produtos')
    render(<AdminSidebar />)

    const produtosLink = screen.getByText('Produtos').closest('a')
    expect(produtosLink).toHaveAttribute('aria-current', 'page')
  })

  it('não marca Dashboard como ativo quando pathname é /admin/produtos', () => {
    mockUsePathname.mockReturnValue('/admin/produtos')
    render(<AdminSidebar />)

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).not.toHaveAttribute('aria-current', 'page')
  })

  it('renderiza os hrefs corretos para os 6 links', () => {
    mockUsePathname.mockReturnValue('/admin')
    render(<AdminSidebar />)

    const expectedLinks = [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Produtos', href: '/admin/produtos' },
      { label: 'Categorias', href: '/admin/categorias' },
      { label: 'Banners', href: '/admin/banners' },
      { label: 'Leads', href: '/admin/leads' },
      { label: 'Configurações', href: '/admin/configuracoes' },
    ]

    expectedLinks.forEach(({ label, href }) => {
      const link = screen.getByText(label).closest('a')
      expect(link).toHaveAttribute('href', href)
    })
  })
})
