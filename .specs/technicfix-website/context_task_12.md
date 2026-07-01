# Contexto — task_12

## Requisitos do PRD

- Admin: CRUD de banners com campos título, subtítulo, URL da imagem, texto do CTA, URL do CTA, ativo/inativo
- Reordenação via drag-and-drop (campo `order` no banco)
- Banners ativos aparecem no Hero da homepage (task_05 já consome `banner.imageUrl, title, ctaText, ctaUrl`)

## Especificação Técnica

### Rotas a criar

```
app/(admin)/admin/banners/
  page.tsx          ← listagem + drag-and-drop
  novo/page.tsx     ← formulário de criação
  [id]/page.tsx     ← formulário de edição
```

### Server Actions em `actions/banners.ts`

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'

export async function createBanner(formData: FormData) { ... }
export async function updateBanner(id: string, formData: FormData) { ... }
export async function deleteBanner(id: string) { ... }
export async function reorderBanners(orderedIds: string[]) { ... }
```

`reorderBanners` recebe array de IDs na nova ordem e atualiza campo `order` de cada Banner em transaction.

### `app/(admin)/admin/banners/page.tsx`
`'use client'`. Usa `@dnd-kit/core` e `@dnd-kit/sortable` (já instalados em task_01) para lista drag-and-drop. Cada item: miniatura, título, status (ativo/inativo), botões Editar/Deletar. Ao reordenar: chama `reorderBanners(newOrder)`.

### Formulário de banner
Campos: Título, Subtítulo (opcional), URL da Imagem (string — upload R2 na task_16), Texto do CTA, URL do CTA, Ativo (checkbox).

## Estado de dependências

- task_09 (integrada): route group admin com layout
- task_02 (integrada): modelo `Banner` com id, imageUrl, title, subtitle, ctaText, ctaUrl, order, active
- `@dnd-kit/core` e `@dnd-kit/sortable` instalados (task_01)

## Importante para o worker

- `@dnd-kit` já instalado — NÃO executar npm install para ele
- NÃO implementar upload R2 — apenas URL string
- Criar `app/(admin)/admin/banners/` dentro do route group existente
- Criar testes unitários: reorderBanners atualiza orders, createBanner persiste, BannerList renderiza itens draggable
- shadcn/ui Table/Dialog/Checkbox disponíveis
