'use server'

import { Resend } from 'resend'
import { db } from '@/lib/prisma'
import { leadSchema } from '@/lib/validations/lead'
import type { LeadPayload } from '@/lib/types'

// Inicializa o cliente Resend no nível de módulo
const resend = new Resend(process.env.RESEND_API_KEY)

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

  // Envia e-mail de notificação de forma silenciosa (falha não bloqueia o retorno)
  if (process.env.RESEND_API_KEY) {
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

      resend.emails
        .send({
          from: 'Technicfix <noreply@technicfix.com.br>',
          to: config.contactEmail,
          subject: `Novo lead: ${dataToSave.name} (${tipoLabel})`,
          text: corpo,
        })
        .catch((err) => console.error('[submitLead] Resend error:', err))
    }
  }

  return { success: true }
}
