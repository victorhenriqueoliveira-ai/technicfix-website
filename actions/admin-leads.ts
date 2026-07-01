'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'
import type { LeadStatus } from '@/lib/types'

const statusValidos: LeadStatus[] = ['novo', 'em_atendimento', 'convertido', 'perdido']

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!statusValidos.includes(status)) {
    throw new Error(`Status inválido: ${status}`)
  }

  await db.lead.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${id}`)
}

export async function updateLeadNotes(id: string, notes: string): Promise<void> {
  await db.lead.update({
    where: { id },
    data: { notes },
  })

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${id}`)
}
