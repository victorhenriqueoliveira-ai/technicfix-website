'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'

export const configSchema = z.object({
  storeName: z.string().min(2, 'Nome da loja deve ter ao menos 2 caracteres'),
  whatsappNumber: z
    .string()
    .regex(/^\d{10,11}$/, 'Número deve ter 10 ou 11 dígitos numéricos'),
  contactEmail: z.string().email('E-mail inválido'),
  technocalhasUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  technocalhasDescription: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
})

export type ConfigFormData = z.infer<typeof configSchema>

export async function updateSiteConfig(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const raw = {
    storeName: formData.get('storeName'),
    whatsappNumber: formData.get('whatsappNumber'),
    contactEmail: formData.get('contactEmail'),
    technocalhasUrl: formData.get('technocalhasUrl'),
    technocalhasDescription: formData.get('technocalhasDescription'),
  }

  const result = configSchema.safeParse(raw)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const data = result.data

  await db.siteConfig.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  })

  revalidatePath('/')
  revalidatePath('/technocalhas')
  revalidatePath('/admin/configuracoes')

  return { success: true }
}
