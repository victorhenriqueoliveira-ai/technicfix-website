/**
 * Testes unitários e de integração para SEO:
 * - generateMetadata de produtos
 * - metadata da homepage
 * - robots.ts
 * - sitemap.ts
 */

// Mock do cliente Prisma
const mockFindFirst = jest.fn()
const mockProductFindMany = jest.fn()
const mockCategoryFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    product: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
    },
    category: {
      findMany: (...args: unknown[]) => mockCategoryFindMany(...args),
    },
  },
}))

// ─── generateMetadata da página de produto ───────────────────────────────────

describe('generateMetadata — /produtos/[slug]', () => {
  beforeEach(() => {
    mockFindFirst.mockReset()
  })

  it('retorna title com o nome do produto quando o slug existe', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Parafuso Sextavado M8',
      description: 'Parafuso de alta resistência.',
      images: ['https://example.com/img.jpg'],
    })

    // Importação dinâmica para garantir mocks aplicados
    const { generateMetadata } = await import(
      '@/app/(public)/produtos/[slug]/page'
    )

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'parafuso-m8' }) })

    expect(result.title).toBe('Parafuso Sextavado M8 | Technicfix')
  })

  it('retorna metadados genéricos quando o slug não existe no banco', async () => {
    mockFindFirst.mockResolvedValue(null)

    const { generateMetadata } = await import(
      '@/app/(public)/produtos/[slug]/page'
    )

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'slug-invalido' }) })

    expect(result.title).toBe('Produto não encontrado | Technicfix')
  })

  it('inclui a primeira imagem como og:image quando o produto existe', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Porca Zincada M6',
      description: 'Porca de alta qualidade.',
      images: ['https://example.com/porca.jpg'],
    })

    const { generateMetadata } = await import(
      '@/app/(public)/produtos/[slug]/page'
    )

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'porca-m6' }) })

    expect(result.openGraph?.images).toEqual([{ url: 'https://example.com/porca.jpg' }])
  })

  it('retorna openGraph.images vazio quando o produto não tem imagens', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Produto Sem Imagem',
      description: null,
      images: [],
    })

    const { generateMetadata } = await import(
      '@/app/(public)/produtos/[slug]/page'
    )

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'sem-imagem' }) })

    expect(result.openGraph?.images).toEqual([])
  })

  it('trunca description para 155 caracteres', async () => {
    const longDescription = 'A'.repeat(200)
    mockFindFirst.mockResolvedValue({
      name: 'Produto Longo',
      description: longDescription,
      images: [],
    })

    const { generateMetadata } = await import(
      '@/app/(public)/produtos/[slug]/page'
    )

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'produto-longo' }) })

    expect((result.description as string).length).toBe(155)
  })
})

// ─── metadata da homepage ────────────────────────────────────────────────────

describe('metadata — homepage', () => {
  it('inclui propriedades Open Graph', async () => {
    const { metadata } = await import('@/app/(public)/page')

    expect(metadata).toBeDefined()
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeTruthy()
    expect(metadata.openGraph?.description).toBeTruthy()
  })

  it('inclui título e descrição', async () => {
    const { metadata } = await import('@/app/(public)/page')

    expect(metadata.title).toContain('Technicfix')
    expect(metadata.description).toBeTruthy()
  })
})

// ─── robots.ts ───────────────────────────────────────────────────────────────

describe('robots()', () => {
  it('bloqueia /admin', async () => {
    const { default: robots } = await import('@/app/robots')
    const result = robots()

    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    const hasDisallowAdmin = rules.some((rule) => {
      const disallow = Array.isArray(rule?.disallow) ? rule?.disallow : [rule?.disallow]
      return disallow.some((d) => d === '/admin' || d === '/admin/')
    })

    expect(hasDisallowAdmin).toBe(true)
  })

  it('permite / para todos os user agents', async () => {
    const { default: robots } = await import('@/app/robots')
    const result = robots()

    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    const hasAllowRoot = rules.some((rule) => {
      const allow = Array.isArray(rule?.allow) ? rule?.allow : [rule?.allow]
      return allow.some((a) => a === '/')
    })

    expect(hasAllowRoot).toBe(true)
  })

  it('inclui URL do sitemap', async () => {
    const { default: robots } = await import('@/app/robots')
    const result = robots()

    expect(result.sitemap).toContain('/sitemap.xml')
  })
})

// ─── sitemap.ts ──────────────────────────────────────────────────────────────

describe('sitemap()', () => {
  beforeEach(() => {
    jest.resetModules()
    mockProductFindMany.mockReset()
    mockCategoryFindMany.mockReset()
  })

  it('inclui URL do produto ativo', async () => {
    mockProductFindMany.mockResolvedValue([
      { slug: 'parafuso-m8', updatedAt: new Date('2025-01-01') },
    ])
    mockCategoryFindMany.mockResolvedValue([])

    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()

    const urls = entries.map((e) => e.url)
    expect(urls.some((u) => u.includes('/produtos/parafuso-m8'))).toBe(true)
  })

  it('inclui URL da categoria', async () => {
    mockProductFindMany.mockResolvedValue([])
    mockCategoryFindMany.mockResolvedValue([
      { slug: 'parafusos', updatedAt: new Date('2025-01-01') },
    ])

    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()

    const urls = entries.map((e) => e.url)
    expect(urls.some((u) => u.includes('/categorias/parafusos'))).toBe(true)
  })

  it('inclui URLs das páginas estáticas', async () => {
    mockProductFindMany.mockResolvedValue([])
    mockCategoryFindMany.mockResolvedValue([])

    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()

    const urls = entries.map((e) => e.url)
    expect(urls.some((u) => u.endsWith('/sobre'))).toBe(true)
    expect(urls.some((u) => u.endsWith('/contato'))).toBe(true)
    expect(urls.some((u) => u.endsWith('/technocalhas'))).toBe(true)
    expect(urls.some((u) => u.endsWith('/produtos'))).toBe(true)
  })

  it('não inclui produtos inativos (apenas ativo é buscado)', async () => {
    // A query no sitemap.ts já filtra where: { status: 'ativo' }
    // Aqui verificamos que o mock retorna apenas os resultados passados
    mockProductFindMany.mockResolvedValue([
      { slug: 'produto-ativo', updatedAt: new Date('2025-01-01') },
    ])
    mockCategoryFindMany.mockResolvedValue([])

    const { default: sitemap } = await import('@/app/sitemap')
    const entries = await sitemap()

    const productUrls = entries.filter((e) => e.url.includes('/produtos/'))
    expect(productUrls).toHaveLength(1)
    expect(productUrls[0].url).toContain('/produtos/produto-ativo')
  })

  it('verifica que a query busca apenas produtos com status ativo', async () => {
    mockProductFindMany.mockResolvedValue([])
    mockCategoryFindMany.mockResolvedValue([])

    const { default: sitemap } = await import('@/app/sitemap')
    await sitemap()

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'ativo' }),
      })
    )
  })
})
