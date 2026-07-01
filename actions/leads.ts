'use server'

// Stub da Server Action submitLead — será substituído pela task_07 com validação real no banco
export interface SubmitLeadInput {
  type: 'geral' | 'orcamento' | 'catalogo'
  name: string
  email: string
  phone: string
  message?: string
  productId?: string
}

export interface SubmitLeadResult {
  success: boolean
  error?: string
}

export async function submitLead(data: SubmitLeadInput): Promise<SubmitLeadResult> {
  // TODO: task_07 substituirá este stub com persistência real no banco
  void data
  return { success: true }
}
