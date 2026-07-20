/**
 * Testes unitários para lib/env.ts
 *
 * Como a validação ocorre no topo do módulo (nível de módulo),
 * utilizamos jest.isolateModules para recarregar o módulo com
 * variáveis de ambiente diferentes em cada teste.
 */

const VALID_ENV = {
  DATABASE_URL:                'postgresql://user:pass@localhost:5432/db',
  RESEND_API_KEY:              'resend_test_key',
  UPLOADTHING_TOKEN:           'uploadthing_test_token',
  AUTH_SECRET:                 'auth_secret_value',
  NEXT_PUBLIC_WHATSAPP_NUMBER: '11999999999',
  NEXT_PUBLIC_SITE_URL:        'https://technicfix.com.br',
}

function setEnv(overrides: Partial<Record<string, string | undefined>> = {}) {
  const merged = { ...VALID_ENV, ...overrides }
  // Remover chaves com valor undefined
  for (const [key, val] of Object.entries(merged)) {
    if (val === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = val
    }
  }
}

function clearEnv() {
  for (const key of Object.keys(VALID_ENV)) {
    delete process.env[key]
  }
}

afterEach(() => {
  clearEnv()
  jest.resetModules()
})

describe('lib/env.ts — schema Zod', () => {
  it('exporta env com todos os campos quando todas as vars estão presentes', () => {
    setEnv()
    let envModule: typeof import('@/lib/env')
    jest.isolateModules(() => {
      envModule = require('@/lib/env')
    })
    const { env } = envModule!
    expect(env.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL)
    expect(env.RESEND_API_KEY).toBe(VALID_ENV.RESEND_API_KEY)
    expect(env.UPLOADTHING_TOKEN).toBe(VALID_ENV.UPLOADTHING_TOKEN)
    expect(env.AUTH_SECRET).toBe(VALID_ENV.AUTH_SECRET)
    expect(env.NEXT_PUBLIC_WHATSAPP_NUMBER).toBe(VALID_ENV.NEXT_PUBLIC_WHATSAPP_NUMBER)
    expect(env.NEXT_PUBLIC_SITE_URL).toBe(VALID_ENV.NEXT_PUBLIC_SITE_URL)
  })

  it('lança Error quando DATABASE_URL está ausente', () => {
    setEnv({ DATABASE_URL: undefined })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })

  it('lança Error quando RESEND_API_KEY é string vazia (min(1))', () => {
    setEnv({ RESEND_API_KEY: '' })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })

  it('lança Error quando NEXT_PUBLIC_SITE_URL não é uma URL válida', () => {
    setEnv({ NEXT_PUBLIC_SITE_URL: 'nao-e-uma-url' })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })

  it('lança Error quando AUTH_SECRET está ausente', () => {
    setEnv({ AUTH_SECRET: undefined })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })

  it('env exportado é o objeto retornado pelo schema quando válido', () => {
    setEnv()
    let envModule: typeof import('@/lib/env')
    jest.isolateModules(() => {
      envModule = require('@/lib/env')
    })
    const { env } = envModule!
    // env deve ser um objeto simples com as chaves do schema
    expect(typeof env).toBe('object')
    expect(Object.keys(env).sort()).toEqual(Object.keys(VALID_ENV).sort())
  })

  it('lança Error quando UPLOADTHING_TOKEN está ausente', () => {
    setEnv({ UPLOADTHING_TOKEN: undefined })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })

  it('lança Error quando DATABASE_URL não é uma URL válida', () => {
    setEnv({ DATABASE_URL: 'nao-e-url' })
    expect(() => {
      jest.isolateModules(() => {
        require('@/lib/env')
      })
    }).toThrow('[Technicfix] Configuração de ambiente incompleta.')
  })
})
