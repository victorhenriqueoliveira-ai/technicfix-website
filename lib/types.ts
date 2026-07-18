import type { Decimal } from '@prisma/client/runtime/client'

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

export interface ProductNavItem {
  name: string
  slug: string
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
  badge: string | null
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

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  price: Decimal | number | null
  images: string[]
  featured: boolean
  showPrice: boolean
  category: { name: string; slug: string }
}

export interface LeadsByDay {
  date: string
  total: number
}

export interface LeadsByType {
  date: string
  varejo: number
  atacado: number
  geral: number
}

export interface LeadFunnel {
  status: string
  count: number
}
