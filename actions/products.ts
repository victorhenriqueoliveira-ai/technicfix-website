'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { db } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

// ─── Schema de validação ──────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional().default(''),
  technicalDetails: z.string().optional(),
  price: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  featured: z.boolean().default(false),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
  images: z.array(z.string().url()).default([]),
  showPrice: z.boolean().default(true),
  productType: z.enum(['varejo', 'atacado', 'ambos']).default('ambos'),
  relatedProductIds: z.array(z.string()).default([]),
})

export type ProductActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

// ─── Helpers internos ─────────────────────────────────────────────────────────

function parseFormData(formData: FormData) {
  const imagesRaw = formData.get('images') as string | null
  const relatedRaw = formData.get('relatedProductIds') as string | null
  return {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    description: (formData.get('description') as string) || '',
    technicalDetails: (formData.get('technicalDetails') as string) || undefined,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    sku: (formData.get('sku') as string) || undefined,
    stock: Number(formData.get('stock') ?? 0),
    categoryId: formData.get('categoryId') as string,
    featured: formData.get('featured') === 'true',
    status: (formData.get('status') as 'ativo' | 'inativo') || 'ativo',
    images: imagesRaw ? (JSON.parse(imagesRaw) as string[]) : [],
    showPrice: formData.get('showPrice') === 'on',
    productType: (formData.get('productType') as 'varejo' | 'atacado' | 'ambos') || 'ambos',
    relatedProductIds: relatedRaw ? (JSON.parse(relatedRaw) as string[]) : [],
  }
}

function revalidateAll() {
  revalidatePath('/admin/produtos')
  revalidatePath('/')
  revalidatePath('/produtos')
}

// ─── createProduct ────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData): Promise<ProductActionResult> {
  const raw = parseFormData(formData)
  const result = productSchema.safeParse(raw)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { name, slug, description, technicalDetails, price, sku, stock, categoryId, featured, status, images, showPrice, productType, relatedProductIds } =
    result.data

  const existing = await db.product.findUnique({ where: { slug } })
  if (existing) {
    return { success: false, error: `Já existe um produto com o slug "${slug}".` }
  }

  if (sku) {
    const existingSku = await db.product.findUnique({ where: { sku } })
    if (existingSku) {
      return { success: false, error: `Já existe um produto com o SKU "${sku}".` }
    }
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      technicalDetails: technicalDetails ?? null,
      price: price ?? null,
      sku: sku || null,
      stock,
      categoryId,
      featured,
      status,
      images,
      showPrice,
      productType,
      relatedProductIds,
    },
  })

  revalidateAll()
  return { success: true, id: product.id }
}

// ─── updateProduct ────────────────────────────────────────────────────────────

export async function updateProduct(id: string, formData: FormData): Promise<ProductActionResult> {
  const raw = parseFormData(formData)
  const result = productSchema.safeParse(raw)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { name, slug, description, technicalDetails, price, sku, stock, categoryId, featured, status, images, showPrice, productType, relatedProductIds } =
    result.data

  const existing = await db.product.findFirst({ where: { slug, NOT: { id } } })
  if (existing) {
    return { success: false, error: `Já existe outro produto com o slug "${slug}".` }
  }

  if (sku) {
    const existingSku = await db.product.findFirst({ where: { sku, NOT: { id } } })
    if (existingSku) {
      return { success: false, error: `Já existe outro produto com o SKU "${sku}".` }
    }
  }

  const product = await db.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      technicalDetails: technicalDetails ?? null,
      price: price ?? null,
      sku: sku || null,
      stock,
      categoryId,
      featured,
      status,
      images,
      showPrice,
      productType,
      relatedProductIds,
    },
  })

  revalidateAll()
  return { success: true, id: product.id }
}

// ─── deleteProduct ────────────────────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  const product = await db.product.findUnique({ where: { id } })

  if (!product) {
    return { success: false, error: 'Produto não encontrado.' }
  }

  await db.lead.updateMany({
    where: { productId: id },
    data: { productId: null },
  })

  await db.sale.deleteMany({ where: { productId: id } })

  await db.product.delete({ where: { id } })

  revalidateAll()
  return { success: true, id }
}

// ─── getPresignedUploadUrl ────────────────────────────────────────────────────

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  sizeBytes?: number
): Promise<{ url: string; key: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(contentType)) {
    return { error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.' }
  }

  if (sizeBytes !== undefined && sizeBytes > MAX_SIZE_BYTES) {
    return { error: 'Arquivo muito grande. Tamanho máximo: 5MB.' }
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  const key = `products/${Date.now()}-${filename}`
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  )

  return { url, key }
}
