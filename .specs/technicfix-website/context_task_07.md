# Contexto — task_07

## Requisitos do PRD

- Formulário de lead varejo: nome, e-mail, telefone, produto de interesse
- Formulário de lead atacado: razão social, CNPJ (validado), volume estimado, prazo desejado, mensagem
- Ambos disparam Server Action que persiste Lead no banco com `type: 'varejo'` ou `type: 'atacado'`
- Modais abertos a partir do ProductCard (botão "Tenho interesse" → modal varejo, "Solicitar orçamento" → modal atacado)

## Especificação Técnica

### `actions/leads.ts` — substituir stub
```typescript
'use server'
import { z } from 'zod'
import { db } from '@/lib/prisma'
import type { LeadPayload } from '@/lib/types'

const varejoPay = z.object({
  type: z.literal('varejo'),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  productId: z.string().optional(),
  message: z.string().optional(),
})
const atacadoPayload = z.object({
  type: z.literal('atacado'),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  companyName: z.string().min(2),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  estimatedVolume: z.string().optional(),
  desiredDeadline: z.string().optional(),
  message: z.string().optional(),
})
const geralPayload = z.object({
  type: z.literal('geral'),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().optional(),
})

const leadSchema = z.discriminatedUnion('type', [varejoPay, atacadoPayload, geralPayload])

export async function submitLead(
  payload: LeadPayload
): Promise<{ success: boolean; error?: string }> {
  const result = leadSchema.safeParse(payload)
  if (!result.success) return { success: false, error: result.error.issues[0].message }
  await db.lead.create({ data: result.data })
  return { success: true }
}
```

### Modais de lead

**`components/catalog/LeadVarejoModal.tsx`** — `'use client'`. Usa shadcn/ui Dialog. Props: `productId?: string, productName?: string, open: boolean, onClose: () => void`. Campos: nome, e-mail, telefone, mensagem. Submete com `submitLead({ type: 'varejo', ... })`.

**`components/catalog/LeadAtacadoModal.tsx`** — `'use client'`. Usa shadcn/ui Dialog. Props: `productId?: string, productName?: string, open: boolean, onClose: () => void`. Campos: nome, e-mail, telefone, razão social, CNPJ (máscara opcional), volume estimado, prazo desejado, mensagem. Submete com `submitLead({ type: 'atacado', ... })`.

### Integrar modais ao ProductCard

`components/catalog/ProductCard.tsx` já existe. Adicionar:
- `useState<boolean>` para `varejoOpen` e `atacadoOpen`
- Importar e renderizar `<LeadVarejoModal>` e `<LeadAtacadoModal>`
- Botão "Tenho interesse" → `setVarejoOpen(true)`
- Botão "Solicitar orçamento" → `setAtacadoOpen(true)`
- `'use client'` diretiva (se ainda não tiver)

## Estado de dependências

- task_02 (integrada): `db`, modelo Lead, enums LeadType/LeadStatus
- task_06 (integrada): `components/catalog/ProductCard.tsx` existe
- `actions/leads.ts` existe como stub — SUBSTITUIR completamente
- `lib/types.ts`: `LeadPayload` e `LeadType` já exportados

## Importante para o worker

- Instalar `zod` se não instalado (provavelmente já está do task_01)
- Validação de CNPJ: regex de 14 dígitos (numérico) — validação lógica completa não é necessária no MVP
- Campos `companyName` e `cnpj` precisam ser adicionados ao modelo Lead; se não estiverem no schema, usar `as any` temporariamente ou verificar schema atual — veja prisma/schema.prisma
- shadcn/ui Dialog já deve estar disponível (shadcn/ui instalado em task_01); se Dialog não existir, instalar com `npx shadcn@latest add dialog`
- Criar testes unitários: submitLead com tipo geral/varejo/atacado válidos retorna success, dados inválidos retornam error, modal varejo renderiza campos, modal atacado renderiza CNPJ
- NÃO modificar outras páginas além de ProductCard
