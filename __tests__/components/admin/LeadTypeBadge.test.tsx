/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadTypeBadge } from '@/components/admin/LeadTypeBadge'

describe('LeadTypeBadge', () => {
  it('renderiza badge laranja para tipo "varejo"', () => {
    render(<LeadTypeBadge type="varejo" />)
    const badge = screen.getByTestId('lead-type-badge')
    expect(badge).toHaveTextContent('Varejo')
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800')
  })

  it('renderiza badge roxo para tipo "atacado"', () => {
    render(<LeadTypeBadge type="atacado" />)
    const badge = screen.getByTestId('lead-type-badge')
    expect(badge).toHaveTextContent('Atacado')
    expect(badge).toHaveClass('bg-purple-100', 'text-purple-800')
  })

  it('renderiza badge cinza para tipo "geral"', () => {
    render(<LeadTypeBadge type="geral" />)
    const badge = screen.getByTestId('lead-type-badge')
    expect(badge).toHaveTextContent('Geral')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('inclui data-type no atributo do elemento', () => {
    render(<LeadTypeBadge type="atacado" />)
    const badge = screen.getByTestId('lead-type-badge')
    expect(badge).toHaveAttribute('data-type', 'atacado')
  })
})
