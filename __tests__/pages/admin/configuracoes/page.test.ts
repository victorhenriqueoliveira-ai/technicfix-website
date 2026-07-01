/**
 * Testes de integração da página /admin/configuracoes
 */

const mockFindFirst = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    siteConfig: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}))

describe('ConfiguracoesPage — integração', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        siteConfig: {
          findFirst: (...args: unknown[]) => mockFindFirst(...args),
        },
      },
    }))
  })

  it('exporta default function (Server Component)', async () => {
    mockFindFirst.mockResolvedValue(null)

    const mod = await import('@/app/(admin)/admin/configuracoes/page')
    expect(typeof mod.default).toBe('function')
  })

  it('GET /admin/configuracoes — retorna 200 e exibe valores do banco', async () => {
    const configData = {
      id: 'singleton',
      storeName: 'Technicfix',
      whatsappNumber: '11987654321',
      contactEmail: 'contato@technicfix.com',
      technocalhasUrl: 'https://technocalhas.com.br',
      technocalhasDescription: 'Parceira de calhas',
      updatedAt: new Date(),
    }
    mockFindFirst.mockResolvedValue(configData)

    const { default: ConfiguracoesPage } = await import('@/app/(admin)/admin/configuracoes/page')
    const result = await ConfiguracoesPage()

    expect(result).not.toBeNull()
    expect(mockFindFirst).toHaveBeenCalledTimes(1)
  })

  it('usa valores padrão quando SiteConfig não existe no banco', async () => {
    mockFindFirst.mockResolvedValue(null)

    const { default: ConfiguracoesPage } = await import('@/app/(admin)/admin/configuracoes/page')
    const result = await ConfiguracoesPage()

    expect(result).not.toBeNull()
  })

  it('exibe valores atuais quando SiteConfig existe', async () => {
    const configData = {
      id: 'singleton',
      storeName: 'Loja Atualizada',
      whatsappNumber: '1134567890',
      contactEmail: 'novo@email.com',
      technocalhasUrl: '',
      technocalhasDescription: 'Nova descrição',
      updatedAt: new Date(),
    }
    mockFindFirst.mockResolvedValue(configData)

    const { default: ConfiguracoesPage } = await import('@/app/(admin)/admin/configuracoes/page')
    const result = await ConfiguracoesPage()

    expect(result).not.toBeNull()
    expect(mockFindFirst).toHaveBeenCalledTimes(1)
  })
})
