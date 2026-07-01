---
status: pending
title: "Admin: CRUD de produtos + upload de imagens (presigned URL Cloudflare R2)"
type: frontend
complexity: high
dependencies:
  - task_09
  - task_10
---

# Task 11: Admin — CRUD de produtos e upload de imagens

## Overview

Implementa o gerenciamento completo de produtos no painel admin, incluindo upload de múltiplas imagens via presigned URL para o Cloudflare R2. É a task mais complexa do admin: envolve formulário com múltiplos campos, integração com storage externo e reflexo imediato no catálogo público. O dono gerencia todo o catálogo por aqui.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/produtos/page.tsx` com tabela de produtos (nome, categoria, status, destaque, ações) e busca/filtro por categoria e status
- DEVE criar `app/admin/produtos/novo/page.tsx` e `app/admin/produtos/[id]/editar/page.tsx` usando o mesmo `ProductForm`
- DEVE criar `actions/products.ts` com `createProduct`, `updateProduct`, `deleteProduct`
- DEVE criar `app/api/upload/presigned/route.ts` com rota POST protegida por sessão que gera presigned PUT URL para o R2
- DEVE criar `components/admin/products/ProductForm.tsx` com campos: nome, slug, descrição, detalhes técnicos, preço (opcional), SKU, estoque, categoria (dropdown das categorias existentes), imagens (upload múltiplo), destaque (toggle), status (ativo/inativo)
- DEVE criar `components/admin/products/ImageUploader.tsx` que faz upload direto ao R2 via presigned URL e exibe preview das imagens
- Imagens DEVEM ser limitadas a 5MB por arquivo e aceitar apenas JPEG, PNG e WebP
- O slug DEVE ser gerado automaticamente a partir do nome (igual à task 10)
- Exclusão de produto DEVE usar soft delete ou confirmação com AlertDialog
- Server Actions DEVEM fazer `revalidatePath` do catálogo público após mutações
</requirements>

## Subtasks

- [ ] 11.1 Criar `app/api/upload/presigned/route.ts` com verificação de sessão e geração de presigned URL via AWS SDK v3 apontando para R2
- [ ] 11.2 Criar `components/admin/products/ImageUploader.tsx` com upload direto ao R2, preview e remoção de imagens
- [ ] 11.3 Criar `actions/products.ts` com `createProduct`, `updateProduct`, `deleteProduct` e revalidação de cache
- [ ] 11.4 Criar `components/admin/products/ProductForm.tsx` com todos os campos e integração com `ImageUploader`
- [ ] 11.5 Criar `app/admin/produtos/page.tsx` com tabela, busca e filtros
- [ ] 11.6 Criar `app/admin/produtos/novo/page.tsx` e `app/admin/produtos/[id]/editar/page.tsx`

## Implementation Details

Referencie a seção "Integration Points — Cloudflare R2" e "API Endpoints" do TechSpec para o fluxo completo de upload.

Fluxo de upload: (1) `ImageUploader` chama `POST /api/upload/presigned` → (2) recebe `{ url, key }` → (3) faz `PUT` direto ao R2 com a imagem → (4) salva a URL pública `${R2_PUBLIC_URL}/${key}` no estado do formulário → (5) ao salvar o produto, as URLs são persistidas no array `images[]` do modelo Product.

Instalar `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner` para geração das presigned URLs.

### Relevant Files

- `app/admin/produtos/page.tsx`
- `app/admin/produtos/novo/page.tsx`
- `app/admin/produtos/[id]/editar/page.tsx`
- `actions/products.ts`
- `app/api/upload/presigned/route.ts`
- `components/admin/products/ProductForm.tsx`
- `components/admin/products/ImageUploader.tsx`
- `lib/prisma.ts`
- `lib/utils/slugify.ts` — geração de slug do produto

### Dependent Files

- `task_05` (Homepage — Produtos em Destaque) reflete produtos marcados como `featured`
- `task_06` (Catálogo) reflete produtos criados/editados/desativados
- `task_16` (R2 + next/image) valida que as URLs salvas renderizam via `next/image`

### Related ADRs

- [ADR-003: Storage de Imagens — Cloudflare R2](adrs/adr-003.md) — fluxo completo de upload e configuração do R2

## Deliverables

- `app/api/upload/presigned/route.ts` funcional
- `components/admin/products/ImageUploader.tsx` com upload real ao R2
- `actions/products.ts` com CRUD completo
- `components/admin/products/ProductForm.tsx` com todos os campos
- Páginas de listagem, criação e edição de produtos
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração do CRUD e upload **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `POST /api/upload/presigned` sem sessão retorna 401
  - [ ] `POST /api/upload/presigned` com arquivo maior que 5MB retorna 400
  - [ ] `POST /api/upload/presigned` com tipo MIME não permitido retorna 400
  - [ ] `POST /api/upload/presigned` com sessão válida retorna `{ url, key }` com formato correto
  - [ ] `ImageUploader` exibe preview da imagem após upload bem-sucedido
  - [ ] `ImageUploader` exibe mensagem de erro quando o upload falha
- Testes de integração:
  - [ ] `createProduct` com dados válidos cria produto no banco com `status: ativo`
  - [ ] `createProduct` com slug duplicado retorna erro sem criar produto
  - [ ] `updateProduct` atualiza `featured: true` e o produto aparece em `/` (produtos em destaque) após revalidação
  - [ ] `updateProduct` com `status: inativo` remove produto do catálogo público
  - [ ] `deleteProduct` remove produto e seus leads associados são desvinculados (productId → null)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Upload de imagem ao R2 funciona de ponta a ponta
- Produto criado aparece no catálogo público imediatamente (sem redeploy)
- Produto desativado some do catálogo público imediatamente
