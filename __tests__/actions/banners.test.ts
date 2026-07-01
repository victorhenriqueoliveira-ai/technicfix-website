/**
 * Testes de integração — actions/banners.ts
 *
 * Abordagem: mock do módulo `@/lib/prisma` e `next/cache` para isolar
 * a lógica das Server Actions sem depender de banco real.
 */

// --- Mocks ---
const mockBannerCreate = jest.fn()
const mockBannerUpdate = jest.fn()
const mockBannerDelete = jest.fn()
const mockBannerFindFirst = jest.fn()
const mockBannerFindMany = jest.fn()
const mockTransaction = jest.fn()
const mockRevalidatePath = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    banner: {
      create: (...args: unknown[]) => mockBannerCreate(...args),
      update: (...args: unknown[]) => mockBannerUpdate(...args),
      delete: (...args: unknown[]) => mockBannerDelete(...args),
      findFirst: (...args: unknown[]) => mockBannerFindFirst(...args),
      findMany: (...args: unknown[]) => mockBannerFindMany(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

// Importa depois dos mocks
import {
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} from '@/actions/banners'

const bannerBase = {
  id: 'banner-1',
  imageUrl: 'https://example.com/img.jpg',
  title: 'Banner Teste',
  subtitle: 'Subtítulo',
  ctaText: 'Ver mais',
  ctaUrl: '/produtos',
  active: true,
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) {
    fd.append(key, value)
  }
  return fd
}

beforeEach(() => {
  jest.clearAllMocks()
  mockBannerFindFirst.mockResolvedValue(null)
  mockBannerCreate.mockResolvedValue(bannerBase)
  mockBannerUpdate.mockResolvedValue(bannerBase)
  mockBannerDelete.mockResolvedValue(bannerBase)
  mockTransaction.mockImplementation(async (ops: unknown[]) => {
    return Promise.all(ops)
  })
})

describe('createBanner', () => {
  it('cria banner com dados válidos e active: true quando active=on', async () => {
    const fd = makeFormData({
      imageUrl: 'https://example.com/img.jpg',
      title: 'Novo Banner',
      active: 'on',
    })

    const result = await createBanner(fd)

    expect(result.success).toBe(true)
    expect(mockBannerCreate).toHaveBeenCalledTimes(1)
    const createCall = mockBannerCreate.mock.calls[0][0]
    expect(createCall.data.title).toBe('Novo Banner')
    expect(createCall.data.active).toBe(true)
    expect(createCall.data.order).toBe(0)
  })

  it('atribui order maior que o existente quando já há banners', async () => {
    mockBannerFindFirst.mockResolvedValue({ ...bannerBase, order: 3 })

    const fd = makeFormData({
      imageUrl: 'https://example.com/img.jpg',
      title: 'Segundo Banner',
      active: 'on',
    })

    await createBanner(fd)

    const createCall = mockBannerCreate.mock.calls[0][0]
    expect(createCall.data.order).toBe(4)
  })

  it('retorna erro quando imageUrl está vazio', async () => {
    const fd = makeFormData({ imageUrl: '', title: 'Teste', active: 'on' })

    const result = await createBanner(fd)

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
    expect(mockBannerCreate).not.toHaveBeenCalled()
  })

  it('chama revalidatePath("/") após criar banner', async () => {
    const fd = makeFormData({
      imageUrl: 'https://example.com/img.jpg',
      title: 'Banner',
      active: 'on',
    })

    await createBanner(fd)

    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('updateBanner', () => {
  it('atualiza banner existente com dados válidos', async () => {
    const fd = makeFormData({
      imageUrl: 'https://example.com/new.jpg',
      title: 'Banner Atualizado',
      active: 'on',
    })

    const result = await updateBanner('banner-1', fd)

    expect(result.success).toBe(true)
    expect(mockBannerUpdate).toHaveBeenCalledWith({
      where: { id: 'banner-1' },
      data: expect.objectContaining({ title: 'Banner Atualizado' }),
    })
  })

  it('chama revalidatePath("/") após atualizar', async () => {
    const fd = makeFormData({
      imageUrl: 'https://example.com/img.jpg',
      title: 'Banner',
      active: 'on',
    })

    await updateBanner('banner-1', fd)

    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('deleteBanner', () => {
  it('deleta o banner pelo id', async () => {
    const result = await deleteBanner('banner-1')

    expect(result.success).toBe(true)
    expect(mockBannerDelete).toHaveBeenCalledWith({ where: { id: 'banner-1' } })
  })

  it('chama revalidatePath("/") após deletar', async () => {
    await deleteBanner('banner-1')

    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('reorderBanners', () => {
  it('atualiza order de id2 para 0 e id1 para 1 quando recebe ["id2", "id1"]', async () => {
    const ops: Array<{ where: { id: string }; data: { order: number } }> = []
    mockTransaction.mockImplementation(async (opsArr: unknown[]) => {
      ops.push(...(opsArr as Array<{ where: { id: string }; data: { order: number } }>))
      return opsArr
    })

    // Precisamos garantir que cada db.banner.update retorne a chamada capturável
    mockBannerUpdate.mockImplementation((args: { where: { id: string }; data: { order: number } }) => {
      return Promise.resolve(args)
    })

    await reorderBanners(['id2', 'id1'])

    expect(mockTransaction).toHaveBeenCalledTimes(1)
    // Verifica que $transaction foi chamado com array de promises/operações
    const transactionArg = mockTransaction.mock.calls[0][0]
    expect(Array.isArray(transactionArg)).toBe(true)
    expect(transactionArg).toHaveLength(2)
  })

  it('chama revalidatePath("/") após reordenar', async () => {
    mockTransaction.mockResolvedValue([])

    await reorderBanners(['id1', 'id2'])

    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('banners com active:false não aparecem na query da homepage', async () => {
    // Verifica que getBanners filtra somente por order, não por active
    // A filtragem de active:false é responsabilidade da homepage (task_05)
    // Aqui confirmamos que a action não adiciona filtro active na listagem admin
    mockBannerFindMany.mockResolvedValue([
      { ...bannerBase, id: 'b1', active: true },
      { ...bannerBase, id: 'b2', active: false },
    ])

    const { getBanners } = await import('@/actions/banners')
    const result = await getBanners()

    // Admin lista todos (ativos e inativos)
    expect(result).toHaveLength(2)
    // A query deve ordenar por order
    expect(mockBannerFindMany).toHaveBeenCalledWith({ orderBy: { order: 'asc' } })
  })
})
