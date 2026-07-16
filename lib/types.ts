export type LeadType = 'varejo' | 'atacado' | 'geral'
export type LeadStatus = 'novo' | 'em_atendimento' | 'convertido' | 'perdido'
export type ProductStatus = 'ativo' | 'inativo'

export interface CategorySummary {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: CategorySummary[]
}

export interface CategoryWithProducts {
  id: string
  name: string
  slug: string
  products: ProductSummary[]
}

export interface ProductSummary {
  id: string
  name: string
  slug: string
  price: number | null
  images: string[]
  category: { name: string; slug: string }
  featured: boolean
  showPrice: boolean
}

export interface LeadPayload {
  type: LeadType
  name: string
  email: string
  phone: string
  productId?: string
  companyName?: string
  cnpj?: string
  estimatedVolume?: string
  desiredDeadline?: string
  message?: string
}

export interface SiteConfig {
  storeName: string
  whatsappNumber: string
  contactEmail: string
  technocalhasUrl: string
  technocalhasDescription: string
}
