/**
 * Testes unitários do AdminHeader
 * Como é um Server Component assíncrono, testamos a lógica como função
 */

// Mock de auth
const mockAuth = jest.fn()
jest.mock('@/auth', () => ({
  auth: () => mockAuth(),
  signOut: jest.fn(),
}))

describe('AdminHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('módulo exporta AdminHeader como função', async () => {
    const mod = await import('@/components/admin/AdminHeader')
    expect(typeof mod.AdminHeader).toBe('function')
  })

  it('módulo renderiza sem erros quando a sessão tem email', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@technicfix.com.br' } })

    const { AdminHeader } = await import('@/components/admin/AdminHeader')
    const result = await AdminHeader()
    expect(result).not.toBeNull()
  })

  it('módulo renderiza sem erros quando a sessão não tem email (usa fallback "Admin")', async () => {
    mockAuth.mockResolvedValue({ user: {} })

    jest.resetModules()
    jest.mock('@/auth', () => ({
      auth: () => mockAuth(),
      signOut: jest.fn(),
    }))

    const { AdminHeader } = await import('@/components/admin/AdminHeader')
    const result = await AdminHeader()
    expect(result).not.toBeNull()
  })
})
