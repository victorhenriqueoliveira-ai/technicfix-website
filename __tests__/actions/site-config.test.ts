/**
 * Testes unitários e de integração para actions/site-config.ts
 */

import { configSchema } from '@/lib/schemas/site-config'

// ────────────────────────────────────────────────────────────
// Testes unitários — schema Zod
// ────────────────────────────────────────────────────────────

describe('configSchema — validação do número de WhatsApp', () => {
  const base = {
    storeName: 'Technicfix',
    contactEmail: 'contato@technicfix.com',
    technocalhasUrl: '',
    technocalhasDescription: 'Descrição de teste',
  }

  it('aceita número de WhatsApp com 10 dígitos', () => {
    const result = configSchema.safeParse({ ...base, whatsappNumber: '1134567890' })
    expect(result.success).toBe(true)
  })

  it('aceita número de WhatsApp com 11 dígitos', () => {
    const result = configSchema.safeParse({ ...base, whatsappNumber: '11934567890' })
    expect(result.success).toBe(true)
  })

  it('rejeita número de WhatsApp com 9 dígitos', () => {
    const result = configSchema.safeParse({ ...base, whatsappNumber: '119345678' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/10 ou 11 dígitos/i)
  })

  it('rejeita número de WhatsApp com caracteres não numéricos', () => {
    const result = configSchema.safeParse({ ...base, whatsappNumber: '(11)98765-4321' })
    expect(result.success).toBe(false)
  })

  it('rejeita número de WhatsApp com 12 dígitos', () => {
    const result = configSchema.safeParse({ ...base, whatsappNumber: '551198765432' })
    expect(result.success).toBe(false)
  })
})

// ────────────────────────────────────────────────────────────
// Testes de integração — updateSiteConfig
// ────────────────────────────────────────────────────────────

const mockUpsert = jest.fn()
const mockFindFirst = jest.fn()
const mockRevalidatePath = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    siteConfig: {
      upsert: (...args: unknown[]) => mockUpsert(...args),
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

describe('updateSiteConfig — integração', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          upsert: (...args: unknown[]) => mockUpsert(...args),
          findFirst: (...args: unknown[]) => mockFindFirst(...args),
        },
      },
    }))

    jest.mock('next/cache', () => ({
      revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
    }))
  })

  function makeFormData(overrides: Record<string, string> = {}): FormData {
    const fd = new FormData()
    fd.set('storeName', overrides.storeName ?? 'Technicfix')
    fd.set('whatsappNumber', overrides.whatsappNumber ?? '11987654321')
    fd.set('contactEmail', overrides.contactEmail ?? 'contato@technicfix.com')
    fd.set('technocalhasUrl', overrides.technocalhasUrl ?? '')
    fd.set('technocalhasDescription', overrides.technocalhasDescription ?? 'Descrição padrão')
    return fd
  }

  it('salva no banco com upsert usando id singleton', async () => {
    mockUpsert.mockResolvedValue({
      id: 'singleton',
      storeName: 'Technicfix',
      whatsappNumber: '11987654321',
      contactEmail: 'contato@technicfix.com',
      technocalhasUrl: '',
      technocalhasDescription: 'Descrição padrão',
      updatedAt: new Date(),
    })

    const { updateSiteConfig } = await import('@/actions/site-config')
    const result = await updateSiteConfig(makeFormData())

    expect(result.success).toBe(true)
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'singleton' },
        create: expect.objectContaining({ id: 'singleton', whatsappNumber: '11987654321' }),
        update: expect.objectContaining({ whatsappNumber: '11987654321' }),
      })
    )
  })

  it('cria o registro singleton quando não existia', async () => {
    mockUpsert.mockResolvedValue({ id: 'singleton', whatsappNumber: '1134567890' })

    const { updateSiteConfig } = await import('@/actions/site-config')
    const result = await updateSiteConfig(makeFormData({ whatsappNumber: '1134567890' }))

    expect(result.success).toBe(true)
    expect(mockUpsert).toHaveBeenCalledTimes(1)
  })

  it('atualiza sem duplicar quando singleton já existe', async () => {
    mockUpsert.mockResolvedValue({ id: 'singleton', whatsappNumber: '11999999999' })

    const { updateSiteConfig } = await import('@/actions/site-config')
    await updateSiteConfig(makeFormData({ whatsappNumber: '11999999999' }))
    await updateSiteConfig(makeFormData({ whatsappNumber: '11999999999' }))

    expect(mockUpsert).toHaveBeenCalledTimes(2)
    // Ambas chamadas usam where: { id: 'singleton' }
    expect(mockUpsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { id: 'singleton' } })
    )
    expect(mockUpsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { id: 'singleton' } })
    )
  })

  it('retorna erro quando whatsappNumber é inválido', async () => {
    const { updateSiteConfig } = await import('@/actions/site-config')
    const result = await updateSiteConfig(makeFormData({ whatsappNumber: '12345' }))

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/10 ou 11 dígitos/i)
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it('chama revalidatePath para /, /technocalhas e /admin/configuracoes após salvar', async () => {
    mockUpsert.mockResolvedValue({ id: 'singleton' })

    const { updateSiteConfig } = await import('@/actions/site-config')
    await updateSiteConfig(makeFormData())

    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/technocalhas')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/configuracoes')
  })
})
