'use server'

import { Resend } from 'resend'
import { db } from '@/lib/prisma'
import { leadSchema } from '@/lib/validations/lead'
import type { LeadPayload } from '@/lib/types'
import { env } from '@/lib/env'

// Inicializa o cliente Resend no nível de módulo
const resend = new Resend(env.RESEND_API_KEY)

/**
 * Helper interno de retry com backoff exponencial para envio de email via Resend.
 * Tenta até `maxAttempts` vezes em caso de exceção.
 * Delays: 1000ms antes da tentativa 2, 2000ms antes da tentativa 3.
 */
async function sendEmailWithRetry(
  payload: Parameters<typeof resend.emails.send>[0],
  leadId: string,
  maxAttempts = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await resend.emails.send(payload)
      return
    } catch (err) {
      if (attempt < maxAttempts) {
        console.error({ event: 'resend_retry', attempt, leadId })
        await new Promise(r => setTimeout(r, attempt * 1000))
      } else {
        console.error({ event: 'resend_exhausted', leadId, error: err })
      }
    }
  }
}

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

  const lead = await db.lead.create({ data: dataToSave })

  // Envia e-mail de notificação de forma silenciosa (falha não bloqueia o retorno)
  if (env.RESEND_API_KEY) {
    const config = await db.siteConfig.findUnique({ where: { id: 'singleton' } })

    if (config?.contactEmail) {
      const tipoLabel =
        dataToSave.type === 'atacado'
          ? 'Atacado'
          : dataToSave.type === 'varejo'
            ? 'Varejo'
            : 'Geral'

      let corpo =
        `Tipo: ${tipoLabel}\n` +
        `Nome: ${dataToSave.name}\n` +
        `Email: ${dataToSave.email}\n` +
        `Telefone: ${dataToSave.phone}`

      if (dataToSave.type === 'atacado') {
        const dadosAtacado = dataToSave as typeof dataToSave & { company?: string; cnpj?: string }
        if (dadosAtacado.company) corpo += `\nEmpresa: ${dadosAtacado.company}`
        if (dadosAtacado.cnpj) corpo += `\nCNPJ: ${dadosAtacado.cnpj}`
      }

      // fire-and-forget — não bloqueia a resposta ao visitante
      sendEmailWithRetry(
        {
          from: 'Technicfix <noreply@technicfix.com.br>',
          to: config.contactEmail,
          subject: `Novo lead: ${dataToSave.name} (${tipoLabel})`,
          text: corpo,
        },
        lead.id
      )
    }
  }

  return { success: true }
}
