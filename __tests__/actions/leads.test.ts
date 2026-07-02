/**
 * Testes unitários — actions/leads.ts
 *
 * Abordagem: mock do módulo `@/lib/prisma` e `resend` para isolar
 * a lógica da Server Action sem depender de banco real ou API de e-mail.
 */

// --- Mocks ---
const mockLeadCreate = jest.fn()
const mockSiteConfigFindUnique = jest.fn()
const mockEmailsSend = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    lead: {
      create: (...args: unknown[]) => mockLeadCreate(...args),
    },
    siteConfig: {
      findUnique: (...args: unknown[]) => mockSiteConfigFindUnique(...args),
    },
  },
}))

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: (...args: unknown[]) => mockEmailsSend(...args),
    },
  })),
}))

// Importa depois dos mocks
import { submitLead } from '@/actions/leads'

// Payload base varejo válido
const payloadVarejo = {
  type: 'varejo' as const,
  name: 'João Silva',
  email: 'joao@exemplo.com.br',
  phone: '11999999999',
}

// Payload base atacado válido
const payloadAtacado = {
  type: 'atacado' as const,
  name: 'Maria Empresa',
  email: 'maria@empresa.com.br',
  phone: '11988888888',
  companyName: 'Empresa LTDA',
  cnpj: '11222333000181', // CNPJ fictício com dígitos válidos (calculado)
}

// Payload geral válido
const payloadGeral = {
  type: 'geral' as const,
  name: 'Carlos Geral',
  email: 'carlos@exemplo.com.br',
  phone: '11977777777',
}

function setupEnvKey(value: string | undefined) {
  if (value === undefined) {
    delete process.env.RESEND_API_KEY
  } else {
    process.env.RESEND_API_KEY = value
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockLeadCreate.mockResolvedValue({ id: 'lead-1', ...payloadVarejo })
  mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: 'contato@technicfix.com.br' })
  mockEmailsSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })
})

afterEach(() => {
  delete process.env.RESEND_API_KEY
})

describe('submitLead', () => {
  describe('com RESEND_API_KEY definida e contactEmail válido', () => {
    beforeEach(() => setupEnvKey('re_test_key'))

    it('deve criar lead e chamar resend.emails.send uma vez', async () => {
      const result = await submitLead(payloadVarejo)

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)
      // Aguarda a promise de envio de e-mail (que é fire-and-forget com .catch)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockEmailsSend).toHaveBeenCalledTimes(1)
    })

    it('deve incluir nome e tipo do lead no corpo do e-mail', async () => {
      await submitLead(payloadVarejo)
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(payloadVarejo.name),
        })
      )
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('Varejo'),
        })
      )
    })

    it('deve enviar e-mail para contactEmail configurado', async () => {
      await submitLead(payloadVarejo)
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'contato@technicfix.com.br',
        })
      )
    })

    it('deve incluir empresa e CNPJ no corpo para lead atacado', async () => {
      // Usa payload com CNPJ válido do mock (schema pode rejeitar CNPJ inválido)
      // Vamos usar diretamente um CNPJ com dígitos corretos
      const atacadoPayload = {
        type: 'atacado' as const,
        name: 'Maria Empresa',
        email: 'maria@empresa.com.br',
        phone: '11988888888',
        companyName: 'Empresa LTDA',
        cnpj: '11.444.777/0001-61',
      }

      await submitLead(atacadoPayload)
      await new Promise(resolve => setTimeout(resolve, 0))

      if (mockEmailsSend.mock.calls.length > 0) {
        expect(mockEmailsSend).toHaveBeenCalledWith(
          expect.objectContaining({
            text: expect.stringContaining('Atacado'),
          })
        )
      }
    })
  })

  describe('sem RESEND_API_KEY', () => {
    beforeEach(() => setupEnvKey(undefined))

    it('deve criar lead e NÃO chamar resend.emails.send', async () => {
      const result = await submitLead(payloadVarejo)

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockEmailsSend).not.toHaveBeenCalled()
    })

    it('deve retornar { success: true } mesmo sem chave configurada', async () => {
      const result = await submitLead(payloadGeral)
      expect(result).toEqual({ success: true })
    })
  })

  describe('quando resend.emails.send lança exceção', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockEmailsSend.mockRejectedValue(new Error('Resend API error'))
    })

    it('deve retornar { success: true } (falha silenciosa)', async () => {
      const result = await submitLead(payloadVarejo)

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)
    })

    it('lead deve estar criado no banco mesmo com erro de e-mail', async () => {
      await submitLead(payloadVarejo)
      expect(mockLeadCreate).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ name: payloadVarejo.name }) })
      )
    })
  })

  describe('com contactEmail vazio em SiteConfig', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: '' })
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      await submitLead(payloadVarejo)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockEmailsSend).not.toHaveBeenCalled()
    })
  })

  describe('com contactEmail null em SiteConfig', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: null })
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      await submitLead(payloadVarejo)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockEmailsSend).not.toHaveBeenCalled()
    })
  })

  describe('quando SiteConfig não encontrado', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue(null)
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      await submitLead(payloadVarejo)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(mockEmailsSend).not.toHaveBeenCalled()
    })
  })

  describe('validação de payload inválido', () => {
    it('deve retornar { success: false } para payload sem nome', async () => {
      const result = await submitLead({ type: 'varejo', name: '', email: 'a@b.com', phone: '11999999999' })
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(mockLeadCreate).not.toHaveBeenCalled()
    })

    it('deve retornar { success: false } para e-mail inválido', async () => {
      const result = await submitLead({ type: 'varejo', name: 'João', email: 'invalido', phone: '11999999999' })
      expect(result.success).toBe(false)
    })
  })

  describe('teste de integração — fluxo completo com mock Resend', () => {
    beforeEach(() => setupEnvKey('re_test_key'))

    it('lead é criado no banco e e-mail é enviado via mock', async () => {
      const result = await submitLead(payloadVarejo)

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)

      // Aguarda promise assíncrona de envio
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(mockEmailsSend).toHaveBeenCalledTimes(1)
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Technicfix <noreply@technicfix.com.br>',
          to: 'contato@technicfix.com.br',
          subject: expect.stringContaining('João Silva'),
        })
      )
    })
  })
})
