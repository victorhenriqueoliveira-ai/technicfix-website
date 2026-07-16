import type {
  LeadType,
  LeadStatus,
  ProductStatus,
  ProductSummary,
  CategorySummary,
  CategoryWithProducts,
  LeadPayload,
  SiteConfig,
} from '@/lib/types'

describe('lib/types.ts exports', () => {
  it('LeadType accepts valid values', () => {
    const values: LeadType[] = ['varejo', 'atacado', 'geral']
    expect(values).toHaveLength(3)
  })

  it('LeadStatus accepts valid values', () => {
    const values: LeadStatus[] = ['novo', 'em_atendimento', 'convertido', 'perdido']
    expect(values).toHaveLength(4)
  })

  it('ProductStatus accepts valid values', () => {
    const values: ProductStatus[] = ['ativo', 'inativo']
    expect(values).toHaveLength(2)
  })

  it('ProductSummary has required shape', () => {
    const product: ProductSummary = {
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      images: ['image.jpg'],
      category: { name: 'Category', slug: 'category' },
      featured: false,
      showPrice: true,
    }
    expect(product.id).toBe('1')
    expect(product.price).toBe(99.99)
    expect(product.category.slug).toBe('category')
    expect(product.showPrice).toBe(true)
  })

  it('ProductSummary price can be null', () => {
    const product: ProductSummary = {
      id: '2',
      name: 'No Price',
      slug: 'no-price',
      price: null,
      images: [],
      category: { name: 'Cat', slug: 'cat' },
      featured: true,
      showPrice: true,
    }
    expect(product.price).toBeNull()
  })

  it('ProductSummary com showPrice: true mantém todos os campos anteriores', () => {
    const product: ProductSummary = {
      id: '3',
      name: 'Produto Com Preço',
      slug: 'produto-com-preco',
      price: 49.99,
      images: ['img.jpg'],
      category: { name: 'Fixadores', slug: 'fixadores' },
      featured: false,
      showPrice: true,
    }
    expect(product.showPrice).toBe(true)
    expect(product.price).toBe(49.99)
    expect(product.images).toHaveLength(1)
  })

  it('ProductSummary com showPrice: false é válido como tipo', () => {
    const product: ProductSummary = {
      id: '4',
      name: 'Produto Sem Preço Visível',
      slug: 'produto-sem-preco-visivel',
      price: 30.0,
      images: [],
      category: { name: 'Parafusos', slug: 'parafusos' },
      featured: false,
      showPrice: false,
    }
    expect(product.showPrice).toBe(false)
  })

  it('CategorySummary com children: [] serializa corretamente', () => {
    const cat: CategorySummary = {
      id: 'cat-1',
      name: 'Parafusar',
      slug: 'parafusar',
      imageUrl: null,
      children: [],
    }
    expect(cat.children).toHaveLength(0)
    expect(JSON.parse(JSON.stringify(cat)).children).toEqual([])
  })

  it('CategorySummary com children populados preserva campos dos filhos', () => {
    const filho: CategorySummary = {
      id: 'cat-filho-1',
      name: 'Parafuso Allen',
      slug: 'parafuso-allen',
      imageUrl: 'https://example.com/allen.jpg',
      children: [],
    }
    const pai: CategorySummary = {
      id: 'cat-pai-1',
      name: 'Parafusar',
      slug: 'parafusar',
      imageUrl: null,
      children: [filho],
    }
    expect(pai.children).toHaveLength(1)
    expect(pai.children[0].name).toBe('Parafuso Allen')
    expect(pai.children[0].imageUrl).toBe('https://example.com/allen.jpg')
  })

  it('CategoryWithProducts com products: [] é aceito sem erro de tipo', () => {
    const catWithProds: CategoryWithProducts = {
      id: 'cat-2',
      name: 'Fixadores',
      slug: 'fixadores',
      products: [],
    }
    expect(catWithProds.products).toHaveLength(0)
  })

  it('LeadPayload has required and optional fields', () => {
    const lead: LeadPayload = {
      type: 'geral',
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '11999999999',
    }
    expect(lead.type).toBe('geral')
    expect(lead.productId).toBeUndefined()
  })

  it('LeadPayload accepts all optional fields', () => {
    const lead: LeadPayload = {
      type: 'atacado',
      name: 'Empresa LTDA',
      email: 'empresa@example.com',
      phone: '11988888888',
      productId: 'prod-123',
      companyName: 'Empresa LTDA',
      cnpj: '00.000.000/0001-00',
      estimatedVolume: '1000',
      desiredDeadline: '2024-12-31',
      message: 'Preciso de orçamento',
    }
    expect(lead.cnpj).toBe('00.000.000/0001-00')
  })

  it('SiteConfig has required shape', () => {
    const config: SiteConfig = {
      storeName: 'TechnicFix',
      whatsappNumber: '5511999999999',
      contactEmail: 'contato@technicfix.com.br',
      technocalhasUrl: 'https://technocalhas.com.br',
      technocalhasDescription: 'Empresa parceira',
    }
    expect(config.storeName).toBe('TechnicFix')
  })
})
