/**
 * Testes de integração para actions/products.ts
 * Usa mocks do Prisma, next/cache, AWS SDK e lib/env — não conecta serviços externos
 */

// Mock de lib/env (substitui acessos a env.* nos testes)
jest.mock('@/lib/env', () => ({
  env: {
    R2_ACCOUNT_ID: 'test-account',
    R2_ACCESS_KEY_ID: 'test-key',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    R2_BUCKET_NAME: 'test-bucket',
    RESEND_API_KEY: 'resend_test_key',
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    UPLOADTHING_TOKEN: 'uploadthing_test_token',
    AUTH_SECRET: 'auth_secret_value',
    NEXT_PUBLIC_WHATSAPP_NUMBER: '11999999999',
    NEXT_PUBLIC_SITE_URL: 'https://technicfix.com.br',
  },
}))

// Mock do next/cache
const mockRevalidatePath = jest.fn()
jest.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

// Mock do AWS SDK
const mockGetSignedUrl = jest.fn()
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args: unknown[]) => mockGetSignedUrl(...args),
}))
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({})),
  PutObjectCommand: jest.fn().mockImplementation((params) => params),
}))

// Mocks do db
const mockProductFindUnique = jest.fn()
const mockProductFindFirst = jest.fn()
const mockProductFindMany = jest.fn()
const mockProductCreate = jest.fn()
const mockProductUpdate = jest.fn()
const mockProductDelete = jest.fn()
const mockLeadUpdateMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findUnique: (...args: unknown[]) => mockProductFindUnique(...args),
      findFirst: (...args: unknown[]) => mockProductFindFirst(...args),
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
      create: (...args: unknown[]) => mockProductCreate(...args),
      update: (...args: unknown[]) => mockProductUpdate(...args),
      delete: (...args: unknown[]) => mockProductDelete(...args),
    },
    lead: {
      updateMany: (...args: unknown[]) => mockLeadUpdateMany(...args),
    },
  },
}))

import { createProduct, updateProduct, deleteProduct, getPresignedUploadUrl } from '@/actions/products'

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

const baseProduct = {
  name: 'Parafuso M8',
  slug: 'parafuso-m8',
  categoryId: 'cat-1',
  stock: '10',
  status: 'ativo',
  featured: 'false',
  images: '[]',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── createProduct ────────────────────────────────────────────────────────────

describe('createProduct', () => {
  it('cria produto com dados válidos e status ativo', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-1', ...baseProduct })

    const fd = makeFormData(baseProduct)
    const result = await createProduct(fd)

    expect(result).toEqual({ success: true, id: 'prod-1' })
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Parafuso M8',
          slug: 'parafuso-m8',
          status: 'ativo',
        }),
      })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/produtos')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/produtos')
  })

  it('gera slug automaticamente quando não fornecido', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-2' })

    const fd = makeFormData({ ...baseProduct, slug: '', name: 'Porca Sextavada' })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: 'porca-sextavada' }),
      })
    )
  })

  it('retorna erro quando slug já existe (slug duplicado)', async () => {
    mockProductFindUnique.mockResolvedValue({ id: 'prod-existente', slug: 'parafuso-m8' })

    const fd = makeFormData(baseProduct)
    const result = await createProduct(fd)

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/parafuso-m8/)
    expect(mockProductCreate).not.toHaveBeenCalled()
  })

  it('retorna erro de validação para nome muito curto', async () => {
    const fd = makeFormData({ ...baseProduct, name: 'X', slug: 'x' })
    const result = await createProduct(fd)

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/2 caracteres/)
    expect(mockProductCreate).not.toHaveBeenCalled()
  })

  it('retorna erro de validação para categoryId vazio', async () => {
    const fd = makeFormData({ ...baseProduct, categoryId: '' })
    const result = await createProduct(fd)

    expect(result.success).toBe(false)
    expect(mockProductCreate).not.toHaveBeenCalled()
  })

  it('persiste imagens no array do produto', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-3' })

    const images = ['https://cdn.example.com/img1.jpg', 'https://cdn.example.com/img2.jpg']
    const fd = makeFormData({ ...baseProduct, images: JSON.stringify(images) })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ images }),
      })
    )
  })
})

// ─── updateProduct ────────────────────────────────────────────────────────────

describe('updateProduct', () => {
  it('atualiza produto com dados válidos', async () => {
    mockProductFindFirst.mockResolvedValue(null)
    mockProductUpdate.mockResolvedValue({ id: 'prod-1' })

    const fd = makeFormData({ ...baseProduct, name: 'Parafuso M8 Atualizado' })
    const result = await updateProduct('prod-1', fd)

    expect(result).toEqual({ success: true, id: 'prod-1' })
    expect(mockProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'prod-1' } })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/produtos')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('atualiza featured para true e revalida cache', async () => {
    mockProductFindFirst.mockResolvedValue(null)
    mockProductUpdate.mockResolvedValue({ id: 'prod-1' })

    const fd = makeFormData({ ...baseProduct, featured: 'true' })
    const result = await updateProduct('prod-1', fd)

    expect(result.success).toBe(true)
    expect(mockProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ featured: true }),
      })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('atualiza status para inativo e revalida cache', async () => {
    mockProductFindFirst.mockResolvedValue(null)
    mockProductUpdate.mockResolvedValue({ id: 'prod-1' })

    const fd = makeFormData({ ...baseProduct, status: 'inativo' })
    const result = await updateProduct('prod-1', fd)

    expect(result.success).toBe(true)
    expect(mockProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'inativo' }),
      })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/produtos')
  })

  it('retorna erro quando slug pertence a outro produto', async () => {
    mockProductFindFirst.mockResolvedValue({ id: 'prod-outro', slug: 'parafuso-m8' })

    const fd = makeFormData(baseProduct)
    const result = await updateProduct('prod-1', fd)

    expect(result.success).toBe(false)
    expect(mockProductUpdate).not.toHaveBeenCalled()
  })
})

// ─── deleteProduct ────────────────────────────────────────────────────────────

describe('deleteProduct', () => {
  it('remove produto e desvincula leads associados', async () => {
    mockProductFindUnique.mockResolvedValue({ id: 'prod-1', name: 'Parafuso M8' })
    mockLeadUpdateMany.mockResolvedValue({ count: 2 })
    mockProductDelete.mockResolvedValue({ id: 'prod-1' })

    const result = await deleteProduct('prod-1')

    expect(result).toEqual({ success: true, id: 'prod-1' })
    expect(mockLeadUpdateMany).toHaveBeenCalledWith({
      where: { productId: 'prod-1' },
      data: { productId: null },
    })
    expect(mockProductDelete).toHaveBeenCalledWith({ where: { id: 'prod-1' } })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/produtos')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('retorna erro quando produto não existe', async () => {
    mockProductFindUnique.mockResolvedValue(null)

    const result = await deleteProduct('nao-existe')

    expect(result.success).toBe(false)
    expect((result as { success: false; error: string }).error).toMatch(/não encontrado/)
    expect(mockProductDelete).not.toHaveBeenCalled()
    expect(mockLeadUpdateMany).not.toHaveBeenCalled()
  })
})

// ─── createProduct — novos campos (task_04) ───────────────────────────────────

describe('createProduct — campos showPrice, productType, relatedProductIds', () => {
  it('cria produto com showPrice=false quando campo está ausente no FormData', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-10' })

    const fd = makeFormData({ ...baseProduct })
    // showPrice não presente = desmarcado → false
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ showPrice: false }),
      })
    )
  })

  it('cria produto com showPrice=true quando campo é "on"', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-11' })

    const fd = makeFormData({ ...baseProduct, showPrice: 'on' })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ showPrice: true }),
      })
    )
  })

  it('cria produto com productType=varejo', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-12' })

    const fd = makeFormData({ ...baseProduct, productType: 'varejo' })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ productType: 'varejo' }),
      })
    )
  })

  it('cria produto com productType padrão ambos quando campo ausente', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-13' })

    const fd = makeFormData({ ...baseProduct })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ productType: 'ambos' }),
      })
    )
  })

  it('cria produto com relatedProductIds contendo dois IDs', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-14' })

    const ids = ['rel-1', 'rel-2']
    const fd = makeFormData({ ...baseProduct, relatedProductIds: JSON.stringify(ids) })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ relatedProductIds: ids }),
      })
    )
  })

  it('cria produto com relatedProductIds vazio quando campo ausente', async () => {
    mockProductFindUnique.mockResolvedValue(null)
    mockProductCreate.mockResolvedValue({ id: 'prod-15' })

    const fd = makeFormData({ ...baseProduct })
    const result = await createProduct(fd)

    expect(result.success).toBe(true)
    expect(mockProductCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ relatedProductIds: [] }),
      })
    )
  })
})

// ─── updateProduct — novos campos (task_04) ───────────────────────────────────

describe('updateProduct — campos showPrice, productType, relatedProductIds', () => {
  it('atualiza produto adicionando relatedProductIds', async () => {
    mockProductFindFirst.mockResolvedValue(null)
    mockProductUpdate.mockResolvedValue({ id: 'prod-1' })

    const ids = ['rel-a', 'rel-b']
    const fd = makeFormData({ ...baseProduct, relatedProductIds: JSON.stringify(ids) })
    const result = await updateProduct('prod-1', fd)

    expect(result.success).toBe(true)
    expect(mockProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ relatedProductIds: ids }),
      })
    )
  })

  it('atualiza produto com showPrice=false e productType=varejo', async () => {
    mockProductFindFirst.mockResolvedValue(null)
    mockProductUpdate.mockResolvedValue({ id: 'prod-1' })

    const fd = makeFormData({ ...baseProduct, productType: 'varejo' })
    // showPrice ausente = false
    const result = await updateProduct('prod-1', fd)

    expect(result.success).toBe(true)
    expect(mockProductUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ showPrice: false, productType: 'varejo' }),
      })
    )
  })
})

// ─── getPresignedUploadUrl ────────────────────────────────────────────────────

describe('getPresignedUploadUrl', () => {
  it('retorna url e key para arquivo JPEG válido', async () => {
    mockGetSignedUrl.mockResolvedValue('https://r2.example.com/presigned-url?sig=xyz')

    const result = await getPresignedUploadUrl('foto.jpg', 'image/jpeg', 1024 * 1024)

    expect(result).toEqual(
      expect.objectContaining({
        url: 'https://r2.example.com/presigned-url?sig=xyz',
        key: expect.stringMatching(/^products\/\d+-foto\.jpg$/),
      })
    )
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        Bucket: 'test-bucket',
        ContentType: 'image/jpeg',
      }),
      expect.objectContaining({ expiresIn: 300 })
    )
  })

  it('retorna url e key para arquivo PNG válido', async () => {
    mockGetSignedUrl.mockResolvedValue('https://r2.example.com/png-url')

    const result = await getPresignedUploadUrl('imagem.png', 'image/png')

    expect('url' in result && result.url).toBe('https://r2.example.com/png-url')
    expect('key' in result && result.key).toMatch(/^products\//)
  })

  it('retorna erro para tipo MIME não permitido', async () => {
    const result = await getPresignedUploadUrl('video.mp4', 'video/mp4')

    expect('error' in result).toBe(true)
    expect((result as { error: string }).error).toMatch(/não permitido/)
    expect(mockGetSignedUrl).not.toHaveBeenCalled()
  })

  it('retorna erro para arquivo maior que 5MB', async () => {
    const result = await getPresignedUploadUrl('grande.jpg', 'image/jpeg', 6 * 1024 * 1024)

    expect('error' in result).toBe(true)
    expect((result as { error: string }).error).toMatch(/grande/)
    expect(mockGetSignedUrl).not.toHaveBeenCalled()
  })

  it('permite WebP como tipo de arquivo', async () => {
    mockGetSignedUrl.mockResolvedValue('https://r2.example.com/webp-url')

    const result = await getPresignedUploadUrl('imagem.webp', 'image/webp', 2 * 1024 * 1024)

    expect('url' in result).toBe(true)
    expect(mockGetSignedUrl).toHaveBeenCalled()
  })
})
