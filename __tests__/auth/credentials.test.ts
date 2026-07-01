/**
 * Testes unitários para lib/credentials-authorize.ts
 * Valida a função credentialsAuthorize com mock do banco de dados e bcryptjs
 */

// Mock do módulo @/lib/prisma
const mockFindUnique = jest.fn()
jest.mock('@/lib/prisma', () => ({
  db: {
    adminUser: {
      findUnique: mockFindUnique,
    },
  },
}))

// Mock do bcryptjs
const mockBcryptCompare = jest.fn()
jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: { compare: mockBcryptCompare },
  compare: mockBcryptCompare,
}))

import { credentialsAuthorize } from '@/lib/credentials-authorize'

describe('credentialsAuthorize — Credentials Provider do Auth.js v5', () => {
  beforeEach(() => {
    mockFindUnique.mockReset()
    mockBcryptCompare.mockReset()
  })

  it('retorna null quando credenciais estão ausentes (sem email)', async () => {
    const result = await credentialsAuthorize({ password: 'senha123' })
    expect(result).toBeNull()
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('retorna null quando credenciais estão ausentes (sem password)', async () => {
    const result = await credentialsAuthorize({ email: 'admin@teste.com' })
    expect(result).toBeNull()
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('retorna null quando credenciais são undefined', async () => {
    const result = await credentialsAuthorize(undefined)
    expect(result).toBeNull()
    expect(mockFindUnique).not.toHaveBeenCalled()
  })

  it('retorna null quando o e-mail não existe no banco', async () => {
    mockFindUnique.mockResolvedValueOnce(null)

    const result = await credentialsAuthorize({
      email: 'naoexiste@teste.com',
      password: 'qualquersenha',
    })

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'naoexiste@teste.com' },
    })
    expect(result).toBeNull()
    expect(mockBcryptCompare).not.toHaveBeenCalled()
  })

  it('retorna null quando a senha não confere com o hash bcrypt', async () => {
    const mockUser = {
      id: 'user-id-123',
      email: 'admin@technicfix.com',
      passwordHash: '$2b$10$hashinvalido',
    }
    mockFindUnique.mockResolvedValueOnce(mockUser)
    mockBcryptCompare.mockResolvedValueOnce(false)

    const result = await credentialsAuthorize({
      email: 'admin@technicfix.com',
      password: 'senhaerrada',
    })

    expect(mockBcryptCompare).toHaveBeenCalledWith('senhaerrada', mockUser.passwordHash)
    expect(result).toBeNull()
  })

  it('retorna o objeto de usuário quando e-mail e senha são válidos', async () => {
    const mockUser = {
      id: 'user-id-456',
      email: 'admin@technicfix.com',
      passwordHash: '$2b$10$hashvalido',
    }
    mockFindUnique.mockResolvedValueOnce(mockUser)
    mockBcryptCompare.mockResolvedValueOnce(true)

    const result = await credentialsAuthorize({
      email: 'admin@technicfix.com',
      password: 'senhaCorreta123',
    })

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'admin@technicfix.com' },
    })
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      'senhaCorreta123',
      mockUser.passwordHash
    )
    expect(result).toEqual({ id: 'user-id-456', email: 'admin@technicfix.com' })
  })
})
