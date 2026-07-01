# Contexto — task_14

## Requisitos do PRD

- Admin: formulário para editar configurações do site
- Campos: Nome da Loja, Número WhatsApp, E-mail de Contato, URL da Technocalhas, Descrição da Technocalhas
- Salvar atualiza o SiteConfig singleton no banco (id: "singleton")

## Especificação Técnica

### Rota a criar

```
app/(admin)/admin/configuracoes/page.tsx
```

### Server Action em `actions/site-config.ts`

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'

const configSchema = z.object({
  storeName: z.string().min(2),
  whatsappNumber: z.string().regex(/^\d{10,11}$/, 'Número deve ter 10 ou 11 dígitos'),
  contactEmail: z.string().email(),
  technocalhasUrl: z.string().url().optional().or(z.literal('')),
  technocalhasDescription: z.string().max(500),
})

export async function updateSiteConfig(formData: FormData) {
  const data = configSchema.parse({
    storeName: formData.get('storeName'),
    whatsappNumber: formData.get('whatsappNumber'),
    contactEmail: formData.get('contactEmail'),
    technocalhasUrl: formData.get('technocalhasUrl'),
    technocalhasDescription: formData.get('technocalhasDescription'),
  })
  await db.siteConfig.update({ where: { id: 'singleton' }, data })
  revalidatePath('/')
  revalidatePath('/technocalhas')
  revalidatePath('/admin/configuracoes')
}
```

### `app/(admin)/admin/configuracoes/page.tsx`
Server Component. Busca SiteConfig: `db.siteConfig.findFirst()`. Se não existir (null), usa valores padrão. Renderiza formulário com campos pré-preenchidos. Submit chama `updateSiteConfig`.

## Estado de dependências

- task_09 (integrada): route group admin com layout
- task_02 (integrada): modelo SiteConfig com id="singleton" (seed garante existência), campos: storeName, whatsappNumber, contactEmail, technocalhasUrl, technocalhasDescription

## Importante para o worker

- Única rota: `app/(admin)/admin/configuracoes/page.tsx`
- Única action: `actions/site-config.ts`
- Criar testes unitários: updateSiteConfig com dados válidos/inválidos, formulário renderiza campos pré-preenchidos
- shadcn/ui Input, Textarea, Button disponíveis
- NÃO implementar upload de logo ou imagens
- NÃO executar npm install
