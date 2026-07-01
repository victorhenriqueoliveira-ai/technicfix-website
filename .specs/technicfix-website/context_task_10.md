# Contexto — task_10

## Requisitos do PRD

- Admin: listagem de categorias, criar nova categoria, editar nome/imagem, deletar (com confirmação)
- Upload de imagem da categoria via Cloudflare R2 (presigned URL) — mas R2 não está configurado no MVP ainda, então imagem é URL string opcional por ora
- Categorias refletem no catálogo público (task_06 já usa `category.slug`)

## Especificação Técnica

### Rotas a criar

```
app/(admin)/admin/categorias/
  page.tsx          ← listagem de categorias
  nova/page.tsx     ← formulário de criação
  [id]/page.tsx     ← formulário de edição
```

### Server Actions em `actions/categories.ts`

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export async function createCategory(formData: FormData) { ... }
export async function updateCategory(id: string, formData: FormData) { ... }
export async function deleteCategory(id: string) { ... }
```

Após cada mutação: `revalidatePath('/admin/categorias')` e `revalidatePath('/produtos')`.

Slug: gerado automaticamente do nome (lowercase, espaços → hífens) se não fornecido.

### `app/(admin)/admin/categorias/page.tsx`
Server Component. Lista categorias com `orderBy: { name: 'asc' }`. Cada linha: nome, slug, total de produtos, botões Editar/Deletar. Deletar abre Dialog de confirmação (`'use client'` wrapper).

### Formulário de categoria
Campos: Nome (input), Slug (input, auto-gerado do nome), URL da Imagem (input text — upload R2 será adicionado na task_11/16).

## Estado de dependências

- task_09 (integrada): route group `app/(admin)/` com layout e proteção de sessão existem
- task_02 (integrada): modelo `Category` com campos id, name, slug, imageUrl, products[]

## Importante para o worker

- Usar layout do admin (route group existente) — criar arquivos dentro de `app/(admin)/admin/categorias/`
- NÃO implementar upload de imagem (R2) — apenas campo de URL string
- shadcn/ui Table e Dialog disponíveis (ou instalar com npx shadcn@latest add table dialog)
- Criar testes unitários: createCategory com dados válidos/inválidos, deleteCategory, listagem renderiza tabela
- NÃO executar npm install além do necessário
