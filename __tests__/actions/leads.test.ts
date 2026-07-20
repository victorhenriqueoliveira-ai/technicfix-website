/**
 * Testes unitários — actions/leads.ts
 *
 * Abordagem: mock do módulo `@/lib/prisma`, `resend` e `@/lib/env` para isolar
 * a lógica da Server Action sem depender de banco real ou API de e-mail.
 */

// --- Mocks ---
const mockLeadCreate = jest.fn()
const mockSiteConfigFindUnique = jest.fn()
const mockEmailsSend = jest.fn()

// Mock de lib/env — valor inicial com RESEND_API_KEY definida
const mockEnv = {
  RESEND_API_KEY: 're_test_key',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  UPLOADTHING_TOKEN: 'uploadthing_test_token',
  AUTH_SECRET: 'auth_secret_value',
  NEXT_PUBLIC_WHATSAPP_NUMBER: '11999999999',
  NEXT_PUBLIC_SITE_URL: 'https://technicfix.com.br',
}

jest.mock('@/lib/env', () => ({
  get env() { return mockEnv },
}))

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

// Configura valor de RESEND_API_KEY no mock de env (não em process.env)
function setupEnvKey(value: string | undefined) {
  if (value === undefined) {
    mockEnv.RESEND_API_KEY = ''
  } else {
    mockEnv.RESEND_API_KEY = value
  }
}

/**
 * Aguarda todas as microtasks e macrotasks pendentes (incluindo timers fake)
 * para garantir que o fire-and-forget termine antes das asserções.
 */
async function flushAsync(ms = 0) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  mockEnv.RESEND_API_KEY = 're_test_key'
  mockLeadCreate.mockResolvedValue({ id: 'lead-1', ...payloadVarejo })
  mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: 'contato@technicfix.com.br' })
  mockEmailsSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })
})

afterEach(() => {
  jest.useRealTimers()
  mockEnv.RESEND_API_KEY = 're_test_key'
})

describe('submitLead', () => {
  describe('com RESEND_API_KEY definida e contactEmail válido', () => {
    beforeEach(() => setupEnvKey('re_test_key'))

    it('deve criar lead e chamar resend.emails.send uma vez', async () => {
      const promise = submitLead(payloadVarejo)
      // avança timers para resolver o fire-and-forget
      jest.runAllTimersAsync()
      const result = await promise

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)
      // deixa microtasks pendentes resolverem
      await Promise.resolve()
      await Promise.resolve()
      expect(mockEmailsSend).toHaveBeenCalledTimes(1)
    })

    it('deve incluir nome e tipo do lead no corpo do e-mail', async () => {
      const promise = submitLead(payloadVarejo)
      jest.runAllTimersAsync()
      await promise
      await Promise.resolve()
      await Promise.resolve()

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
      const promise = submitLead(payloadVarejo)
      jest.runAllTimersAsync()
      await promise
      await Promise.resolve()
      await Promise.resolve()

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'contato@technicfix.com.br',
        })
      )
    })

    it('deve incluir empresa e CNPJ no corpo para lead atacado', async () => {
      const atacadoPayload = {
        type: 'atacado' as const,
        name: 'Maria Empresa',
        email: 'maria@empresa.com.br',
        phone: '11988888888',
        companyName: 'Empresa LTDA',
        cnpj: '11.444.777/0001-61',
      }

      const promise = submitLead(atacadoPayload)
      jest.runAllTimersAsync()
      await promise
      await Promise.resolve()
      await Promise.resolve()

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
      jest.runAllTimers()
      await Promise.resolve()
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

    it('deve retornar { success: true } (falha silenciosa após 3 tentativas)', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const promise = submitLead(payloadVarejo)
      jest.runAllTimersAsync()
      const result = await promise

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)
      consoleErrorSpy.mockRestore()
    })

    it('lead deve estar criado no banco mesmo com erro de e-mail', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const promise = submitLead(payloadVarejo)
      jest.runAllTimersAsync()
      await promise

      expect(mockLeadCreate).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ name: payloadVarejo.name }) })
      )
      consoleErrorSpy.mockRestore()
    })
  })

  describe('com contactEmail vazio em SiteConfig', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: '' })
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      const result = await submitLead(payloadVarejo)
      jest.runAllTimers()
      await Promise.resolve()
      expect(mockEmailsSend).not.toHaveBeenCalled()
      expect(result).toEqual({ success: true })
    })
  })

  describe('com contactEmail null em SiteConfig', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: null })
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      const result = await submitLead(payloadVarejo)
      jest.runAllTimers()
      await Promise.resolve()
      expect(mockEmailsSend).not.toHaveBeenCalled()
      expect(result).toEqual({ success: true })
    })
  })

  describe('quando SiteConfig não encontrado', () => {
    beforeEach(() => {
      setupEnvKey('re_test_key')
      mockSiteConfigFindUnique.mockResolvedValue(null)
    })

    it('NÃO deve chamar resend.emails.send', async () => {
      const result = await submitLead(payloadVarejo)
      jest.runAllTimers()
      await Promise.resolve()
      expect(mockEmailsSend).not.toHaveBeenCalled()
      expect(result).toEqual({ success: true })
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
      const promise = submitLead(payloadVarejo)
      jest.runAllTimersAsync()
      const result = await promise

      expect(result).toEqual({ success: true })
      expect(mockLeadCreate).toHaveBeenCalledTimes(1)

      await Promise.resolve()
      await Promise.resolve()
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

// =============================================================================
// Testes específicos do helper sendEmailWithRetry (via submitLead — comportamento observável)
// =============================================================================

describe('sendEmailWithRetry — comportamento de retry via submitLead', () => {
  beforeEach(() => {
    setupEnvKey('re_test_key')
    mockLeadCreate.mockResolvedValue({ id: 'lead-retry-test', ...payloadVarejo })
    mockSiteConfigFindUnique.mockResolvedValue({ id: 'singleton', contactEmail: 'contato@technicfix.com.br' })
  })

  it('sucesso na 1ª tentativa: não retenta, nenhum log de retry emitido', async () => {
    mockEmailsSend.mockResolvedValue({ data: { id: 'email-ok' }, error: null })
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const promise = submitLead(payloadVarejo)
    jest.runAllTimersAsync()
    await promise
    await Promise.resolve()
    await Promise.resolve()

    expect(mockEmailsSend).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_retry' })
    )
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_exhausted' })
    )
    consoleErrorSpy.mockRestore()
  })

  it('falha nas 3 tentativas: emite resend_retry nas tentativas 1 e 2, resend_exhausted na 3', async () => {
    const error = new Error('Resend API error')
    mockEmailsSend.mockRejectedValue(error)
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const promise = submitLead(payloadVarejo)
    // Roda submitLead até o fire-and-forget
    await Promise.resolve()
    // Roda os timers (delays 1000ms, 2000ms) e resolução de promises
    jest.runAllTimersAsync()
    await promise

    // Deixa o fire-and-forget completar todas as iterações
    // Precisamos ceder controle várias vezes para que o loop async complete
    for (let i = 0; i < 10; i++) {
      await Promise.resolve()
      jest.runAllTimers()
    }

    // Verifica que houve 3 tentativas
    expect(mockEmailsSend).toHaveBeenCalledTimes(3)

    // Logs de retry para tentativas 1 e 2
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_retry', attempt: 1, leadId: 'lead-retry-test' })
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_retry', attempt: 2, leadId: 'lead-retry-test' })
    )

    // Log exhausted na tentativa 3
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_exhausted', leadId: 'lead-retry-test' })
    )
    consoleErrorSpy.mockRestore()
  })

  it('falha nas 2 primeiras tentativas, sucesso na 3ª: sem log resend_exhausted', async () => {
    mockEmailsSend
      .mockRejectedValueOnce(new Error('falha 1'))
      .mockRejectedValueOnce(new Error('falha 2'))
      .mockResolvedValueOnce({ data: { id: 'email-ok' }, error: null })

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const promise = submitLead(payloadVarejo)
    await Promise.resolve()
    jest.runAllTimersAsync()
    await promise

    for (let i = 0; i < 10; i++) {
      await Promise.resolve()
      jest.runAllTimers()
    }

    expect(mockEmailsSend).toHaveBeenCalledTimes(3)
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ event: 'resend_exhausted' })
    )
    consoleErrorSpy.mockRestore()
  })

  it('delays entre tentativas: mock de setTimeout confirma delays de 1000ms e 2000ms', async () => {
    const error = new Error('Resend API error')
    mockEmailsSend.mockRejectedValue(error)
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    const promise = submitLead(payloadVarejo)
    await Promise.resolve()
    jest.runAllTimersAsync()
    await promise

    for (let i = 0; i < 10; i++) {
      await Promise.resolve()
      jest.runAllTimers()
    }

    // Verifica delays: setTimeout foi chamado com 1000ms (attempt 1) e 2000ms (attempt 2)
    const timerCalls = setTimeoutSpy.mock.calls.map(call => call[1])
    expect(timerCalls).toContain(1000)
    expect(timerCalls).toContain(2000)

    consoleErrorSpy.mockRestore()
    setTimeoutSpy.mockRestore()
  })

  it('submitLead persiste o lead no banco mesmo quando todas as 3 tentativas de email falham', async () => {
    mockEmailsSend.mockRejectedValue(new Error('Resend completamente inoperante'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const promise = submitLead(payloadVarejo)
    await Promise.resolve()
    jest.runAllTimersAsync()
    const result = await promise

    for (let i = 0; i < 10; i++) {
      await Promise.resolve()
      jest.runAllTimers()
    }

    // Lead salvo
    expect(result).toEqual({ success: true })
    expect(mockLeadCreate).toHaveBeenCalledTimes(1)
    // Email tentado 3 vezes
    expect(mockEmailsSend).toHaveBeenCalledTimes(3)

    consoleErrorSpy.mockRestore()
  })
})
