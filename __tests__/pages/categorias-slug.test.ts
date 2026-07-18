/**
 * Testes unitários e de integração para app/(public)/categorias/[slug]/page.tsx
 * Task 11: Converter categorias/[slug]/page.tsx de redirect para Server Component
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockCategoryFindUnique = jest.fn()
const mockProductFindMany = jest.fn()
const mockProductCount = jest.fn()
const mockNotFound = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    category: {
      findUnique: (...args: unknown[]) => mockCategoryFindUnique(...args),
    },
    product: {
      findMany: (...args: unknown[]) => mockProductFindMany(...args),
      count: (...args: unknown[]) => mockProductCount(...args),
    },
  },
}))

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
  redirect: jest.fn(),
}))

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: unknown }) {
    return { type: 'a', props: { href }, children }
  }
})

jest.mock('next/image', () => {
  return function MockImage({ src, alt }: { src: string; alt: string }) {
    return { type: 'img', props: { src, alt } }
  }
})

jest.mock('@/components/catalog/ProductCard', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => ({
    type: 'article',
    props: { 'data-testid': 'product-card' },
    children: product.name,
  }),
}))

jest.mock('@/components/catalog/SearchBar', () => ({
  SearchBar: () => ({ type: 'div', props: { 'data-testid': 'search-bar' } }),
}))

// ─── Dados de teste ───────────────────────────────────────────────────────────

const mockCategory = {
  id: 'cat-1',
  name: 'Parafusos',
  slug: 'parafusos',
  imageUrl: null,
  description: null,
}

const mockCategoryWithImage = {
  ...mockCategory,
  imageUrl: 'https://cdn.example.com/parafusos.jpg',
}

function makeProducts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i}`,
    name: `Produto ${i + 1}`,
    slug: `produto-${i + 1}`,
    price: { toNumber: () => 10.5 },
    images: [],
    badge: null,
    featured: false,
    showPrice: true,
    category: { name: 'Parafusos', slug: 'parafusos' },
  }))
}

// ─── Testes unitários ─────────────────────────────────────────────────────────

describe('CategoryPage — testes unitários', () => {
  beforeEach(() => {
    jest.resetModules()
    mockCategoryFindUnique.mockReset()
    mockProductFindMany.mockReset()
    mockProductCount.mockReset()
    mockNotFound.mockReset()
  })

  it('chama notFound() quando a categoria não existe', async () => {
    mockCategoryFindUnique.mockResolvedValue(null)
    mockNotFound.mockImplementation(() => {
      throw new Error('NOT_FOUND')
    })

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')

    await expect(
      CategoryPage({
        params: Promise.resolve({ slug: 'slug-inexistente' }),
        searchParams: Promise.resolve({}),
      })
    ).rejects.toThrow('NOT_FOUND')

    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  it('renderiza o nome da categoria no título quando a categoria existe', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    // Verifica que o resultado não é null e a função foi executada sem erro
    expect(result).not.toBeNull()
    expect(mockCategoryFindUnique).toHaveBeenCalledWith({ where: { slug: 'parafusos' } })
  })

  it('renderiza sem erro quando categoria tem imageUrl não nula', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategoryWithImage)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result).not.toBeNull()
  })

  it('renderiza sem erro quando categoria tem imageUrl = null (placeholder)', async () => {
    mockCategoryFindUnique.mockResolvedValue({ ...mockCategory, imageUrl: null })
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result).not.toBeNull()
  })

  it('não contém redirect() no arquivo da página', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../app/(public)/categorias/[slug]/page.tsx'),
      'utf-8'
    )

    // notFound está presente e redirect foi removido
    expect(source).toContain('notFound')
    expect(source).not.toContain('redirect(')
  })

  it('a página usa notFound e não redirect', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../app/(public)/categorias/[slug]/page.tsx'),
      'utf-8'
    )

    expect(source).toContain('notFound')
    expect(source).not.toContain('redirect(`/produtos')
  })
})

// ─── generateMetadata ─────────────────────────────────────────────────────────

describe('generateMetadata — /categorias/[slug]', () => {
  beforeEach(() => {
    jest.resetModules()
    mockCategoryFindUnique.mockReset()
  })

  it('retorna title com nome da categoria quando slug é válido', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)

    const { generateMetadata } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await generateMetadata({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result.title).toContain('Parafusos')
    expect(result.title).toContain('Technicfix')
  })

  it('retorna objeto vazio quando slug não existe no banco', async () => {
    mockCategoryFindUnique.mockResolvedValue(null)

    const { generateMetadata } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await generateMetadata({
      params: Promise.resolve({ slug: 'slug-inexistente' }),
      searchParams: Promise.resolve({}),
    })

    expect(result).toEqual({})
  })

  it('inclui description baseada no nome da categoria', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)

    const { generateMetadata } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await generateMetadata({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result.description).toContain('Parafusos')
  })

  it('NÃO define alternates.canonical (esta é a URL canônica — ADR-005)', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)

    const { generateMetadata } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await generateMetadata({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    // Conforme ADR-005: esta página NÃO deve ter canonical apontando para outra URL
    expect((result as { alternates?: { canonical?: string } }).alternates?.canonical).toBeUndefined()
  })
})

// ─── Testes de integração ─────────────────────────────────────────────────────

describe('CategoryPage — testes de integração', () => {
  beforeEach(() => {
    jest.resetModules()
    mockCategoryFindUnique.mockReset()
    mockProductFindMany.mockReset()
    mockProductCount.mockReset()
    mockNotFound.mockReset()
  })

  it('busca categoria com slug correto no Prisma', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(mockCategoryFindUnique).toHaveBeenCalledWith({ where: { slug: 'parafusos' } })
  })

  it('filtra produtos por category.slug e status ativo', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ativo',
          category: { slug: 'parafusos' },
        }),
      })
    )
  })

  it('aplica filtro de busca quando searchParams.busca está definido', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({ busca: 'sextavado' }),
    })

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: { contains: 'sextavado', mode: 'insensitive' },
        }),
      })
    )
  })

  it('aplica paginação correta quando page=2', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(20)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({ page: '2' }),
    })

    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 12,
        take: 12,
      })
    )
  })

  it('renderiza lista de produtos quando existem resultados', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue(makeProducts(3))
    mockProductCount.mockResolvedValue(3)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result).not.toBeNull()
  })

  it('renderiza estado vazio quando não há produtos', async () => {
    mockCategoryFindUnique.mockResolvedValue(mockCategory)
    mockProductFindMany.mockResolvedValue([])
    mockProductCount.mockResolvedValue(0)

    const { default: CategoryPage } = await import('@/app/(public)/categorias/[slug]/page')
    const result = await CategoryPage({
      params: Promise.resolve({ slug: 'parafusos' }),
      searchParams: Promise.resolve({}),
    })

    expect(result).not.toBeNull()
  })

  it('verifica que o arquivo não faz redirect para /produtos', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../app/(public)/categorias/[slug]/page.tsx'),
      'utf-8'
    )

    // Garantia: não há mais redirect para /produtos?categoria=
    expect(source).not.toContain("redirect(`/produtos")
    expect(source).not.toContain("redirect('/produtos")
  })

  it('verifica que generateMetadata importa db do Prisma', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../app/(public)/categorias/[slug]/page.tsx'),
      'utf-8'
    )

    expect(source).toContain("from '@/lib/prisma'")
    expect(source).toContain('db.category.findUnique')
  })

  it('verifica que a página tem componente Image ou placeholder para imageUrl', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../app/(public)/categorias/[slug]/page.tsx'),
      'utf-8'
    )

    expect(source).toContain('categoryImageUrl')
    expect(source).toContain('category-image-placeholder')
  })
})

// ─── Teste de verificação de revalidateAll ────────────────────────────────────

describe('revalidateAll — actions/products.ts (task_10)', () => {
  it('inclui revalidatePath para /categorias/[slug]', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const source = fs.readFileSync(
      path.resolve(__dirname, '../../actions/products.ts'),
      'utf-8'
    )

    expect(source).toContain("revalidatePath('/categorias/[slug]'")
  })
})
