/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MetricCard } from '@/components/admin/MetricCard'

describe('MetricCard', () => {
  it('renderiza o título passado como prop', () => {
    render(<MetricCard title="Total de Produtos" value={42} />)
    expect(screen.getByText('Total de Produtos')).toBeInTheDocument()
  })

  it('renderiza o valor numérico passado como prop', () => {
    render(<MetricCard title="Leads Novos" value={7} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renderiza o ícone quando fornecido', () => {
    render(
      <MetricCard
        title="Categorias"
        value={3}
        icon={<svg data-testid="icone-cat" />}
      />
    )
    expect(screen.getByTestId('icone-cat')).toBeInTheDocument()
  })

  it('renderiza sem ícone quando não fornecido', () => {
    render(<MetricCard title="Sem Ícone" value={0} />)
    expect(screen.getByText('Sem Ícone')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
