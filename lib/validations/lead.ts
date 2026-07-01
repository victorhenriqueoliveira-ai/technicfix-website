import { z } from 'zod'

/**
 * Valida os dígitos verificadores do CNPJ.
 * Recebe apenas os 14 dígitos numéricos (sem máscara).
 */
function validarDigitosCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false
  // CNPJs com todos os dígitos iguais são inválidos
  if (/^(\d)\1+$/.test(cnpj)) return false

  const calcDigito = (cnpj: string, tamanho: number): number => {
    let soma = 0
    let pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(cnpj.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11)
  }

  const digito1 = calcDigito(cnpj, 12)
  const digito2 = calcDigito(cnpj, 13)

  return parseInt(cnpj.charAt(12)) === digito1 && parseInt(cnpj.charAt(13)) === digito2
}

export const varejoSchema = z.object({
  type: z.literal('varejo'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter ao menos 10 dígitos'),
  productId: z.string().optional(),
  message: z.string().optional(),
})

export const atacadoSchema = z.object({
  type: z.literal('atacado'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter ao menos 10 dígitos'),
  companyName: z.string().min(2, 'Razão social deve ter ao menos 2 caracteres'),
  cnpj: z
    .string()
    .refine(
      (val) => /^\d{14}$/.test(val.replace(/\D/g, '')),
      'CNPJ deve ter 14 dígitos'
    )
    .refine(
      (val) => validarDigitosCNPJ(val.replace(/\D/g, '')),
      'CNPJ com dígitos verificadores inválidos'
    ),
  estimatedVolume: z.string().optional(),
  desiredDeadline: z.string().optional(),
  message: z.string().optional(),
})

export const geralSchema = z.object({
  type: z.literal('geral'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter ao menos 10 dígitos'),
  message: z.string().optional(),
})

export const leadSchema = z.discriminatedUnion('type', [
  varejoSchema,
  atacadoSchema,
  geralSchema,
])
