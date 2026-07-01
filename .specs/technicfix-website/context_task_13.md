# Contexto — task_13

## Requisitos do PRD

- Admin: listagem de leads com filtros por tipo (varejo/atacado/geral) e status (novo/em_atendimento/convertido/perdido)
- Página de detalhe do lead com todos os campos + campo de notas
- Atualização de status e notas via Server Action

## Especificação Técnica

### Rotas a criar

```
app/(admin)/admin/leads/
  page.tsx          ← listagem com filtros
  [id]/page.tsx     ← detalhe + atualização de status/notas
```

### Server Actions em `actions/admin-leads.ts`

```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'
import type { LeadStatus } from '@/lib/types'

export async function updateLeadStatus(id: string, status: LeadStatus) { ... }
export async function updateLeadNotes(id: string, notes: string) { ... }
```

Após cada mutação: `revalidatePath('/admin/leads')`.

### `app/(admin)/admin/leads/page.tsx`
Server Component. Aceita `searchParams: { tipo?: string, status?: string }`. Query com where dinâmico. Exibe tabela com: nome, e-mail, telefone, tipo (badge colorido), status (badge), data. Link para detalhe.

### `app/(admin)/admin/leads/[id]/page.tsx`
Server Component. Busca lead por id com `include: { product: true }`. Exibe todos os campos. Formulário de notas (`'use client'` wrapper ou Server Action direta). Select de status com submit automático ao mudar.

### Badges de status e tipo
- `novo`: azul
- `em_atendimento`: amarelo
- `convertido`: verde
- `perdido`: vermelho
- `varejo`: laranja
- `atacado`: roxo
- `geral`: cinza

## Estado de dependências

- task_09 (integrada): route group admin com layout
- task_07 (integrada): modelo Lead populado via submitLead, enums LeadType/LeadStatus
- task_02 (integrada): `db` com modelo Lead, campos: id, type, status, name, email, phone, companyName, cnpj, estimatedVolume, desiredDeadline, message, notes, productId, createdAt

## Importante para o worker

- Criar dentro de `app/(admin)/admin/leads/`
- Criar testes unitários: updateLeadStatus valida status, listagem filtra por tipo, detalhe renderiza todos os campos
- NÃO criar funcionalidade de exportação de leads
- shadcn/ui Select, Badge, Textarea disponíveis
