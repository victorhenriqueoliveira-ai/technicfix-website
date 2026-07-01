---
status: pending
title: "Admin: CRUD de banners + reordenação drag-and-drop"
type: frontend
complexity: high
dependencies:
  - task_09
---

# Task 12: Admin — CRUD de banners com reordenação

## Overview

Implementa o gerenciamento de banners da homepage no painel admin: criação, edição, ativação/desativação e reordenação por drag-and-drop. Os banners alimentam o carrossel hero da homepage (task 05) e são configuráveis sem deploy.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/banners/page.tsx` com lista de banners reordenável por drag-and-drop e tabela de ações
- DEVE criar `actions/banners.ts` com `createBanner`, `updateBanner`, `deleteBanner` e `reorderBanners`
- DEVE criar `components/admin/banners/BannerForm.tsx` com campos: imagem (upload via presigned URL do R2, mesma rota da task 11), título, subtítulo (opcional), texto do CTA (opcional), URL de destino do CTA (opcional), ativo (toggle)
- DEVE criar `components/admin/banners/BannerList.tsx` com reordenação drag-and-drop usando `@dnd-kit/sortable`
- `reorderBanners(ids: string[])` DEVE atualizar o campo `order` de todos os banners em uma única transação Prisma
- Apenas banners com `active: true` DEVEM aparecer na homepage
- `createBanner` e `updateBanner` DEVEM fazer `revalidatePath('/')` para refletir na homepage
- Instalar `@dnd-kit/core` e `@dnd-kit/sortable`
</requirements>

## Subtasks

- [ ] 12.1 Instalar `@dnd-kit/core` e `@dnd-kit/sortable`
- [ ] 12.2 Criar `actions/banners.ts` com CRUD e `reorderBanners` usando transação Prisma
- [ ] 12.3 Criar `components/admin/banners/BannerForm.tsx` com upload de imagem reutilizando a rota `/api/upload/presigned`
- [ ] 12.4 Criar `components/admin/banners/BannerList.tsx` com `@dnd-kit/sortable` para drag-and-drop
- [ ] 12.5 Criar `app/admin/banners/page.tsx` combinando a lista e o form em um layout de página única

## Implementation Details

Referencie a seção "Features Principais — Homepage (Hero/Banner rotativo)" do PRD e "Integration Points — Cloudflare R2" do TechSpec para o upload de imagem.

`reorderBanners` recebe a lista de IDs na nova ordem e usa `prisma.$transaction` para atualizar o campo `order` de cada banner. O campo `order` é usado na query da homepage como `orderBy: { order: 'asc' }`.

O drag-and-drop é implementado no cliente (`'use client'`) mas a persistência da ordem é enviada ao servidor via Server Action após o drop.

Upload de imagem do banner reutiliza `POST /api/upload/presigned` da task 11 (mesma rota, mesmo fluxo).

### Relevant Files

- `app/admin/banners/page.tsx`
- `actions/banners.ts`
- `components/admin/banners/BannerForm.tsx`
- `components/admin/banners/BannerList.tsx`
- `app/api/upload/presigned/route.ts` — reutilizado para upload da imagem do banner
- `lib/prisma.ts`

### Dependent Files

- `task_05` (Homepage — Hero) usa os banners ativos ordenados por `order`
- `task_16` (R2 + next/image) valida que URLs de banner renderizam via `next/image`

### Related ADRs

- [ADR-003: Storage de Imagens — Cloudflare R2](adrs/adr-003.md) — upload da imagem do banner

## Deliverables

- `app/admin/banners/page.tsx` com CRUD e drag-and-drop
- `actions/banners.ts`
- `components/admin/banners/BannerForm.tsx`
- `components/admin/banners/BannerList.tsx` com drag-and-drop funcional
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `BannerList` renderiza um item por banner recebido como prop
  - [ ] `BannerList` emite a nova ordem de IDs após o drop
  - [ ] `BannerForm` exibe campos de título, subtítulo, CTA e URL
- Testes de integração:
  - [ ] `createBanner` com dados válidos cria banner no banco com `active: true` e `order` maior que os existentes
  - [ ] `reorderBanners(['id2', 'id1'])` atualiza `order` de `id2` para 0 e `id1` para 1
  - [ ] Banner com `active: false` não aparece na query da homepage (`/`)
  - [ ] `deleteBanner` remove o banner e `revalidatePath('/')` é chamado
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Drag-and-drop reordena e persiste a nova ordem
- Banner criado aparece na homepage imediatamente
- Banner desativado some da homepage sem redeploy
