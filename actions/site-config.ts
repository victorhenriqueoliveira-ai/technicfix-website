'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'
import { configSchema } from '@/lib/schemas/site-config'

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
