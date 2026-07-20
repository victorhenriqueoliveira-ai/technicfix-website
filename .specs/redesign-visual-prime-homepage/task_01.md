---
status: completed
title: Schema Prisma + Migração + Tipos TypeScript
type: backend
complexity: medium
dependencies: []
---

# Task 01: Schema Prisma + Migração + Tipos TypeScript

## Overview

Adiciona os campos `badge` ao modelo `Product` e `heroBadge1`/`heroBadge2` ao modelo `SiteConfig` no schema Prisma, executa a migração de banco de dados e atualiza as interfaces TypeScript em `lib/types.ts`. Esta tarefa é o pré-requisito de todas as demais que consomem badge ou os novos campos de SiteConfig.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "Data Models" para os nomes exatos dos campos e tipos
- FOQUE NO "QUÊ" — adicionar campos nullable sem alterar comportamento existente
- MINIMIZE CÓDIGO — as alterações são aditivas, não modifique campos existentes
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `badge String?` ao modelo `Product` em `prisma/schema.prisma` (campo nullable, sem valor padrão).
- DEVE adicionar `heroBadge1 String?` e `heroBadge2 String?` ao modelo `SiteConfig` em `prisma/schema.prisma`.
- DEVE executar `npx prisma migrate dev --name add_badge_fields` para gerar e aplicar a migração.
- DEVE adicionar `badge: string | null` à interface `ProductSummary` em `lib/types.ts`.
- DEVE adicionar `heroBadge1: string | null` e `heroBadge2: string | null` à interface `SiteConfig` em `lib/types.ts`.
- NÃO DEVE alterar nenhum campo existente nos modelos `Product` ou `SiteConfig`.
- NÃO DEVE alterar outros modelos do schema (Category, Lead, Banner, etc.).
- Os campos novos DEVEM ser nullable para garantir backward-compatibility total com registros existentes.
</requirements>

## Subtasks

- [x] 1.1 Adicionar `badge String?` ao modelo `Product` em `prisma/schema.prisma`
- [x] 1.2 Adicionar `heroBadge1 String?` e `heroBadge2 String?` ao modelo `SiteConfig` em `prisma/schema.prisma`
- [x] 1.3 Executar migração Prisma e verificar que aplica sem erros
- [x] 1.4 Atualizar `ProductSummary` em `lib/types.ts` com campo `badge: string | null`
- [x] 1.5 Atualizar `SiteConfig` em `lib/types.ts` com `heroBadge1: string | null` e `heroBadge2: string | null`
- [x] 1.6 Executar `npx tsc --noEmit` e confirmar zero erros de tipo

## Implementation Details

Ver TechSpec seção "Data Models" para os nomes exatos dos campos e suas posições nos modelos.

O Prisma retorna automaticamente campos escalares no resultado das queries — não é necessário atualizar `include` ou `select` para campos novos escalares em queries que já retornam o modelo completo. A task_02 tratará a propagação via `page.tsx`.

Após a migração, o arquivo gerado em `prisma/migrations/` deve ser revisado para confirmar que contém apenas `ALTER TABLE` aditivos (`ADD COLUMN`) sem `DROP` ou `ALTER` de colunas existentes.

### Relevant Files

- `prisma/schema.prisma` — modelos `Product` e `SiteConfig` a modificar
- `lib/types.ts` — interfaces `ProductSummary` e `SiteConfig` a atualizar
- `prisma/migrations/` — diretório onde a migração gerada será criada

### Dependent Files

- `app/(public)/page.tsx` — usa `ProductSummary` e `SiteConfig`; será atualizado na task_02
- `components/home/Hero.tsx` — receberá `heroBadge1/2` como props; atualizado na task_04
- `components/home/FeaturedProducts.tsx` — usará `product.badge`; atualizado na task_05

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — define campo `badge` como parte da abordagem
- [ADR-003: Propagação do Campo Badge via page.tsx](adrs/adr-003.md) — contexto de por que os campos são nullable
- [ADR-004: Pill Badges via SiteConfig](adrs/adr-004.md) — justifica `heroBadge1/2` em `SiteConfig`

## Deliverables

- `prisma/schema.prisma` com `badge String?` em `Product` e `heroBadge1/2 String?` em `SiteConfig`
- Arquivo de migração gerado em `prisma/migrations/`
- `lib/types.ts` com `ProductSummary.badge` e `SiteConfig.heroBadge1/2`
- `npx tsc --noEmit` passando sem erros **(OBRIGATÓRIO)**
- Verificação de que registros existentes não foram afetados **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `ProductSummary` com `badge: null` compila sem erro TypeScript
  - [ ] `ProductSummary` com `badge: "Mais Vendido"` compila sem erro TypeScript
  - [ ] `SiteConfig` com `heroBadge1: null` e `heroBadge2: null` compila sem erro
  - [ ] `SiteConfig` com `heroBadge1: "Frete Grátis"` compila sem erro
- Testes de integração:
  - [ ] `npx prisma migrate dev` aplica sem erros em banco local
  - [ ] Query `db.product.findMany()` em produto existente retorna `badge: null` (não quebra registros antigos)
  - [ ] Query `db.siteConfig.findUnique({ where: { id: 'singleton' } })` retorna `heroBadge1: null` e `heroBadge2: null` para registro existente
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `npx tsc --noEmit` retorna zero erros
- Migração Prisma aplicada com sucesso em banco local
- Registros existentes de `Product` e `SiteConfig` não são alterados (campos novos com valor `null`)
