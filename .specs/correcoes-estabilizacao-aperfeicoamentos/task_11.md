---
status: completed
title: Converter categorias/[slug]/page.tsx de redirect para Server Component
type: frontend
complexity: medium
dependencies:
  - task_10
---

# Task 11: Converter `categorias/[slug]/page.tsx` de redirect para Server Component

## Overview

Reescreve `app/(public)/categorias/[slug]/page.tsx` para substituir o `redirect()` atual por um Server Component completo com cabeçalho de categoria, grid de produtos (com busca e paginação), e as mesmas capacidades de filtro de `produtos/page.tsx`. Esta é a landing page SEO de cada categoria.

<critical>
- SEMPRE LEIA o PRD (F9) e o TechSpec (seções "System Architecture" e ADR-005) antes de começar
- REFERENCIE O TECHSPEC para a estrutura da página e ADR-005 para a decisão de canonical
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `app/(public)/categorias/[slug]/page.tsx` DEVE renderizar a categoria com seus produtos em vez de redirecionar
- A página DEVE buscar a categoria pelo `slug` no Prisma e retornar 404 (via `notFound()`) se não existir
- A página DEVE exibir: nome da categoria como título, imagem da categoria (se `imageUrl` existir), grid de produtos da categoria
- A query de produtos DEVE reutilizar a mesma estrutura de `produtos/page.tsx` (filtro por `category.slug`, suporte a `busca` e paginação via searchParams, `status: 'ativo'`)
- A página NÃO DEVE incluir `<link rel="canonical">` apontando para si mesma (ela já é a URL canônica, conforme ADR-005)
- `generateMetadata` DEVE retornar title e description baseados no nome da categoria
- `app/(public)/produtos/page.tsx` DEVE ter canonical apontando para `/categorias/[slug]` quando `?categoria=` está ativo (implementado em task_10, verificar que está presente)
- `revalidateAll()` em `actions/products.ts` já DEVE invalidar `/categorias/[slug]` (adicionado em task_10 — confirmar antes de continuar)
- Placeholder visual DEVE ser exibido quando a categoria não tem `imageUrl`
</requirements>

## Subtasks

- [x] 11.1 Remover o `redirect()` e o `generateMetadata` atual de `categorias/[slug]/page.tsx`
- [x] 11.2 Buscar categoria pelo slug com `db.category.findUnique({ where: { slug }, include: ... })`; chamar `notFound()` se null
- [x] 11.3 Renderizar cabeçalho com nome e imagem da categoria (ou placeholder quando `imageUrl` é null)
- [x] 11.4 Adicionar campo `busca` nos searchParams e query de produtos filtrada por `category.slug`
- [x] 11.5 Implementar paginação com links preservando `busca`
- [x] 11.6 Implementar `generateMetadata` com nome da categoria em `title` e `description`
- [x] 11.7 Verificar que `revalidateAll()` em `actions/products.ts` inclui `revalidatePath('/categorias/[slug]', 'page')` (task_10)

## Implementation Details

Atualmente `categorias/[slug]/page.tsx` tem apenas 8 linhas: await params, redirect. O arquivo inteiro precisa ser substituído.

A query de produtos pode ser extraída para uma função utilitária compartilhada ou pode ser duplicada com consciência — o TechSpec não define um helper compartilhado, então duplicar com um comentário de referência para `produtos/page.tsx` é aceitável.

O schema Prisma tem `imageUrl` em `Category` — confirmado pela exploração. O admin já tem campo para editar `imageUrl` na categoria.

Paginação sugerida: 12 produtos por página (igual à `produtos/page.tsx`), com links `?page=N&busca=...`.

### Relevant Files

- `app/(public)/categorias/[slug]/page.tsx` — arquivo a reescrever inteiramente
- `app/(public)/produtos/page.tsx` — referência de estrutura de query e paginação (implementada em task_10)
- `actions/products.ts` — `revalidateAll()` deve incluir `/categorias/[slug]` (task_10)
- `lib/prisma.ts` — instância do DB

### Dependent Files

- Links de categoria no `Header`, `CategoryAccordion`, `BenefitsBar` etc. — já apontam para `/categorias/[slug]`, agora renderizam conteúdo real
- `app/sitemap.ts` — já inclui `/categorias/[slug]` no sitemap; agora as URLs retornam 200 em vez de 301

### Related ADRs

- [ADR-005: /categorias/[slug] como URL canônica](adrs/adr-005.md) — define que esta página é a canônica e que `/produtos?categoria=` deve ter canonical reverso

## Deliverables

- `app/(public)/categorias/[slug]/page.tsx` como Server Component completo (sem redirect)
- `generateMetadata` dinâmico por categoria
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `/categorias/parafusos` com categoria existente: renderiza nome "Parafusos" no título
  - [ ] `/categorias/slug-inexistente` chama `notFound()` e retorna 404
  - [ ] Categoria com `imageUrl` não nula: `<img>` ou `<Image>` renderizado com o URL
  - [ ] Categoria com `imageUrl = null`: placeholder renderizado (sem erro)
  - [ ] `generateMetadata` com slug válido retorna `title` contendo o nome da categoria
- Testes de integração:
  - [ ] GET `/categorias/parafusos` retorna status 200 (não 301) e HTML com nome da categoria
  - [ ] GET `/categorias/parafusos?busca=sextavado` retorna produtos filtrados por busca dentro da categoria
  - [ ] GET `/categorias/parafusos?page=2` retorna a segunda página de produtos
  - [ ] `<head>` de `/categorias/parafusos` NÃO contém `<link rel="canonical">` apontando para outra URL
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- GET `/categorias/[qualquer-slug-existente]` retorna HTTP 200 com conteúdo real
- GET `/categorias/slug-inexistente` retorna HTTP 404
- URL não redireciona mais para `/produtos?categoria=`
- Google Search Console (após indexação) mostra `/categorias/[slug]` como URL canônica
