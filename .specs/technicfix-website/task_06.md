---
status: completed
title: "Catálogo de produtos: listagem paginada, filtros por categoria, busca e página de detalhe"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_04
---

# Task 06: Catálogo de produtos

## Overview

Implementa as duas páginas do catálogo público: a listagem de produtos com filtros por categoria e busca por nome/especificação, e a página de detalhe de produto com galeria de imagens e os dois CTAs de lead (varejo e atacado). É a principal superfície de descoberta de produtos para ambos os públicos.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/(public)/produtos/page.tsx` com listagem paginada (12 produtos por página) e filtro por categoria via query param `?categoria=slug`
- DEVE criar `app/(public)/produtos/[slug]/page.tsx` com `generateStaticParams` desabilitado (SSR dinâmico) ou `revalidate` configurado
- DEVE criar `app/(public)/categorias/[slug]/page.tsx` que redireciona para `/produtos?categoria=slug` ou renderiza produtos filtrados
- DEVE criar `components/catalog/ProductCard.tsx` com imagem (`next/image`), nome, categoria e dois botões de CTA ("Tenho interesse" / "Solicitar orçamento")
- DEVE criar `components/catalog/CategoryFilter.tsx` com lista de categorias ativas como links de filtro
- DEVE criar `components/catalog/SearchBar.tsx` com input que atualiza o query param `?busca=` e filtra produtos por nome
- DEVE criar `components/catalog/ProductGallery.tsx` na página de detalhe com imagem principal e miniaturas clicáveis
- As URLs dos produtos e categorias DEVEM ser geradas a partir dos slugs (ex.: `/produtos/parafuso-m8-inox`)
- A busca e os filtros DEVEM funcionar via query params (sem estado de cliente) para suportar deep-linking e SEO
- Produtos com `status: inativo` NÃO DEVEM aparecer no catálogo público
</requirements>

## Subtasks

- [x] 6.1 Criar `app/(public)/produtos/page.tsx` com query ao banco filtrando por categoria e busca, com paginação
- [x] 6.2 Criar `components/catalog/ProductCard.tsx` e `components/catalog/CategoryFilter.tsx`
- [x] 6.3 Criar `components/catalog/SearchBar.tsx` com `useRouter` e `useSearchParams` para atualizar URL
- [x] 6.4 Criar `app/(public)/produtos/[slug]/page.tsx` com query por slug, retornando 404 se não encontrado
- [x] 6.5 Criar `components/catalog/ProductGallery.tsx` com troca de imagem principal ao clicar na miniatura
- [x] 6.6 Criar `app/(public)/categorias/[slug]/page.tsx` redirecionando para catálogo filtrado
- [x] 6.7 Validar que buscas e filtros funcionam combinados (ex.: `?categoria=parafusos&busca=inox`)

## Implementation Details

Referencie a seção "Estrutura de Rotas" e "API Endpoints" do TechSpec para os padrões de rotas.

`app/(public)/produtos/page.tsx` recebe `searchParams` como prop (Next.js App Router) e usa seus valores para construir a query Prisma com `where` dinâmico.

A paginação usa `skip` e `take` do Prisma com controles de "Anterior/Próxima" baseados na contagem total.

`ProductCard` recebe os dois botões de CTA que abrem os modais de lead (implementados na task 07) — na task 06, os botões podem ter `onClick` vazio ou abrir um alerta temporário.

### Relevant Files

- `app/(public)/produtos/page.tsx`
- `app/(public)/produtos/[slug]/page.tsx`
- `app/(public)/categorias/[slug]/page.tsx`
- `components/catalog/ProductCard.tsx`
- `components/catalog/CategoryFilter.tsx`
- `components/catalog/SearchBar.tsx`
- `components/catalog/ProductGallery.tsx`
- `lib/prisma.ts`
- `lib/types.ts` — tipo `ProductSummary`

### Dependent Files

- `task_07` (modais de lead) integra os CTAs dos `ProductCard`s
- `task_15` (SEO) adiciona `generateMetadata` às páginas de produto e categoria
- `task_16` (R2 + next/image) confirma que as imagens do R2 renderizam corretamente

### Related ADRs

- [ADR-001: Abordagem de Produto — Catálogo Central](adrs/adr-001.md) — CTAs dentro do produto (não no hero)

## Deliverables

- `app/(public)/produtos/page.tsx` com filtros e paginação
- `app/(public)/produtos/[slug]/page.tsx`
- `app/(public)/categorias/[slug]/page.tsx`
- 4 componentes de catálogo
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração das páginas do catálogo **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductCard` renderiza nome, categoria e dois botões de CTA
  - [x] `CategoryFilter` marca como ativo o slug correspondente ao query param atual
  - [x] `SearchBar` atualiza a URL com `?busca=` ao submeter o formulário
  - [x] `ProductGallery` troca a imagem principal ao clicar em uma miniatura
- Testes de integração:
  - [x] GET `/produtos` retorna 200 com banco vazio (lista vazia, sem erro)
  - [x] GET `/produtos?categoria=parafusos` retorna apenas produtos da categoria "parafusos"
  - [x] GET `/produtos?busca=inox` retorna apenas produtos com "inox" no nome
  - [x] GET `/produtos/slug-inexistente` retorna 404
  - [x] GET `/produtos/slug-valido` retorna 200 com nome do produto no HTML
  - [x] Produto com `status: inativo` não aparece em GET `/produtos`
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Filtro por categoria e busca por nome funcionam individualmente e combinados
- URLs amigáveis por slug funcionam corretamente
- Produtos inativos nunca aparecem no catálogo público
