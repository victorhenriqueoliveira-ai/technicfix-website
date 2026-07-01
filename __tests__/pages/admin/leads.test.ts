/**
 * Testes de integração — gestão de leads admin
 */

const mockLeadUpdate = jest.fn()
const mockLeadFindMany = jest.fn()
const mockLeadCount = jest.fn()
const mockLeadFindUnique = jest.fn()
const mockRevalidatePath = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    lead: {
      update: (args: unknown) => mockLeadUpdate(args),
      findMany: (args: unknown) => mockLeadFindMany(args),
      count: (args: unknown) => mockLeadCount(args),
      findUnique: (args: unknown) => mockLeadFindUnique(args),
    },
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}))

describe('updateLeadStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        lead: {
          update: (args: unknown) => mockLeadUpdate(args),
          findMany: (args: unknown) => mockLeadFindMany(args),
          count: (args: unknown) => mockLeadCount(args),
          findUnique: (args: unknown) => mockLeadFindUnique(args),
        },
      },
    }))

    jest.mock('next/cache', () => ({
      revalidatePath: (path: string) => mockRevalidatePath(path),
    }))
  })

  it('atualiza o status no banco e revalida as rotas', async () => {
    mockLeadUpdate.mockResolvedValue({ id: 'lead-1', status: 'convertido' })

    const { updateLeadStatus } = await import('@/actions/admin-leads')
    await updateLeadStatus('lead-1', 'convertido')

    expect(mockLeadUpdate).toHaveBeenCalledWith({
      where: { id: 'lead-1' },
      data: { status: 'convertido' },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/leads')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/leads/lead-1')
  })

  it('lança erro para status inválido', async () => {
    const { updateLeadStatus } = await import('@/actions/admin-leads')
    await expect(
      updateLeadStatus('lead-1', 'status_invalido' as never)
    ).rejects.toThrow('Status inválido')
    expect(mockLeadUpdate).not.toHaveBeenCalled()
  })

  it('atualiza status para "novo"', async () => {
    mockLeadUpdate.mockResolvedValue({ id: 'lead-2', status: 'novo' })

    const { updateLeadStatus } = await import('@/actions/admin-leads')
    await updateLeadStatus('lead-2', 'novo')

    expect(mockLeadUpdate).toHaveBeenCalledWith({
      where: { id: 'lead-2' },
      data: { status: 'novo' },
    })
  })
})

describe('updateLeadNotes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        lead: {
          update: (args: unknown) => mockLeadUpdate(args),
          findMany: (args: unknown) => mockLeadFindMany(args),
          count: (args: unknown) => mockLeadCount(args),
          findUnique: (args: unknown) => mockLeadFindUnique(args),
        },
      },
    }))

    jest.mock('next/cache', () => ({
      revalidatePath: (path: string) => mockRevalidatePath(path),
    }))
  })

  it('salva a anotação no banco e revalida as rotas', async () => {
    mockLeadUpdate.mockResolvedValue({ id: 'lead-1', notes: 'Ligou dia 05' })

    const { updateLeadNotes } = await import('@/actions/admin-leads')
    await updateLeadNotes('lead-1', 'Ligou dia 05')

    expect(mockLeadUpdate).toHaveBeenCalledWith({
      where: { id: 'lead-1' },
      data: { notes: 'Ligou dia 05' },
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/leads')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/leads/lead-1')
  })

  it('salva anotação vazia sem erro', async () => {
    mockLeadUpdate.mockResolvedValue({ id: 'lead-1', notes: '' })

    const { updateLeadNotes } = await import('@/actions/admin-leads')
    await updateLeadNotes('lead-1', '')

    expect(mockLeadUpdate).toHaveBeenCalledWith({
      where: { id: 'lead-1' },
      data: { notes: '' },
    })
  })
})

describe('Página de listagem de leads', () => {
  const leadBase = {
    id: 'lead-abc',
    type: 'varejo',
    status: 'novo',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '11999999999',
    companyName: null,
    cnpj: null,
    estimatedVolume: null,
    desiredDeadline: null,
    message: null,
    notes: null,
    productId: null,
    product: null,
    createdAt: new Date('2026-01-10T10:00:00Z'),
    updatedAt: new Date('2026-01-10T10:00:00Z'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        lead: {
          update: (args: unknown) => mockLeadUpdate(args),
          findMany: (args: unknown) => mockLeadFindMany(args),
          count: (args: unknown) => mockLeadCount(args),
          findUnique: (args: unknown) => mockLeadFindUnique(args),
        },
      },
    }))

    jest.mock('next/cache', () => ({
      revalidatePath: (path: string) => mockRevalidatePath(path),
    }))

    jest.mock('next/navigation', () => ({
      notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
    }))

    jest.mock('next/link', () => ({
      __esModule: true,
      default: ({ children }: { children: React.ReactNode }) => children,
    }))
  })

  it('módulo da página de leads exporta default function', async () => {
    mockLeadFindMany.mockResolvedValue([])
    mockLeadCount.mockResolvedValue(0)

    const mod = await import('@/app/(admin)/admin/leads/page')
    expect(typeof mod.default).toBe('function')
  })

  it('busca leads ordenados por createdAt DESC', async () => {
    mockLeadFindMany.mockResolvedValue([leadBase])
    mockLeadCount.mockResolvedValue(1)

    const { default: LeadsPage } = await import('@/app/(admin)/admin/leads/page')
    await LeadsPage({ searchParams: Promise.resolve({}) })

    expect(mockLeadFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      })
    )
  })

  it('filtra por tipo "atacado" quando searchParams.tipo=atacado', async () => {
    mockLeadFindMany.mockResolvedValue([])
    mockLeadCount.mockResolvedValue(0)

    const { default: LeadsPage } = await import('@/app/(admin)/admin/leads/page')
    await LeadsPage({ searchParams: Promise.resolve({ tipo: 'atacado' }) })

    expect(mockLeadFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: 'atacado' }),
      })
    )
  })

  it('filtra por status "novo" quando searchParams.status=novo', async () => {
    mockLeadFindMany.mockResolvedValue([])
    mockLeadCount.mockResolvedValue(0)

    const { default: LeadsPage } = await import('@/app/(admin)/admin/leads/page')
    await LeadsPage({ searchParams: Promise.resolve({ status: 'novo' }) })

    expect(mockLeadFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'novo' }),
      })
    )
  })

  it('ignora tipo inválido no filtro', async () => {
    mockLeadFindMany.mockResolvedValue([])
    mockLeadCount.mockResolvedValue(0)

    const { default: LeadsPage } = await import('@/app/(admin)/admin/leads/page')
    await LeadsPage({ searchParams: Promise.resolve({ tipo: 'invalido' }) })

    const chamada = mockLeadFindMany.mock.calls[0][0]
    expect(chamada.where).not.toHaveProperty('type')
  })
})

describe('Página de detalhe do lead', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    jest.mock('@/lib/prisma', () => ({
      db: {
        lead: {
          update: (args: unknown) => mockLeadUpdate(args),
          findMany: (args: unknown) => mockLeadFindMany(args),
          count: (args: unknown) => mockLeadCount(args),
          findUnique: (args: unknown) => mockLeadFindUnique(args),
        },
      },
    }))

    jest.mock('next/cache', () => ({
      revalidatePath: (path: string) => mockRevalidatePath(path),
    }))

    jest.mock('next/navigation', () => ({
      notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
    }))

    jest.mock('next/link', () => ({
      __esModule: true,
      default: ({ children }: { children: React.ReactNode }) => children,
    }))

    jest.mock('@/components/admin/LeadUpdateForms', () => ({
      LeadStatusForm: () => null,
      LeadNotesForm: () => null,
    }))
  })

  it('retorna 404 para lead inexistente', async () => {
    mockLeadFindUnique.mockResolvedValue(null)

    const { default: LeadDetailPage } = await import('@/app/(admin)/admin/leads/[id]/page')
    await expect(
      LeadDetailPage({ params: Promise.resolve({ id: 'id-inexistente' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('busca lead por id incluindo produto', async () => {
    const lead = {
      id: 'lead-1',
      type: 'varejo',
      status: 'novo',
      name: 'Maria',
      email: 'maria@email.com',
      phone: '11988888888',
      companyName: null,
      cnpj: null,
      estimatedVolume: null,
      desiredDeadline: null,
      message: null,
      notes: null,
      productId: null,
      product: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockLeadFindUnique.mockResolvedValue(lead)

    const { default: LeadDetailPage } = await import('@/app/(admin)/admin/leads/[id]/page')
    const result = await LeadDetailPage({ params: Promise.resolve({ id: 'lead-1' }) })
    expect(result).not.toBeNull()

    expect(mockLeadFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'lead-1' },
        include: expect.objectContaining({ product: expect.any(Object) }),
      })
    )
  })
})
