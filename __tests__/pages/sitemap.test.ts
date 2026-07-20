/**
 * Testes unitários para app/sitemap.ts (task_12)
 *
 * Verifica:
 * - lastModified usa updatedAt real de produtos e categorias
 * - Produtos com status 'inativo' NÃO aparecem no sitemap
 * - URL base usa env.NEXT_PUBLIC_SITE_URL (sem hardcode)
 * - Categorias aparecem com lastModified correto
 * - Datas ISO válidas (não undefined/null)
 */

// Mock de lib/env
jest.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://technicfix.com.br',
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/testdb',
    RESEND_API_KEY: 'resend_test_key',
    UPLOADTHING_TOKEN: 'uploadthing_test_token',
    AUTH_SECRET: 'auth_secret_test_value',
    NEXT_PUBLIC_WHATSAPP_NUMBER: '11999999999',
  },
}))

// Mocks do Prisma
const mockProductFindMany = jest.fn()
const mockCategoryFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
    },
    category: {
      findMany: (...args: unknown[]) => mockCategoryFindMany(...args),
    },
  },
}))

// Importar sitemap após mocks
import sitemap from '@/app/sitemap'

const BASE_URL = 'https://technicfix.com.br'

describe('app/sitemap — task_12', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('produtos', () => {
    it('produto ativo aparece no sitemap com lastModified igual ao seu updatedAt', async () => {
      const updatedAt = new Date('2026-06-01T10:00:00.000Z')
      mockProductFindMany.mockResolvedValueOnce([
        { slug: 'parafuso-m6', updatedAt },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const entry = entries.find((e) => e.url === `${BASE_URL}/produtos/parafuso-m6`)

      expect(entry).toBeDefined()
      expect(entry?.lastModified).toEqual(updatedAt)
    })

    it('query de produtos inclui where: { status: "ativo" }', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      await sitemap()

      expect(mockProductFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'ativo' },
        })
      )
    })

    it('query de produtos inclui updatedAt no select', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      await sitemap()

      expect(mockProductFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({ updatedAt: true }),
        })
      )
    })

    it('URL de produto usa env.NEXT_PUBLIC_SITE_URL como base', async () => {
      mockProductFindMany.mockResolvedValueOnce([
        { slug: 'porca-m8', updatedAt: new Date('2026-05-15T00:00:00.000Z') },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const productEntry = entries.find((e) => e.url.includes('/produtos/porca-m8'))

      expect(productEntry?.url).toBe('https://technicfix.com.br/produtos/porca-m8')
      expect(productEntry?.url).not.toContain('undefined')
    })

    it('lastModified de produto é um objeto Date válido (não undefined/null)', async () => {
      const updatedAt = new Date('2026-04-20T08:30:00.000Z')
      mockProductFindMany.mockResolvedValueOnce([
        { slug: 'rebite-6x12', updatedAt },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const entry = entries.find((e) => e.url.includes('/produtos/rebite-6x12'))

      expect(entry?.lastModified).toBeInstanceOf(Date)
      expect(entry?.lastModified).not.toBeNull()
      expect(entry?.lastModified).not.toBeUndefined()
    })

    it('múltiplos produtos ativos aparecem no sitemap com seus respectivos updatedAt', async () => {
      const date1 = new Date('2026-01-10T00:00:00.000Z')
      const date2 = new Date('2026-03-22T00:00:00.000Z')
      mockProductFindMany.mockResolvedValueOnce([
        { slug: 'parafuso-a', updatedAt: date1 },
        { slug: 'parafuso-b', updatedAt: date2 },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const entryA = entries.find((e) => e.url.includes('/produtos/parafuso-a'))
      const entryB = entries.find((e) => e.url.includes('/produtos/parafuso-b'))

      expect(entryA?.lastModified).toEqual(date1)
      expect(entryB?.lastModified).toEqual(date2)
    })
  })

  describe('categorias', () => {
    it('categoria aparece no sitemap com lastModified igual ao seu updatedAt', async () => {
      const updatedAt = new Date('2026-02-14T12:00:00.000Z')
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([
        { slug: 'fixadores', updatedAt },
      ])

      const entries = await sitemap()
      const entry = entries.find((e) => e.url === `${BASE_URL}/categorias/fixadores`)

      expect(entry).toBeDefined()
      expect(entry?.lastModified).toEqual(updatedAt)
    })

    it('query de categorias inclui updatedAt no select', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      await sitemap()

      expect(mockCategoryFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({ updatedAt: true }),
        })
      )
    })

    it('URL de categoria usa env.NEXT_PUBLIC_SITE_URL como base', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([
        { slug: 'parafusos', updatedAt: new Date('2026-05-01T00:00:00.000Z') },
      ])

      const entries = await sitemap()
      const catEntry = entries.find((e) => e.url.includes('/categorias/parafusos'))

      expect(catEntry?.url).toBe('https://technicfix.com.br/categorias/parafusos')
      expect(catEntry?.url).not.toContain('undefined')
    })

    it('lastModified de categoria é um objeto Date válido (não undefined/null)', async () => {
      const updatedAt = new Date('2026-06-10T15:00:00.000Z')
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([
        { slug: 'porcas', updatedAt },
      ])

      const entries = await sitemap()
      const entry = entries.find((e) => e.url.includes('/categorias/porcas'))

      expect(entry?.lastModified).toBeInstanceOf(Date)
      expect(entry?.lastModified).not.toBeNull()
      expect(entry?.lastModified).not.toBeUndefined()
    })
  })

  describe('URLs estáticas', () => {
    it('retorna as páginas estáticas esperadas', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const urls = entries.map((e) => e.url)

      expect(urls).toContain(`${BASE_URL}`)
      expect(urls).toContain(`${BASE_URL}/produtos`)
      expect(urls).toContain(`${BASE_URL}/sobre`)
      expect(urls).toContain(`${BASE_URL}/contato`)
      expect(urls).toContain(`${BASE_URL}/technocalhas`)
    })

    it('retorna pelo menos 5 entradas (estáticas) quando DB está vazio', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()

      expect(entries.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('produto inativo', () => {
    it('produto com status inativo NÃO aparece no sitemap (filtrado pela query Prisma)', async () => {
      // O filtro é feito pelo Prisma com where: { status: 'ativo' }
      // Produtos inativos não são retornados pela query mock
      mockProductFindMany.mockResolvedValueOnce([
        // Apenas produtos ativos são retornados pela query mockada
        { slug: 'produto-ativo', updatedAt: new Date('2026-06-01T00:00:00.000Z') },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const urls = entries.map((e) => e.url)

      // produto-inativo não deve aparecer (query filtra com where: { status: 'ativo' })
      expect(urls).not.toContain(`${BASE_URL}/produtos/produto-inativo`)
      expect(urls).toContain(`${BASE_URL}/produtos/produto-ativo`)
    })

    it('quando não há produtos ativos, sitemap ainda contém páginas estáticas', async () => {
      mockProductFindMany.mockResolvedValueOnce([])
      mockCategoryFindMany.mockResolvedValueOnce([])

      const entries = await sitemap()
      const urls = entries.map((e) => e.url)

      expect(urls).toContain(`${BASE_URL}`)
      expect(urls).toContain(`${BASE_URL}/produtos`)
    })
  })

  describe('estrutura completa do sitemap', () => {
    it('retorna sitemap combinando estáticas + produtos + categorias', async () => {
      const prodUpdatedAt = new Date('2026-05-20T00:00:00.000Z')
      const catUpdatedAt = new Date('2026-04-15T00:00:00.000Z')

      mockProductFindMany.mockResolvedValueOnce([
        { slug: 'parafuso-hex-m8', updatedAt: prodUpdatedAt },
      ])
      mockCategoryFindMany.mockResolvedValueOnce([
        { slug: 'fixadores', updatedAt: catUpdatedAt },
      ])

      const entries = await sitemap()
      const urls = entries.map((e) => e.url)

      // Estáticas
      expect(urls).toContain(`${BASE_URL}`)
      expect(urls).toContain(`${BASE_URL}/sobre`)
      // Produto dinâmico
      expect(urls).toContain(`${BASE_URL}/produtos/parafuso-hex-m8`)
      // Categoria dinâmica
      expect(urls).toContain(`${BASE_URL}/categorias/fixadores`)

      // Verificar lastModified do produto
      const prodEntry = entries.find((e) => e.url.includes('/produtos/parafuso-hex-m8'))
      expect(prodEntry?.lastModified).toEqual(prodUpdatedAt)

      // Verificar lastModified da categoria
      const catEntry = entries.find((e) => e.url.includes('/categorias/fixadores'))
      expect(catEntry?.lastModified).toEqual(catUpdatedAt)
    })
  })
})
