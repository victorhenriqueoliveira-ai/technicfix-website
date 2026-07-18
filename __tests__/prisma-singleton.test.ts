/**
 * Testes unitários para lib/prisma.ts
 * Valida o comportamento de singleton do Prisma Client
 */

// Mock de lib/env para não precisar de vars de ambiente reais
jest.mock('@/lib/env', () => ({
  env: {
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    RESEND_API_KEY: 'resend_test_key',
    UPLOADTHING_TOKEN: 'uploadthing_test_token',
    AUTH_SECRET: 'auth_secret_value',
    R2_ACCOUNT_ID: 'r2_account_id',
    R2_ACCESS_KEY_ID: 'r2_access_key',
    R2_SECRET_ACCESS_KEY: 'r2_secret',
    R2_BUCKET_NAME: 'bucket-name',
    NEXT_PUBLIC_WHATSAPP_NUMBER: '11999999999',
    NEXT_PUBLIC_SITE_URL: 'https://technicfix.com.br',
  },
}))

// Mock do PrismaClient antes de importar o módulo
const mockPrismaClient = jest.fn()
jest.mock('@prisma/client', () => ({
  PrismaClient: mockPrismaClient,
}))

describe('lib/prisma.ts — singleton do Prisma Client', () => {
  const originalNodeEnv = process.env.NODE_ENV

  beforeEach(() => {
    jest.resetModules()
    // Limpa o globalThis entre testes
    const g = globalThis as unknown as { prisma?: unknown }
    delete g.prisma
    mockPrismaClient.mockClear()
    mockPrismaClient.mockImplementation(() => ({ _isMockClient: true }))
  })

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      writable: true,
    })
    const g = globalThis as unknown as { prisma?: unknown }
    delete g.prisma
  })

  it('cria uma instância do PrismaClient', () => {
    require('@/lib/prisma')
    expect(mockPrismaClient).toHaveBeenCalledTimes(1)
  })

  it('reutiliza a instância do globalThis em ambiente de desenvolvimento', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
    })

    const { db: db1 } = require('@/lib/prisma')

    // Simula segunda importação limpando o módulo mas mantendo globalThis
    jest.resetModules()

    const { db: db2 } = require('@/lib/prisma')

    // A segunda importação deve reutilizar a instância do globalThis
    // PrismaClient só deve ser chamado uma vez (a segunda importação usa globalThis.prisma)
    expect(db1).toBe(db2)
  })

  it('exporta a instância como "db"', () => {
    const mod = require('@/lib/prisma')
    expect(mod.db).toBeDefined()
  })

  it('configura log com query/error/warn em desenvolvimento', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
    })

    require('@/lib/prisma')

    expect(mockPrismaClient).toHaveBeenCalledWith({
      log: ['query', 'error', 'warn'],
    })
  })

  it('configura log apenas com error em produção', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    })

    require('@/lib/prisma')

    expect(mockPrismaClient).toHaveBeenCalledWith({
      log: ['error'],
    })
  })

  it('não atribui ao globalThis em produção', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    })

    require('@/lib/prisma')

    const g = globalThis as unknown as { prisma?: unknown }
    expect(g.prisma).toBeUndefined()
  })
})
