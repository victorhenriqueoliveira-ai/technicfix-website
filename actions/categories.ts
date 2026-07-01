'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter no mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
})

export type CategoryActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createCategory(formData: FormData): Promise<CategoryActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    imageUrl: (formData.get('imageUrl') as string) || '',
  }

  const result = categorySchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { name, slug, imageUrl } = result.data

  const existing = await db.category.findUnique({ where: { slug } })
  if (existing) {
    return { success: false, error: `Já existe uma categoria com o slug "${slug}".` }
  }

  const category = await db.category.create({
    data: {
      name,
      slug,
      imageUrl: imageUrl || null,
    },
  })

  revalidatePath('/admin/categorias')
  revalidatePath('/produtos')

  return { success: true, id: category.id }
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<CategoryActionResult> {
  const raw = {
    name: formData.get('name') as string,
    slug: (formData.get('slug') as string) || slugify(formData.get('name') as string),
    imageUrl: (formData.get('imageUrl') as string) || '',
  }

  const result = categorySchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { name, slug, imageUrl } = result.data

  const existing = await db.category.findFirst({
    where: { slug, NOT: { id } },
  })
  if (existing) {
    return { success: false, error: `Já existe outra categoria com o slug "${slug}".` }
  }

  const category = await db.category.update({
    where: { id },
    data: {
      name,
      slug,
      imageUrl: imageUrl || null,
    },
  })

  revalidatePath('/admin/categorias')
  revalidatePath('/produtos')

  return { success: true, id: category.id }
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  const category = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })

  if (!category) {
    return { success: false, error: 'Categoria não encontrada.' }
  }

  if (category._count.products > 0) {
    return {
      success: false,
      error: `Categoria possui ${category._count.products} produto(s). Remova ou mova os produtos antes de excluir.`,
    }
  }

  await db.category.delete({ where: { id } })

  revalidatePath('/admin/categorias')
  revalidatePath('/produtos')

  return { success: true, id }
}
