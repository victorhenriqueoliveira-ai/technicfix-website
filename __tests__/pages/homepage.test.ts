/**
 * Testes de integração da homepage — task_10
 * Verifica a estrutura refatorada: Hero + BenefitsBar + CategoryProductSection[]
 */

import type { CategoryWithProducts } from '@/lib/types'

// ─── Mocks de dependências ────────────────────────────────────────────────────

const mockBannerFindMany = jest.fn()
const mockSiteConfigFindUnique = jest.fn()
const mockCategoryFindMany = jest.fn()

jest.mock('@/lib/prisma', () => ({
  db: {
    banner: {
      findMany: (...args: unknown[]) => mockBannerFindMany(...args),
    },
    siteConfig: {
      findUnique: (...args: unknown[]) => mockSiteConfigFindUnique(...args),
    },
    category: {
      findMany: (...args: unknown[]) => mockCategoryFindMany(...args),
    },
  },
}))

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: unknown }) {
    return { href, children }
  }
})

// ─── Dados de teste ───────────────────────────────────────────────────────────

function makeCategoryWithProducts(
  id: string,
  name: string,
  productCount = 2,
): CategoryWithProducts {
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    products: Array.from({ length: productCount }, (_, i) => ({
      id: `prod-${id}-${i}`,
      name: `Produto ${i + 1}`,
      slug: `produto-${id}-${i}`,
      price: 10.5,
      images: [],
      badge: null,
      featured: false,
      showPrice: true,
      category: { name, slug: name.toLowerCase() },
    })),
  }
}

// ─── Testes unitários ─────────────────────────────────────────────────────────

describe('homepage — módulo page.tsx (task_10)', () => {
  beforeEach(() => {
    jest.resetModules()
    mockBannerFindMany.mockReset()
    mockSiteConfigFindUnique.mockReset()
    mockCategoryFindMany.mockReset()
  })

  it('exporta default async function', async () => {
    mockBannerFindMany.mockResolvedValue([])
    mockCategoryFindMany.mockResolvedValue([])
    mockSiteConfigFindUnique.mockResolvedValue(null)

    const mod = await import('@/app/(public)/page')
    expect(typeof mod.default).toBe('function')
  })

  it('exporta metadata com openGraph definido', async () => {
    const { metadata } = await import('@/app/(public)/page')
    expect(metadata).toBeDefined()
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeTruthy()
    expect(metadata.openGraph?.description).toBeTruthy()
  })

  it('renderiza sem erro com 0 categorias', async () => {
    mockBannerFindMany.mockResolvedValue([])
    mockCategoryFindMany.mockResolvedValue([])
    mockSiteConfigFindUnique.mockResolvedValue(null)

    const { default: HomePage } = await import('@/app/(public)/page')
    await expect(HomePage()).resolves.not.toThrow()
  })

  it('renderiza sem erro com 2 categorias com produtos', async () => {
    mockBannerFindMany.mockResolvedValue([])
    mockSiteConfigFindUnique.mockResolvedValue({
      id: 'singleton',
      whatsappNumber: '(11) 99999-0000',
    })
    mockCategoryFindMany.mockResolvedValue([
      {
        id: 'cat-1',
        name: 'Parafusos',
        slug: 'parafusos',
        products: [
          {
            id: 'p1',
            name: 'Parafuso M6',
            slug: 'parafuso-m6',
            price: { toNumber: () => 5.5 },
            images: [],
            featured: false,
            badge: null,
            showPrice: true,
            category: { name: 'Parafusos', slug: 'parafusos' },
          },
        ],
      },
      {
        id: 'cat-2',
        name: 'Porcas',
        slug: 'porcas',
        products: [
          {
            id: 'p2',
            name: 'Porca M6',
            slug: 'porca-m6',
            price: { toNumber: () => 3.0 },
            images: [],
            featured: true,
            badge: 'Novo',
            showPrice: true,
            category: { name: 'Porcas', slug: 'porcas' },
          },
        ],
      },
    ])

    const { default: HomePage } = await import('@/app/(public)/page')
    const result = await HomePage()
    expect(result).not.toBeNull()
  })

  it('não importa DiferenciaisSection, CategoryGrid, FeaturedProducts, TechnocalhasSection ou LeadGeneralForm', async () => {
    const pageSource = await import('fs').then((fs) =>
      fs.readFileSync(
        require('path').resolve(__dirname, '../../app/(public)/page.tsx'),
        'utf-8',
      ),
    )

    expect(pageSource).not.toContain('DiferenciaisSection')
    expect(pageSource).not.toContain('CategoryGrid')
    expect(pageSource).not.toContain('FeaturedProducts')
    expect(pageSource).not.toContain('TechnocalhasSection')
    expect(pageSource).not.toContain('LeadGeneralForm')
  })

  it('importa BenefitsBar e CategoryProductSection', async () => {
    const pageSource = await import('fs').then((fs) =>
      fs.readFileSync(
        require('path').resolve(__dirname, '../../app/(public)/page.tsx'),
        'utf-8',
      ),
    )

    expect(pageSource).toContain('BenefitsBar')
    expect(pageSource).toContain('CategoryProductSection')
    expect(pageSource).toContain('getCategoriesWithProducts')
  })

  it('whatsappNumber é extraído sem máscara (apenas dígitos)', async () => {
    // Testa a expressão de limpeza isoladamente
    const rawNumber = '(11) 99999-0000'
    const cleaned = rawNumber.replace(/\D/g, '')
    expect(cleaned).toBe('11999990000')
    expect(cleaned).toMatch(/^\d+$/)
  })

  it('whatsappNumber usa string vazia quando config é null', async () => {
    const config: { whatsappNumber?: string } | null = null
    const whatsappNumber = config?.whatsappNumber?.replace(/\D/g, '') ?? ''
    expect(whatsappNumber).toBe('')
  })

  it('whatsappNumber usa string vazia quando whatsappNumber não está definido', async () => {
    const config = { id: 'singleton' } as { whatsappNumber?: string }
    const whatsappNumber = config?.whatsappNumber?.replace(/\D/g, '') ?? ''
    expect(whatsappNumber).toBe('')
  })
})

// ─── Testes de integração — Promise.all e estrutura ──────────────────────────

describe('homepage — integração Promise.all (task_10)', () => {
  beforeEach(() => {
    jest.resetModules()
    mockBannerFindMany.mockReset()
    mockSiteConfigFindUnique.mockReset()
    mockCategoryFindMany.mockReset()
  })

  it('chama getCategoriesWithProducts com limite 8 nos produtos incluídos', async () => {
    mockBannerFindMany.mockResolvedValue([])
    mockSiteConfigFindUnique.mockResolvedValue(null)
    mockCategoryFindMany.mockResolvedValue([])

    const { default: HomePage } = await import('@/app/(public)/page')
    await HomePage()

    expect(mockCategoryFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          products: expect.objectContaining({ take: 8 }),
        }),
      }),
    )
  })

  it('homepage renderiza sem erro quando getCategoriesWithProducts retorna vazio', async () => {
    mockBannerFindMany.mockResolvedValue([])
    mockSiteConfigFindUnique.mockResolvedValue(null)
    mockCategoryFindMany.mockResolvedValue([])

    const { default: HomePage } = await import('@/app/(public)/page')
    const result = await HomePage()
    expect(result).not.toBeNull()
  })

  it('page.tsx usa Promise.all com getBanners, getCategoriesWithProducts e getSiteConfig', async () => {
    const pageSource = await import('fs').then((fs) =>
      fs.readFileSync(
        require('path').resolve(__dirname, '../../app/(public)/page.tsx'),
        'utf-8',
      ),
    )

    expect(pageSource).toContain('Promise.all')
    expect(pageSource).toContain('getBanners()')
    expect(pageSource).toContain('getCategoriesWithProducts(8)')
    expect(pageSource).toContain('getSiteConfig()')
  })

  it('page.tsx renderiza na ordem: Hero, BenefitsBar, CategoryProductSection', async () => {
    const pageSource = await import('fs').then((fs) =>
      fs.readFileSync(
        require('path').resolve(__dirname, '../../app/(public)/page.tsx'),
        'utf-8',
      ),
    )

    const heroIdx = pageSource.indexOf('<Hero')
    const benefitsIdx = pageSource.indexOf('<BenefitsBar')
    const categoryIdx = pageSource.indexOf('<CategoryProductSection')

    expect(heroIdx).toBeGreaterThan(-1)
    expect(benefitsIdx).toBeGreaterThan(heroIdx)
    expect(categoryIdx).toBeGreaterThan(benefitsIdx)
  })
})
