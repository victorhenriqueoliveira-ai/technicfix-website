'use server'

import { db } from '@/lib/prisma'
import { leadSchema } from '@/lib/validations/lead'
import type { LeadPayload } from '@/lib/types'

export async function submitLead(
  payload: LeadPayload
): Promise<{ success: boolean; error?: string }> {
  const result = leadSchema.safeParse(payload)

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const data = result.data

  // Normaliza o CNPJ removendo a máscara antes de persistir
  const dataToSave =
    data.type === 'atacado'
      ? { ...data, cnpj: data.cnpj.replace(/\D/g, '') }
      : data

  await db.lead.create({ data: dataToSave })

  return { success: true }
}
