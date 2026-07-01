/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Footer } from '@/components/layout/Footer'

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

describe('Footer', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('renderiza o nome da loja', () => {
    render(<Footer />)
    expect(screen.getByText('Technicfix')).toBeInTheDocument()
  })

  it('renderiza todos os links rápidos', () => {
    render(<Footer />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Sobre')).toBeInTheDocument()
    expect(screen.getAllByText('Contato').length).toBeGreaterThan(0)
    expect(screen.getByText('Technocalhas')).toBeInTheDocument()
  })

  it('renderiza o copyright com o ano corrente', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument()
    expect(
      screen.getByText(/Todos os direitos reservados/i)
    ).toBeInTheDocument()
  })

  it('não exibe link de WhatsApp no footer quando variável não está definida', () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    render(<Footer />)
    expect(screen.queryByText('WhatsApp')).not.toBeInTheDocument()
  })

  it('exibe link de WhatsApp no footer quando variável está definida', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '11999999999'
    render(<Footer />)
    const whatsappLink = screen.getByText('WhatsApp')
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink.closest('a')).toHaveAttribute(
      'href',
      'https://wa.me/5511999999999'
    )
  })
})
