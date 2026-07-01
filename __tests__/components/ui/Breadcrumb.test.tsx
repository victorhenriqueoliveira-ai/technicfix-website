/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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

import { Breadcrumb } from '@/components/ui/Breadcrumb'

describe('Breadcrumb', () => {
  it('renderiza sempre o link Início', () => {
    render(<Breadcrumb items={[{ label: 'Sobre' }]} />)
    const link = screen.getByRole('link', { name: 'Início' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renderiza o item atual sem link e com aria-current=page', () => {
    render(<Breadcrumb items={[{ label: 'Contato' }]} />)
    const current = screen.getByText('Contato')
    expect(current).toBeInTheDocument()
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName).not.toBe('A')
  })

  it('renderiza item intermediário com link quando href fornecido', () => {
    render(<Breadcrumb items={[{ label: 'Produtos', href: '/produtos' }, { label: 'Calhas' }]} />)
    const produtosLink = screen.getByRole('link', { name: 'Produtos' })
    expect(produtosLink).toHaveAttribute('href', '/produtos')
    expect(screen.getByText('Calhas')).toHaveAttribute('aria-current', 'page')
  })

  it('tem nav com aria-label="Breadcrumb"', () => {
    render(<Breadcrumb items={[{ label: 'Sobre' }]} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renderiza separador > entre itens', () => {
    render(<Breadcrumb items={[{ label: 'Sobre' }]} />)
    expect(document.querySelector('nav')?.textContent).toContain('>')
  })
})
