'use server'

import type { LeadPayload } from '@/lib/types'

export async function submitLead(
  _payload: LeadPayload
): Promise<{ success: boolean; error?: string }> {
  // task_07 substituirá este stub com persistência real no banco
  return { success: true }
}
