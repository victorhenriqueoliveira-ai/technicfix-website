/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { SalesList, SaleItem } from '@/components/admin/SalesList'

function makeSale(overrides: Partial<SaleItem> & { id: string }): SaleItem {
  return {
    productId: 'prod-1',
    productName: 'Produto Teste',
    quantity: 1,
    buyerType: 'varejo',
    notes: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('SalesList', () => {
  it('exibe "Nenhuma venda registrada ainda." quando array de vendas está vazio', () => {
    render(<SalesList sales={[]} />)
    expect(screen.getByTestId('empty-state')).toHaveTextContent('Nenhuma venda registrada ainda.')
  })

  it('exibe vendas na tabela quando há dados', () => {
    const sales: SaleItem[] = [
      makeSale({ id: 'sale-1', productName: 'Produto Alpha', quantity: 3, buyerType: 'atacado' }),
    ]
    render(<SalesList sales={sales} />)
    expect(screen.getByText('Produto Alpha')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Atacado')).toBeInTheDocument()
  })

  it('filtra pelo período "7d" exibindo apenas vendas dos últimos 7 dias', () => {
    const now = new Date()

    // Venda recente (2 dias atrás) — deve aparecer em 7d
    const recentDate = new Date(now)
    recentDate.setDate(recentDate.getDate() - 2)

    // Venda antiga (15 dias atrás) — não deve aparecer em 7d
    const oldDate = new Date(now)
    oldDate.setDate(oldDate.getDate() - 15)

    const sales: SaleItem[] = [
      makeSale({ id: 'recent', productName: 'Produto Recente', createdAt: recentDate.toISOString() }),
      makeSale({ id: 'old', productName: 'Produto Antigo', createdAt: oldDate.toISOString() }),
    ]

    render(<SalesList sales={sales} />)

    // Padrão é 30d — ambos devem aparecer
    expect(screen.getByText('Produto Recente')).toBeInTheDocument()
    expect(screen.getByText('Produto Antigo')).toBeInTheDocument()

    // Clicar em "7d"
    fireEvent.click(screen.getByTestId('period-btn-7d'))

    // Apenas o produto recente deve aparecer
    expect(screen.getByText('Produto Recente')).toBeInTheDocument()
    expect(screen.queryByText('Produto Antigo')).not.toBeInTheDocument()
  })

  it('exibe estado vazio após aplicar filtro sem vendas no período', () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 20)

    const sales: SaleItem[] = [
      makeSale({ id: 'old', productName: 'Produto Antigo', createdAt: oldDate.toISOString() }),
    ]

    render(<SalesList sales={sales} />)

    // Selecionar "7d" — venda de 20 dias atrás não deve aparecer
    fireEvent.click(screen.getByTestId('period-btn-7d'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('exibe botões de período "7d", "30d" e "month"', () => {
    render(<SalesList sales={[]} />)
    expect(screen.getByTestId('period-btn-7d')).toBeInTheDocument()
    expect(screen.getByTestId('period-btn-30d')).toBeInTheDocument()
    expect(screen.getByTestId('period-btn-month')).toBeInTheDocument()
  })
})
