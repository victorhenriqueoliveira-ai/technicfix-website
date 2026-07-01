---
status: completed
title: "SEO: generateMetadata por página, sitemap dinâmico e robots.txt"
type: frontend
complexity: medium
dependencies:
  - task_05
  - task_06
  - task_08
---

# Task 15: SEO — metadados, sitemap e robots.txt

## Overview

Implementa a camada de SEO do site: metadados dinâmicos (`generateMetadata`) em todas as páginas públicas, sitemap XML dinâmico listando produtos e categorias, e `robots.txt` bloqueando o admin. Garante que o site seja indexável e bem representado nos buscadores.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `generateMetadata` às páginas: homepage, `/produtos`, `/produtos/[slug]`, `/categorias/[slug]`, `/sobre`, `/contato`, `/technocalhas`
- Metadados da homepage DEVEM incluir título, descrição e Open Graph image (imagem estática)
- Metadados de `/produtos/[slug]` DEVEM incluir o nome do produto como título e a primeira imagem como OG image
- DEVE criar `app/sitemap.ts` retornando todas as URLs públicas: homepage, páginas estáticas, produtos ativos e categorias
- DEVE criar `app/robots.ts` bloqueando `/admin/*` e permitindo todo o resto
- O sitemap DEVE usar `revalidate` de 1 hora para não ficar stale por muito tempo
- URLs do sitemap DEVEM usar a variável de ambiente `NEXT_PUBLIC_SITE_URL` como base
- DEVE adicionar `NEXT_PUBLIC_SITE_URL` ao `.env.example`
</requirements>

## Subtasks

- [x] 15.1 Criar `app/robots.ts` bloqueando `/admin/*`
- [x] 15.2 Criar `app/sitemap.ts` com queries dinâmicas para produtos e categorias ativos
- [x] 15.3 Adicionar `generateMetadata` à homepage (`app/(public)/page.tsx`)
- [x] 15.4 Adicionar `generateMetadata` às páginas de produto (`app/(public)/produtos/[slug]/page.tsx`) com dados dinâmicos do banco
- [x] 15.5 Adicionar `generateMetadata` às demais páginas públicas (listagem de produtos, categorias, sobre, contato, technocalhas)

## Implementation Details

Referencie a seção "Features Principais — SEO" do PRD e a seção "Monitoring and Observability" do TechSpec.

`app/sitemap.ts` usa `export const revalidate = 3600` para regeneração automática a cada hora. Busca `prisma.product.findMany({ where: { status: 'ativo' }, select: { slug: true, updatedAt: true } })` e `prisma.category.findMany({ select: { slug: true } })`.

`generateMetadata` em páginas de produto faz uma query ao banco pelo slug. Se o produto não existir, retorna metadados genéricos (não deve lançar erro).

O Open Graph image da homepage é um arquivo estático em `public/og-image.jpg` (placeholder até a identidade visual da Technicfix ser definida).

### Relevant Files

- `app/sitemap.ts`
- `app/robots.ts`
- `app/(public)/page.tsx` — adicionar `generateMetadata`
- `app/(public)/produtos/[slug]/page.tsx` — adicionar `generateMetadata`
- `app/(public)/produtos/page.tsx` — adicionar `generateMetadata`
- `app/(public)/categorias/[slug]/page.tsx` — adicionar `generateMetadata`
- `app/(public)/sobre/page.tsx` — adicionar `generateMetadata`
- `app/(public)/contato/page.tsx` — adicionar `generateMetadata`
- `app/(public)/technocalhas/page.tsx` — adicionar `generateMetadata`
- `lib/prisma.ts`

### Dependent Files

Nenhum arquivo downstream depende desta task.

### Related ADRs

Nenhum ADR específico para SEO.

## Deliverables

- `app/robots.ts` funcional
- `app/sitemap.ts` com produtos e categorias dinâmicos
- `generateMetadata` em todas as 7 páginas públicas
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração do sitemap e robots **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `generateMetadata` da página de produto retorna `title` com o nome do produto
  - [ ] `generateMetadata` da página de produto retorna metadados genéricos quando o slug não existe
  - [ ] `generateMetadata` da homepage inclui propriedades Open Graph
- Testes de integração:
  - [ ] GET `/sitemap.xml` retorna 200 com Content-Type `application/xml`
  - [ ] GET `/sitemap.xml` inclui URL do produto ativo e não inclui URL do produto inativo
  - [ ] GET `/robots.txt` retorna 200 com `Disallow: /admin`
  - [ ] GET `/robots.txt` retorna `Allow: /` para rotas públicas
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Todas as páginas públicas têm `<title>` e `<meta name="description">` únicos
- `/sitemap.xml` é válido e indexável
- `/robots.txt` bloqueia `/admin/*` corretamente
