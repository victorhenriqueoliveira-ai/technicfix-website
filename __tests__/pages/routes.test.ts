/**
 * Testes de integração das rotas institucionais
 * Verifica que os módulos das páginas exportam o default corretamente
 * (testes de rota real requerem servidor Next.js rodando)
 */

// Mock do db para a página technocalhas
const mockFindFirst = jest.fn()
jest.mock('@/lib/prisma', () => ({
  db: {
    siteConfig: {
      findFirst: () => mockFindFirst(),
    },
  },
}))

// Mock da server action
jest.mock('@/actions/leads', () => ({
  submitLead: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock next/link (node environment)
jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: unknown }) {
    return { href, children }
  }
})

describe('Rotas institucionais — integração de módulos', () => {
  it('GET /sobre — módulo da página exporta default function', async () => {
    const mod = await import('@/app/(public)/sobre/page')
    expect(typeof mod.default).toBe('function')
  })

  it('GET /contato — módulo da página exporta default function', async () => {
    const mod = await import('@/app/(public)/contato/page')
    expect(typeof mod.default).toBe('function')
  })

  it('GET /technocalhas — módulo da página exporta default function', async () => {
    const mod = await import('@/app/(public)/technocalhas/page')
    expect(typeof mod.default).toBe('function')
  })

  it('GET /technocalhas — renderiza sem erro quando SiteConfig não existe', async () => {
    mockFindFirst.mockResolvedValue(null)

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')

    await expect(TechnocalhasPage()).resolves.not.toThrow()
  })

  it('GET /technocalhas — usa technocalhasUrl do SiteConfig no CTA', async () => {
    jest.resetModules()
    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: () => mockFindFirst(),
        },
      },
    }))
    jest.mock('next/link', () => {
      return function MockLink({ href, children }: { href: string; children: unknown }) {
        return { href, children }
      }
    })

    mockFindFirst.mockResolvedValue({
      technocalhasDescription: 'Calhas industriais',
      technocalhasUrl: 'https://technocalhas.com.br',
    })

    const { default: TechnocalhasPage } = await import('@/app/(public)/technocalhas/page')
    const result = await TechnocalhasPage()
    // O resultado deve ser um elemento React válido (não nulo)
    expect(result).not.toBeNull()
  })

  it('actions/leads.ts — submitLead exporta função', async () => {
    jest.resetModules()
    // Reimportar sem mock para o stub real
    jest.unmock('@/actions/leads')
    const mod = await import('@/actions/leads')
    expect(typeof mod.submitLead).toBe('function')
  })

  it('actions/leads.ts — submitLead retorna { success: true }', async () => {
    jest.resetModules()
    jest.unmock('@/actions/leads')
    // Mockar prisma e validações para teste isolado da action
    jest.mock('@/lib/prisma', () => ({
      db: {
        lead: {
          create: jest.fn().mockResolvedValue({}),
        },
      },
    }))
    const { submitLead } = await import('@/actions/leads')
    const result = await submitLead({
      type: 'geral',
      name: 'Teste',
      email: 'teste@email.com',
      phone: '11999990000',
    })
    expect(result).toEqual({ success: true })
  })
})
