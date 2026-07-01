/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadVarejoModal } from '@/components/leads/LeadVarejoModal'

// Mock do componente Dialog para simplificar testes em jsdom
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open: boolean
    onOpenChange?: (open: boolean) => void
  }) => (open ? <div data-testid="dialog-root">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
}))

// Mock da Server Action
const mockSubmitLead = jest.fn()
jest.mock('@/actions/leads', () => ({
  submitLead: (...args: unknown[]) => mockSubmitLead(...args),
}))

describe('LeadVarejoModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('não renderiza quando open é false', () => {
    render(<LeadVarejoModal open={false} onClose={jest.fn()} />)
    expect(screen.queryByTestId('modal-varejo')).not.toBeInTheDocument()
  })

  it('renderiza o formulário quando open é true', () => {
    render(<LeadVarejoModal {...defaultProps} />)
    expect(screen.getByTestId('form-varejo')).toBeInTheDocument()
  })

  it('renderiza campos de nome, e-mail, telefone e mensagem', () => {
    render(<LeadVarejoModal {...defaultProps} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument()
  })

  it('exibe o nome do produto quando fornecido', () => {
    render(
      <LeadVarejoModal
        {...defaultProps}
        productName="Parafuso M8 Inox"
      />
    )
    expect(screen.getByText('Parafuso M8 Inox')).toBeInTheDocument()
  })

  it('exibe mensagem "Entraremos em contato em breve" após envio bem-sucedido', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(<LeadVarejoModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'joao@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11999999999' },
    })

    fireEvent.submit(screen.getByTestId('form-varejo'))

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Entraremos em contato em breve')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando submitLead retorna success: false', async () => {
    mockSubmitLead.mockResolvedValueOnce({
      success: false,
      error: 'E-mail inválido',
    })
    render(<LeadVarejoModal {...defaultProps} />)

    fireEvent.submit(screen.getByTestId('form-varejo'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
  })

  it('exibe mensagem de erro genérica quando submitLead lança exceção', async () => {
    mockSubmitLead.mockRejectedValueOnce(new Error('Erro de rede'))
    render(<LeadVarejoModal {...defaultProps} />)

    fireEvent.submit(screen.getByTestId('form-varejo'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Ocorreu um erro inesperado. Tente novamente.')).toBeInTheDocument()
  })

  it('desabilita o botão de envio durante o carregamento', async () => {
    let resolveSubmit: (value: { success: boolean }) => void
    mockSubmitLead.mockReturnValue(
      new Promise<{ success: boolean }>((resolve) => {
        resolveSubmit = resolve
      })
    )
    render(<LeadVarejoModal {...defaultProps} />)

    fireEvent.submit(screen.getByTestId('form-varejo'))

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled()
    })
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Enviando...')

    resolveSubmit!({ success: true })
  })

  it('chama submitLead com type "varejo" e productId quando fornecido', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(
      <LeadVarejoModal
        {...defaultProps}
        productId="prod-123"
        productName="Produto Teste"
      />
    )

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Maria Lima' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'maria@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11988887777' },
    })

    fireEvent.submit(screen.getByTestId('form-varejo'))

    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'varejo',
          productId: 'prod-123',
        })
      )
    })
  })
})
