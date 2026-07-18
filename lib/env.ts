import { z } from 'zod'

const schema = z.object({
  DATABASE_URL:          z.string().url(),
  RESEND_API_KEY:        z.string().min(1),
  UPLOADTHING_TOKEN:     z.string().min(1),
  AUTH_SECRET:           z.string().min(1),
  R2_ACCOUNT_ID:         z.string().min(1),
  R2_ACCESS_KEY_ID:      z.string().min(1),
  R2_SECRET_ACCESS_KEY:  z.string().min(1),
  R2_BUCKET_NAME:        z.string().min(1),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1),
  NEXT_PUBLIC_SITE_URL:        z.string().url(),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('[Technicfix] Env inválida:\n', parsed.error.flatten().fieldErrors)
  throw new Error('[Technicfix] Configuração de ambiente incompleta.')
}

export const env = parsed.data
export type Env = z.infer<typeof schema>
