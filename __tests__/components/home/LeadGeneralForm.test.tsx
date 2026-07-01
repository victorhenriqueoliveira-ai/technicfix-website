/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadGeneralForm } from '@/components/home/LeadGeneralForm'

// Mock da Server Action
const mockSubmitLead = jest.fn()
jest.mock('@/actions/leads', () => ({
  submitLead: (...args: unknown[]) => mockSubmitLead(...args),
}))

describe('LeadGeneralForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o formulário com todos os campos', () => {
    render(<LeadGeneralForm />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument()
  })

  it('renderiza o botão de envio', () => {
    render(<LeadGeneralForm />)
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Enviar Mensagem')
  })

  it('exibe mensagem de sucesso após envio bem-sucedido', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(<LeadGeneralForm />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11999999999' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'joao@example.com' },
    })

    fireEvent.submit(screen.getByTestId('lead-form'))

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Mensagem enviada com sucesso!')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando o envio falha com result.success false', async () => {
    mockSubmitLead.mockResolvedValueOnce({
      success: false,
      error: 'Erro ao processar o formulário.',
    })
    render(<LeadGeneralForm />)

    fireEvent.submit(screen.getByTestId('lead-form'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Erro ao processar o formulário.')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a action lança exceção', async () => {
    mockSubmitLead.mockRejectedValueOnce(new Error('Erro de rede'))
    render(<LeadGeneralForm />)

    fireEvent.submit(screen.getByTestId('lead-form'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('Ocorreu um erro inesperado. Tente novamente.')).toBeInTheDocument()
  })

  it('desabilita o botão durante o envio', async () => {
    // Mantém a promise pendente para simular loading
    let resolveSubmit: (value: { success: boolean }) => void
    mockSubmitLead.mockReturnValue(
      new Promise<{ success: boolean }>((resolve) => {
        resolveSubmit = resolve
      })
    )
    render(<LeadGeneralForm />)

    fireEvent.submit(screen.getByTestId('lead-form'))

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled()
    })
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Enviando...')

    // Resolve para limpar
    resolveSubmit!({ success: true })
  })

  it('chama submitLead com type "geral"', async () => {
    mockSubmitLead.mockResolvedValueOnce({ success: true })
    render(<LeadGeneralForm />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Maria' },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '11988888888' },
    })
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'maria@example.com' },
    })

    fireEvent.submit(screen.getByTestId('lead-form'))

    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'geral' })
      )
    })
  })
})
