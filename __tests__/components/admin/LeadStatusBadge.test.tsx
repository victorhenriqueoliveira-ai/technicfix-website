/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge'

describe('LeadStatusBadge', () => {
  it('renderiza badge azul para status "novo"', () => {
    render(<LeadStatusBadge status="novo" />)
    const badge = screen.getByTestId('lead-status-badge')
    expect(badge).toHaveTextContent('Novo')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('renderiza badge amarelo para status "em_atendimento"', () => {
    render(<LeadStatusBadge status="em_atendimento" />)
    const badge = screen.getByTestId('lead-status-badge')
    expect(badge).toHaveTextContent('Em Atendimento')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('renderiza badge verde para status "convertido"', () => {
    render(<LeadStatusBadge status="convertido" />)
    const badge = screen.getByTestId('lead-status-badge')
    expect(badge).toHaveTextContent('Convertido')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renderiza badge vermelho para status "perdido"', () => {
    render(<LeadStatusBadge status="perdido" />)
    const badge = screen.getByTestId('lead-status-badge')
    expect(badge).toHaveTextContent('Perdido')
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('inclui data-status no atributo do elemento', () => {
    render(<LeadStatusBadge status="novo" />)
    const badge = screen.getByTestId('lead-status-badge')
    expect(badge).toHaveAttribute('data-status', 'novo')
  })
})
