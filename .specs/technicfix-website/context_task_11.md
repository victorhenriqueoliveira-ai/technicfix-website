# Contexto — task_11

## Requisitos do PRD

- Admin: CRUD completo de produtos com campos: nome, slug, descrição, detalhes técnicos, preço, SKU, estoque, categoria, destaque, status (ativo/inativo)
- Upload de imagens via Cloudflare R2 (presigned PUT URL — o browser envia direto para R2, sem passar pelo servidor Next.js)
- Até 5 imagens por produto; reordenação da ordem das imagens
- Produtos aparecem no catálogo público (task_06)

## Especificação Técnica

### Rotas a criar

```
app/(admin)/admin/produtos/
  page.tsx            ← listagem paginada (20/página), filtro categoria, busca, coluna status
  novo/page.tsx       ← formulário de criação
  [id]/page.tsx       ← formulário de edição
```

### Server Actions em `actions/products.ts`

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/prisma'

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  technicalDetails: z.string().optional(),
  price: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string(),
  featured: z.boolean().default(false),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
  images: z.array(z.string().url()).default([]),
})

export async function createProduct(formData: FormData) { ... }
export async function updateProduct(id: string, formData: FormData) { ... }
export async function deleteProduct(id: string) { ... }
export async function getPresignedUploadUrl(filename: string, contentType: string): Promise<{ url: string; key: string }> { ... }
```

### `getPresignedUploadUrl` — Upload R2

Usa `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner` (já instalados):

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function getPresignedUploadUrl(filename: string, contentType: string) {
  const key = `products/${Date.now()}-${filename}`
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  )
  return { url, key }
}
```

Após upload bem-sucedido, o client adiciona `${R2_PUBLIC_URL}/${key}` ao array `images` do produto.

### `components/admin/products/ProductForm.tsx`
`'use client'`. Campos: nome (auto-gera slug via slugify.ts existente em lib/utils/), slug (editável), categoria (select das categorias), preço, SKU, estoque, destaque (checkbox), status (select), descrição (textarea), detalhes técnicos (textarea), upload de imagens.

### Upload de imagens (client-side)
Input `<input type="file" accept="image/*" multiple>`. Para cada arquivo selecionado:
1. Chama `getPresignedUploadUrl(file.name, file.type)` (Server Action)
2. `fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })`
3. Adiciona URL pública (`${R2_PUBLIC_URL}/${key}`) ao estado de imagens

Mostrar previews das imagens já salvas + botão de remover.

### Listagem de produtos `page.tsx`
Server Component. Paginação 20/página. Colunas: imagem (thumbnail), nome, categoria, preço, SKU, estoque, status (badge), destaque, ações (Editar/Deletar). Filtros: categoria (select), busca por nome (input), status.

## Estado de dependências

- task_09 (integrada): route group admin com layout
- task_10 (integrada): `lib/utils/slugify.ts` existe; categorias CRUD disponível para popular o select
- task_02 (integrada): modelo Product com todos os campos necessários
- `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner` instalados (task_01)

## Importante para o worker

- NÃO executar npm install — todos os packages necessários já estão instalados
- Criar dentro de `app/(admin)/admin/produtos/`
- Para testes: `getPresignedUploadUrl` deve ser mockada (não há credenciais R2 reais) — testar que chama S3Client com parâmetros corretos
- `lib/utils/slugify.ts` já existe — importar de lá, não duplicar
- Criar testes unitários: createProduct com dados válidos/inválidos, deleteProduct, listagem renderiza tabela, ProductForm exibe campos
- shadcn/ui Table, Select, Checkbox, Textarea, Badge disponíveis
