import { z } from 'zod'

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
