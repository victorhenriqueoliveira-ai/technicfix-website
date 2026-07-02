/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LeadFormInline } from '@/components/catalog/LeadFormInline'

// Mock da Server Action submitLead
const mockSubmitLead = jest.fn()
jest.mock('@/actions/leads', () => ({
  submitLead: (...args: unknown[]) => mockSubmitLead(...args),
}))

// Mock do useTransition para controlar o isPending
jest.mock('react', () => {
  const actual = jest.requireActual('react') as typeof import('react')
  return {
    ...actual,
    useTransition: () => [false, (fn: () => void) => fn()],
  }
})

beforeEach(() => {
  mockSubmitLead.mockReset()
})

describe('LeadFormInline', () => {
  describe('estado colapsado inicial', () => {
    it('começa colapsado — formulário não visível', () => {
      render(<LeadFormInline />)
      expect(screen.queryByTestId('lead-form')).not.toBeInTheDocument()
    })

    it('exibe trigger com texto "Prefere preencher um formulário?"', () => {
      render(<LeadFormInline />)
      expect(screen.getByTestId('lead-form-trigger')).toBeInTheDocument()
      expect(screen.getByTestId('lead-form-trigger')).toHaveTextContent('Prefere preencher um formulário?')
    })

    it('expande ao clicar no trigger', () => {
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
      expect(screen.getByTestId('lead-form')).toBeInTheDocument()
    })

    it('aria-expanded é false quando colapsado', () => {
      render(<LeadFormInline />)
      expect(screen.getByTestId('lead-form-trigger')).toHaveAttribute('aria-expanded', 'false')
    })

    it('aria-expanded é true quando expandido', () => {
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
      expect(screen.getByTestId('lead-form-trigger')).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('campos básicos', () => {
    beforeEach(() => {
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
    })

    it('renderiza campos nome, email, telefone e mensagem', () => {
      expect(screen.getByTestId('lead-input-nome')).toBeInTheDocument()
      expect(screen.getByTestId('lead-input-email')).toBeInTheDocument()
      expect(screen.getByTestId('lead-input-telefone')).toBeInTheDocument()
      expect(screen.getByTestId('lead-input-mensagem')).toBeInTheDocument()
    })
  })

  describe('campos progressivos atacado', () => {
    beforeEach(() => {
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
    })

    it('campos de atacado não aparecem por padrão (tipo varejo)', () => {
      expect(screen.queryByTestId('campos-atacado')).not.toBeInTheDocument()
    })

    it('campos de atacado aparecem ao selecionar tipo atacado', () => {
      fireEvent.click(screen.getByTestId('form-tipo-atacado'))
      expect(screen.getByTestId('campos-atacado')).toBeInTheDocument()
      expect(screen.getByTestId('lead-input-empresa')).toBeInTheDocument()
      expect(screen.getByTestId('lead-input-cnpj')).toBeInTheDocument()
    })

    it('campos de atacado desaparecem ao voltar para varejo', () => {
      fireEvent.click(screen.getByTestId('form-tipo-atacado'))
      fireEvent.click(screen.getByTestId('form-tipo-varejo'))
      expect(screen.queryByTestId('campos-atacado')).not.toBeInTheDocument()
    })
  })

  describe('submit com sucesso', () => {
    beforeEach(() => {
      mockSubmitLead.mockResolvedValue({ success: true })
      render(<LeadFormInline productId="prod-1" />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
    })

    it('exibe mensagem de sucesso após envio bem-sucedido', async () => {
      fireEvent.change(screen.getByTestId('lead-input-nome'), { target: { value: 'João Silva' } })
      fireEvent.change(screen.getByTestId('lead-input-email'), { target: { value: 'joao@email.com' } })
      fireEvent.change(screen.getByTestId('lead-input-telefone'), { target: { value: '11988887777' } })
      fireEvent.submit(screen.getByTestId('lead-form'))

      await waitFor(() => {
        expect(screen.getByTestId('lead-form-success')).toBeInTheDocument()
      })
      expect(screen.queryByTestId('lead-form')).not.toBeInTheDocument()
    })

    it('chama submitLead com payload correto de varejo', async () => {
      fireEvent.change(screen.getByTestId('lead-input-nome'), { target: { value: 'Maria Santos' } })
      fireEvent.change(screen.getByTestId('lead-input-email'), { target: { value: 'maria@email.com' } })
      fireEvent.change(screen.getByTestId('lead-input-telefone'), { target: { value: '11977776666' } })
      fireEvent.submit(screen.getByTestId('lead-form'))

      await waitFor(() => {
        expect(mockSubmitLead).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'varejo',
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '11977776666',
            productId: 'prod-1',
          })
        )
      })
    })
  })

  describe('submit com erro da Server Action', () => {
    beforeEach(() => {
      mockSubmitLead.mockResolvedValue({ success: false, error: 'Erro interno do servidor' })
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
    })

    it('exibe mensagem de erro sem recarregar a página', async () => {
      fireEvent.change(screen.getByTestId('lead-input-nome'), { target: { value: 'Pedro Lima' } })
      fireEvent.change(screen.getByTestId('lead-input-email'), { target: { value: 'pedro@email.com' } })
      fireEvent.change(screen.getByTestId('lead-input-telefone'), { target: { value: '11966665555' } })
      fireEvent.submit(screen.getByTestId('lead-form'))

      await waitFor(() => {
        expect(screen.getByTestId('lead-form-error')).toBeInTheDocument()
      })
      expect(screen.getByTestId('lead-form-error')).toHaveTextContent('Erro interno do servidor')
      // Formulário ainda visível para nova tentativa
      expect(screen.getByTestId('lead-form')).toBeInTheDocument()
    })
  })

  describe('validação client-side', () => {
    beforeEach(() => {
      render(<LeadFormInline />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
    })

    it('não chama submitLead quando campos obrigatórios estão vazios', async () => {
      fireEvent.submit(screen.getByTestId('lead-form'))
      await waitFor(() => {
        expect(mockSubmitLead).not.toHaveBeenCalled()
      })
    })

    it('exibe erro de validação para e-mail inválido', async () => {
      fireEvent.change(screen.getByTestId('lead-input-nome'), { target: { value: 'Ana Costa' } })
      fireEvent.change(screen.getByTestId('lead-input-email'), { target: { value: 'invalido' } })
      fireEvent.change(screen.getByTestId('lead-input-telefone'), { target: { value: '11955554444' } })
      fireEvent.submit(screen.getByTestId('lead-form'))

      await waitFor(() => {
        expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
      })
    })
  })

  describe('defaultType prop', () => {
    it('inicia com tipo atacado quando defaultType="atacado"', () => {
      render(<LeadFormInline defaultType="atacado" />)
      fireEvent.click(screen.getByTestId('lead-form-trigger'))
      expect(screen.getByTestId('campos-atacado')).toBeInTheDocument()
    })
  })
})
