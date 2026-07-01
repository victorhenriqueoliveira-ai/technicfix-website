import type {
  LeadType,
  LeadStatus,
  ProductStatus,
  ProductSummary,
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
    }
    expect(product.id).toBe('1')
    expect(product.price).toBe(99.99)
    expect(product.category.slug).toBe('category')
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
    }
    expect(product.price).toBeNull()
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
