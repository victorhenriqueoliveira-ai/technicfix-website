/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadAtacadoModal } from '@/components/leads/LeadAtacadoModal'

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

describe('LeadAtacadoModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('não renderiza quando open é false', () => {
    render(<LeadAtacadoModal open={false} onClose={jest.fn()} />)
    expect(screen.queryByTestId('modal-atacado')).not.toBeInTheDocument()
  })

  it('renderiza o formulário quando open é true', () => {
    render(<LeadAtacadoModal {...defaultProps} />)
    expect(screen.getByTestId('form-atacado')).toBeInTheDocument()
  })

  it('renderiza campos de CNPJ com input controlado', () => {
    render(<LeadAtacadoModal {...defaultProps} />)
    const cnpjInput = screen.getByTestId('cnpj-input')
    expect(cnpjInput).toBeInTheDocument()
  })

  it('aplica máscara de CNPJ ao digitar', () => {
    render(<LeadAtacadoModal {...defaultProps} />)
    const cnpjInput = screen.getByTestId('cnpj-input')

    fireEvent.change(cnpjInput, { target: { value: '11222333000181' } })
    expect((cnpjInput as HTMLInputElement).value).toBe('11.222.333/0001-81')
  })

  it('renderiza todos os campos obrigatórios e opcionais', () => {
    render(<LeadAtacadoModal {...defaultProps} />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/volume estimado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prazo desejado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument()
  })

  it('exibe mensagem de sucesso após envio bem-sucedido', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(<LeadAtacadoModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Carlos Oliveira' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'carlos@empresa.com' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11966554433' },
    })
    fireEvent.change(screen.getByLabelText(/razão social/i), {
      target: { value: 'Empresa LTDA' },
    })
    fireEvent.change(screen.getByTestId('cnpj-input'), {
      target: { value: '11222333000181' },
    })

    fireEvent.submit(screen.getByTestId('form-atacado'))

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Orçamento solicitado com sucesso!')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando submitLead retorna success: false', async () => {
    mockSubmitLead.mockResolvedValueOnce({
      success: false,
      error: 'CNPJ deve ter 14 dígitos',
    })
    render(<LeadAtacadoModal {...defaultProps} />)

    fireEvent.submit(screen.getByTestId('form-atacado'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('CNPJ deve ter 14 dígitos')).toBeInTheDocument()
  })

  it('desabilita o botão durante o carregamento', async () => {
    let resolveSubmit: (value: { success: boolean }) => void
    mockSubmitLead.mockReturnValue(
      new Promise<{ success: boolean }>((resolve) => {
        resolveSubmit = resolve
      })
    )
    render(<LeadAtacadoModal {...defaultProps} />)

    fireEvent.submit(screen.getByTestId('form-atacado'))

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled()
    })
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Enviando...')

    resolveSubmit!({ success: true })
  })

  it('chama submitLead com type "atacado" e o CNPJ com máscara', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(<LeadAtacadoModal {...defaultProps} productId="prod-456" />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Pedro Santos' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'pedro@empresa.com' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11955554444' },
    })
    fireEvent.change(screen.getByLabelText(/razão social/i), {
      target: { value: 'Santos LTDA' },
    })
    fireEvent.change(screen.getByTestId('cnpj-input'), {
      target: { value: '11222333000181' },
    })

    fireEvent.submit(screen.getByTestId('form-atacado'))

    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'atacado',
          productId: 'prod-456',
          cnpj: '11.222.333/0001-81',
        })
      )
    })
  })

  it('exibe o nome do produto quando fornecido', () => {
    render(
      <LeadAtacadoModal
        {...defaultProps}
        productName="Calha Industrial 200mm"
      />
    )
    expect(screen.getByText('Calha Industrial 200mm')).toBeInTheDocument()
  })
})
