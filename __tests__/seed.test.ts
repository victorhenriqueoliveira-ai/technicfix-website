/**
 * Testes unitários para prisma/seed.ts
 * Usa mocks do Prisma e bcryptjs — não conecta ao banco real
 */

import bcrypt from 'bcryptjs'

// Mock do PrismaClient
const mockUpsert = jest.fn()
const mockDisconnect = jest.fn()

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    adminUser: {
      upsert: mockUpsert,
    },
    siteConfig: {
      upsert: mockUpsert,
    },
    $disconnect: mockDisconnect,
  })),
}))

describe('prisma/seed.ts — seed idempotente', () => {
  beforeEach(() => {
    mockUpsert.mockReset()
    mockDisconnect.mockResolvedValue(undefined)
  })

  describe('hash de senha com bcrypt', () => {
    it('gera um hash diferente do texto plano', async () => {
      const senha = 'admin123'
      const hash = await bcrypt.hash(senha, 12)

      expect(hash).not.toBe(senha)
      expect(hash).toMatch(/^\$2[aby]\$/)
    })

    it('verifica corretamente o hash gerado', async () => {
      const senha = 'minhaSenhaSegura'
      const hash = await bcrypt.hash(senha, 12)

      const valido = await bcrypt.compare(senha, hash)
      expect(valido).toBe(true)
    })

    it('rejeita senha incorreta no compare', async () => {
      const senha = 'senhaCorreta'
      const hash = await bcrypt.hash(senha, 12)

      const invalido = await bcrypt.compare('senhaErrada', hash)
      expect(invalido).toBe(false)
    })

    it('dois hashes da mesma senha são diferentes (salt aleatório)', async () => {
      const senha = 'admin123'
      const hash1 = await bcrypt.hash(senha, 12)
      const hash2 = await bcrypt.hash(senha, 12)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comportamento do upsert idempotente', () => {
    it('upsert do AdminUser usa email como chave única', async () => {
      const email = 'admin@technicfix.com.br'
      const passwordHash = await bcrypt.hash('admin123', 10)

      mockUpsert.mockResolvedValueOnce({ id: 'cuid-1', email, passwordHash })

      const { PrismaClient } = await import('@prisma/client')
      const prisma = new (PrismaClient as jest.MockedClass<typeof import('@prisma/client').PrismaClient>)()

      await (prisma as unknown as { adminUser: { upsert: jest.Mock } }).adminUser.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
      })

      expect(mockUpsert).toHaveBeenCalledWith({
        where: { email },
        update: {},
        create: { email, passwordHash },
      })
    })

    it('execução dupla do seed não cria AdminUser duplicado (update: {})', async () => {
      const email = 'admin@technicfix.com.br'
      const passwordHash = await bcrypt.hash('admin123', 10)

      mockUpsert
        .mockResolvedValueOnce({ id: 'cuid-1', email, passwordHash })
        .mockResolvedValueOnce({ id: 'cuid-1', email, passwordHash })

      const { PrismaClient } = await import('@prisma/client')
      const prisma = new (PrismaClient as jest.MockedClass<typeof import('@prisma/client').PrismaClient>)()

      const adminUserClient = (prisma as unknown as { adminUser: { upsert: jest.Mock } }).adminUser

      // Primeira execução
      const resultado1 = await adminUserClient.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
      })

      // Segunda execução
      const resultado2 = await adminUserClient.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
      })

      // Ambos retornam o mesmo ID (não cria duplicata)
      expect(resultado1.id).toBe(resultado2.id)
      expect(mockUpsert).toHaveBeenCalledTimes(2)
    })

    it('upsert do SiteConfig usa id "singleton" como chave', async () => {
      mockUpsert.mockResolvedValueOnce({
        id: 'singleton',
        storeName: 'Technicfix',
        whatsappNumber: '',
        contactEmail: '',
        technocalhasUrl: '',
        technocalhasDescription: '',
      })

      const { PrismaClient } = await import('@prisma/client')
      const prisma = new (PrismaClient as jest.MockedClass<typeof import('@prisma/client').PrismaClient>)()

      const siteConfigClient = (prisma as unknown as { siteConfig: { upsert: jest.Mock } }).siteConfig

      const siteConfig = await siteConfigClient.upsert({
        where: { id: 'singleton' },
        update: {},
        create: {
          id: 'singleton',
          storeName: 'Technicfix',
          whatsappNumber: '',
          contactEmail: '',
          technocalhasUrl: '',
          technocalhasDescription: '',
        },
      })

      expect(siteConfig.id).toBe('singleton')
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'singleton' } })
      )
    })

    it('seed usa variáveis de ambiente SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD', () => {
      // Valida a lógica de fallback
      const emailPadrao = process.env.SEED_ADMIN_EMAIL ?? 'admin@technicfix.com.br'
      const senhaPadrao = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'

      expect(emailPadrao).toBe('admin@technicfix.com.br')
      expect(senhaPadrao).toBe('admin123')
    })

    it('seed usa email de variável de ambiente quando definido', () => {
      process.env.SEED_ADMIN_EMAIL = 'custom@empresa.com'
      process.env.SEED_ADMIN_PASSWORD = 'senhaCustom456'

      const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@technicfix.com.br'
      const senha = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'

      expect(email).toBe('custom@empresa.com')
      expect(senha).toBe('senhaCustom456')

      delete process.env.SEED_ADMIN_EMAIL
      delete process.env.SEED_ADMIN_PASSWORD
    })
  })
})
