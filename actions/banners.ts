'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/prisma'

const bannerSchema = z.object({
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  active: z.boolean().optional().default(true),
})

export async function createBanner(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const raw = {
    imageUrl: formData.get('imageUrl') as string,
    title: formData.get('title') as string,
    subtitle: (formData.get('subtitle') as string) || undefined,
    ctaText: (formData.get('ctaText') as string) || undefined,
    ctaUrl: (formData.get('ctaUrl') as string) || undefined,
    active: formData.get('active') === 'true' || formData.get('active') === 'on',
  }

  const result = bannerSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const maxOrderRecord = await db.banner.findFirst({ orderBy: { order: 'desc' } })
  const nextOrder = maxOrderRecord ? maxOrderRecord.order + 1 : 0

  await db.banner.create({
    data: {
      ...result.data,
      order: nextOrder,
    },
  })

  revalidatePath('/')
  return { success: true }
}

export async function updateBanner(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const raw = {
    imageUrl: formData.get('imageUrl') as string,
    title: formData.get('title') as string,
    subtitle: (formData.get('subtitle') as string) || undefined,
    ctaText: (formData.get('ctaText') as string) || undefined,
    ctaUrl: (formData.get('ctaUrl') as string) || undefined,
    active: formData.get('active') === 'true' || formData.get('active') === 'on',
  }

  const result = bannerSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  await db.banner.update({
    where: { id },
    data: result.data,
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteBanner(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await db.banner.delete({ where: { id } })

  revalidatePath('/')
  return { success: true }
}

export async function reorderBanners(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.banner.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  revalidatePath('/')
  return { success: true }
}

export async function getBanners() {
  return db.banner.findMany({ orderBy: { order: 'asc' } })
}
