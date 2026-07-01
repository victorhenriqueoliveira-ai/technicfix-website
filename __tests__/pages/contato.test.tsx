/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock da server action submitLead
const mockSubmitLead = jest.fn()
jest.mock('@/actions/leads', () => ({
  submitLead: (...args: unknown[]) => mockSubmitLead(...args),
}))

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

import ContatoPage from '@/app/(public)/contato/page'

describe('ContatoPage', () => {
  beforeEach(() => {
    mockSubmitLead.mockReset()
  })

  it('renderiza o formulário de contato', () => {
    render(<ContatoPage />)
    expect(document.querySelector('form')).toBeTruthy()
  })

  it('exibe campos de nome, email, telefone e mensagem', () => {
    render(<ContatoPage />)
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mensagem/i)).toBeInTheDocument()
  })

  it('exibe endereço e email de contato', () => {
    render(<ContatoPage />)
    expect(screen.getByText(/São Paulo/i)).toBeInTheDocument()
    expect(screen.getByText(/contato@technicfix\.com\.br/i)).toBeInTheDocument()
  })

  it('exibe o iframe do Google Maps', () => {
    render(<ContatoPage />)
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.src).toContain('maps.google.com')
  })

  it('exibe breadcrumb com Início > Contato', () => {
    render(<ContatoPage />)
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  it('chama submitLead com type geral ao submeter o formulário', async () => {
    mockSubmitLead.mockResolvedValue({ success: true })

    render(<ContatoPage />)

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João Silva' } })
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'joao@email.com' } })
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999990000' } })

    const form = document.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'geral',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999990000',
        })
      )
    })
  })

  it('exibe mensagem de sucesso após envio bem-sucedido', async () => {
    mockSubmitLead.mockResolvedValue({ success: true })

    render(<ContatoPage />)

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'ana@email.com' } })
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11988887777' } })

    const form = document.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Mensagem enviada com sucesso/i)
    })
  })

  it('exibe mensagem de erro quando submitLead retorna success: false', async () => {
    mockSubmitLead.mockResolvedValue({ success: false, error: 'Erro no servidor' })

    render(<ContatoPage />)

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'carlos@email.com' } })
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11977776666' } })

    const form = document.querySelector('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Erro no servidor/i)
    })
  })
})
