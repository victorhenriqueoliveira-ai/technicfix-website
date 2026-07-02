/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
const mockRouterRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRouterRefresh }),
}))

// Mock registerSale action
const mockRegisterSale = jest.fn()
jest.mock('@/actions/sales', () => ({
  registerSale: (...args: unknown[]) => mockRegisterSale(...args),
}))

// Mock Sheet components — renderiza conteúdo diretamente quando open=true
jest.mock('@/components/ui/sheet', () => {
  const Sheet = ({
    children,
    open,
  }: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (v: boolean) => void
  }) => (open ? <div data-testid="sheet-mock">{children}</div> : null)

  const SheetContent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content-mock">{children}</div>
  )
  const SheetHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  const SheetTitle = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>
  const SheetFooter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

  return { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter }
})

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    [key: string]: unknown
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

import { RegisterSaleDrawer, ActiveProduct } from '@/components/admin/RegisterSaleDrawer'

const mockProducts: ActiveProduct[] = [
  { id: 'prod-1', name: 'Produto Alpha', stock: 10 },
  { id: 'prod-2', name: 'Produto Beta', stock: 5 },
]

async function openDrawer() {
  fireEvent.click(screen.getByTestId('open-drawer-btn'))
}

async function selectProduct(productName: string) {
  const searchInput = screen.getByTestId('product-search')
  fireEvent.change(searchInput, { target: { value: productName } })
  const option = await screen.findByText(new RegExp(productName))
  fireEvent.click(option.closest('button')!)
}

describe('RegisterSaleDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fecha o drawer após registro bem-sucedido', async () => {
    mockRegisterSale.mockResolvedValueOnce({ success: true, newStock: 8 })

    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    expect(screen.getByTestId('sheet-mock')).toBeInTheDocument()

    // Selecionar produto
    const searchInput = screen.getByTestId('product-search')
    fireEvent.change(searchInput, { target: { value: 'Alpha' } })

    const option = screen.getByText(/Produto Alpha/)
    fireEvent.click(option.closest('button')!)

    // Definir quantidade
    const quantityInput = screen.getByTestId('quantity-input')
    fireEvent.change(quantityInput, { target: { value: '2' } })

    // Confirmar
    await act(async () => {
      fireEvent.click(screen.getByTestId('confirm-btn'))
    })

    await waitFor(() => {
      expect(mockRegisterSale).toHaveBeenCalledWith({
        productId: 'prod-1',
        quantity: 2,
        buyerType: 'varejo',
        notes: undefined,
      })
    })

    // Drawer deve fechar após sucesso
    await waitFor(() => {
      expect(screen.queryByTestId('sheet-mock')).not.toBeInTheDocument()
    })

    // router.refresh deve ser chamado
    expect(mockRouterRefresh).toHaveBeenCalled()
  })

  it('exibe "Estoque insuficiente" quando registerSale retorna { success: false } e mantém drawer aberto', async () => {
    mockRegisterSale.mockResolvedValueOnce({
      success: false,
      error: 'Estoque insuficiente',
    })

    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    // Selecionar produto
    const searchInput = screen.getByTestId('product-search')
    fireEvent.change(searchInput, { target: { value: 'Beta' } })

    const option = screen.getByText(/Produto Beta/)
    fireEvent.click(option.closest('button')!)

    // Quantidade
    const quantityInput = screen.getByTestId('quantity-input')
    fireEvent.change(quantityInput, { target: { value: '99' } })

    // Confirmar
    await act(async () => {
      fireEvent.click(screen.getByTestId('confirm-btn'))
    })

    // Mensagem de erro deve aparecer
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Estoque insuficiente')
    })

    // Drawer deve permanecer aberto
    expect(screen.getByTestId('sheet-mock')).toBeInTheDocument()
    expect(mockRouterRefresh).not.toHaveBeenCalled()
  })

  it('botão de confirmação deve estar desabilitado quando quantidade é 0', async () => {
    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    // Selecionar produto
    const searchInput = screen.getByTestId('product-search')
    fireEvent.change(searchInput, { target: { value: 'Alpha' } })
    const option = screen.getByText(/Produto Alpha/)
    fireEvent.click(option.closest('button')!)

    // Definir quantidade como 0
    const quantityInput = screen.getByTestId('quantity-input')
    fireEvent.change(quantityInput, { target: { value: '0' } })

    const confirmBtn = screen.getByTestId('confirm-btn')
    expect(confirmBtn).toBeDisabled()
  })

  it('botão de confirmação deve estar desabilitado quando nenhum produto está selecionado', async () => {
    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    const confirmBtn = screen.getByTestId('confirm-btn')
    expect(confirmBtn).toBeDisabled()
  })

  it('filtra produtos pelo texto de busca', async () => {
    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    const searchInput = screen.getByTestId('product-search')
    fireEvent.change(searchInput, { target: { value: 'Alpha' } })

    expect(screen.getByText(/Produto Alpha/)).toBeInTheDocument()
    expect(screen.queryByText(/Produto Beta/)).not.toBeInTheDocument()
  })

  it('exibe mensagem quando nenhum produto é encontrado na busca', async () => {
    render(<RegisterSaleDrawer products={mockProducts} />)
    await act(async () => { openDrawer() })

    const searchInput = screen.getByTestId('product-search')
    fireEvent.change(searchInput, { target: { value: 'Inexistente' } })

    expect(screen.getByTestId('no-products')).toBeInTheDocument()
  })
})
