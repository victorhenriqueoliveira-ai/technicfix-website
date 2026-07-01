/**
 * Testes unitários para middleware.ts
 * Valida o comportamento de proteção de rotas do admin
 */

const mockRedirect = jest.fn()

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: mockRedirect,
  },
}))

// Captura o handler interno passado para auth()
let capturedHandler: ((req: Record<string, unknown>) => unknown) | undefined

jest.mock('@/auth', () => ({
  auth: (handler: (req: Record<string, unknown>) => unknown) => {
    capturedHandler = handler
    return handler
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

function buildRequest(pathname: string, isLoggedIn: boolean) {
  return {
    auth: isLoggedIn ? { user: { id: '1', email: 'admin@test.com' } } : null,
    nextUrl: new URL(`http://localhost${pathname}`),
    url: `http://localhost${pathname}`,
  }
}

describe('middleware — proteção de rotas /admin', () => {
  beforeAll(() => {
    // Carrega o middleware uma vez para capturar o handler
    jest.resetModules()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@/middleware')
  })

  beforeEach(() => {
    mockRedirect.mockReset()
    mockRedirect.mockImplementation((url: URL) => ({ type: 'redirect', url: url.toString() }))
  })

  it('captura o handler do middleware', () => {
    expect(capturedHandler).toBeDefined()
  })

  it('redireciona para /admin/login quando não autenticado acessa /admin', () => {
    const req = buildRequest('/admin', false)
    capturedHandler!(req as Parameters<typeof capturedHandler>[0])

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL
    expect(redirectUrl.pathname).toBe('/admin/login')
  })

  it('redireciona para /admin/login quando não autenticado acessa rota protegida', () => {
    const req = buildRequest('/admin/produtos', false)
    capturedHandler!(req as Parameters<typeof capturedHandler>[0])

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL
    expect(redirectUrl.pathname).toBe('/admin/login')
  })

  it('redireciona para /admin quando autenticado tenta acessar /admin/login', () => {
    const req = buildRequest('/admin/login', true)
    capturedHandler!(req as Parameters<typeof capturedHandler>[0])

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL
    expect(redirectUrl.pathname).toBe('/admin')
  })

  it('não redireciona quando não autenticado acessa /admin/login', () => {
    const req = buildRequest('/admin/login', false)
    const result = capturedHandler!(req as Parameters<typeof capturedHandler>[0])

    expect(mockRedirect).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('não redireciona quando autenticado acessa /admin', () => {
    const req = buildRequest('/admin', true)
    const result = capturedHandler!(req as Parameters<typeof capturedHandler>[0])

    expect(mockRedirect).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
