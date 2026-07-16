/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BenefitsBar } from '@/components/home/BenefitsBar'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Truck: ({ className }: { className?: string }) => (
    <svg data-testid="icon-truck" className={className} />
  ),
  MessageCircle: ({ className }: { className?: string }) => (
    <svg data-testid="icon-message-circle" className={className} />
  ),
  ShieldCheck: ({ className }: { className?: string }) => (
    <svg data-testid="icon-shield-check" className={className} />
  ),
  Package: ({ className }: { className?: string }) => (
    <svg data-testid="icon-package" className={className} />
  ),
}))

describe('BenefitsBar', () => {
  it('renderiza exatamente 4 itens de benefício', () => {
    render(<BenefitsBar />)
    // Cada benefício tem um título uppercase
    const items = screen.getAllByRole('generic').filter((el) => {
      return el.classList.contains('flex') && el.classList.contains('flex-col')
    })
    // Verifica via títulos
    expect(screen.getByText('Frete para Todo o Brasil')).toBeInTheDocument()
    expect(screen.getByText('Atendimento via WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Qualidade Garantida')).toBeInTheDocument()
    expect(screen.getByText('Variedade de Fixadores')).toBeInTheDocument()
    // Confirma 4 itens
    expect(items).toHaveLength(4)
  })

  it('cada item contém título e descrição corretos', () => {
    render(<BenefitsBar />)
    expect(screen.getByText('Frete para Todo o Brasil')).toBeInTheDocument()
    expect(screen.getByText('Correios e transportadoras')).toBeInTheDocument()

    expect(screen.getByText('Atendimento via WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Resposta rápida')).toBeInTheDocument()

    expect(screen.getByText('Qualidade Garantida')).toBeInTheDocument()
    expect(screen.getByText('Produtos certificados')).toBeInTheDocument()

    expect(screen.getByText('Variedade de Fixadores')).toBeInTheDocument()
    expect(screen.getByText('Parafusos, porcas, arruelas e mais')).toBeInTheDocument()
  })

  it('ícone Truck renderizado para o benefício de frete', () => {
    render(<BenefitsBar />)
    expect(screen.getByTestId('icon-truck')).toBeInTheDocument()
  })

  it('ícone MessageCircle renderizado para o benefício de WhatsApp', () => {
    render(<BenefitsBar />)
    expect(screen.getByTestId('icon-message-circle')).toBeInTheDocument()
  })

  it('ícone ShieldCheck renderizado para o benefício de qualidade', () => {
    render(<BenefitsBar />)
    expect(screen.getByTestId('icon-shield-check')).toBeInTheDocument()
  })

  it('ícone Package renderizado para o benefício de variedade', () => {
    render(<BenefitsBar />)
    expect(screen.getByTestId('icon-package')).toBeInTheDocument()
  })

  it('wrapper section tem classe bg-white e border-b', () => {
    const { container } = render(<BenefitsBar />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-white')
    expect(section).toHaveClass('border-b')
  })

  it('grid tem classes grid-cols-2 e md:grid-cols-4', () => {
    const { container } = render(<BenefitsBar />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2')
    expect(grid).toHaveClass('md:grid-cols-4')
  })
})
