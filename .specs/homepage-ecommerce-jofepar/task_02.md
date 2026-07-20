---
status: completed
title: lib/data/categories.ts — funções de fetch de categorias
type: backend
complexity: low
dependencies:
  - task_01
---

# Task 02: lib/data/categories.ts — funções de fetch de categorias

## Overview

Cria o módulo `lib/data/categories.ts` com duas funções exportadas: `getCategoriesWithChildren()` para o header (categorias-pai com filhos) e `getCategoriesWithProducts(limit?)` para a homepage (categorias-pai com produtos ativos). Extrair o fetch para este módulo permite reutilização pelo `layout.tsx` e pelo `page.tsx` sem duplicação, e viabiliza testes unitários com mock do Prisma.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar o arquivo `lib/data/categories.ts` (o diretório `lib/data/` ainda não existe)
- DEVE exportar `getCategoriesWithChildren(): Promise<CategorySummary[]>` retornando apenas categorias-raiz (`parentId: null`) com filhos ordenados por nome
- DEVE exportar `getCategoriesWithProducts(limit?: number): Promise<CategoryWithProducts[]>` retornando apenas categorias-raiz com pelo menos 1 produto ativo, limitando a `limit` produtos por categoria (default 8), ordenados por `featured desc, createdAt desc`
- DEVE mapear os resultados Prisma para os tipos `CategorySummary` e `CategoryWithProducts` de `lib/types.ts` (sem vazar tipos do Prisma para os consumers)
- DEVE importar `db` do client Prisma existente no projeto (verificar o caminho correto, provavelmente `@/lib/db` ou `@/lib/prisma`)
- DEVE usar os campos de select exatos definidos na seção "Data Models" do TechSpec para `getCategoriesWithProducts` (incluindo `showPrice`)
- NÃO DEVE fazer fetch client-side — ambas as funções são server-only
</requirements>

## Subtasks

- [x] 2.1 Criar o diretório `lib/data/` e o arquivo `lib/data/categories.ts`
- [x] 2.2 Implementar `getCategoriesWithChildren()` com query e mapping para `CategorySummary`
- [x] 2.3 Implementar `getCategoriesWithProducts(limit?)` com query e mapping para `CategoryWithProducts`
- [x] 2.4 Verificar o path do import do Prisma client (db) no projeto
- [x] 2.5 Escrever testes unitários com mock do Prisma para ambas as funções

## Implementation Details

Veja as seções "Data Models" e "`lib/data/categories.ts` (NOVO)" do TechSpec para as queries Prisma e o mapeamento exato de campos.

O diretório `lib/data/` não existe no projeto atual — criar junto com o arquivo. O client Prisma provavelmente está em `lib/prisma.ts` ou `lib/db.ts`; verificar antes de importar.

`getCategoriesWithProducts` deve incluir `showPrice` no select de produtos (campo adicionado pela task_01 em `ProductSummary`).

### Relevant Files

- `lib/data/categories.ts` — arquivo a ser criado
- `lib/types.ts` — tipos `CategorySummary` e `CategoryWithProducts` (criados na task_01)
- `lib/prisma.ts` ou `lib/db.ts` — client Prisma a importar (verificar path real)
- `prisma/schema.prisma` — model `Category` com `parentId` (task_01)

### Dependent Files

- `app/(public)/layout.tsx` (task_05) — importa `getCategoriesWithChildren`
- `app/(public)/page.tsx` (task_10) — importa `getCategoriesWithProducts`

### Related ADRs

- [ADR-002: Hierarquia de Categorias via parentId Auto-referencial](../adrs/adr-002.md) — define a estrutura pai/filho que as queries exploram
- [ADR-003: layout.tsx Async para Prover Dados ao Header](../adrs/adr-003.md) — contexto de por que `getCategoriesWithChildren` é extraída para módulo separado

## Deliverables

- `lib/data/categories.ts` com `getCategoriesWithChildren` e `getCategoriesWithProducts` exportadas
- Testes unitários com mock do Prisma para ambas as funções **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `getCategoriesWithChildren()` com mock retornando 2 categorias-raiz, cada uma com 3 filhos: retorna array de 2 `CategorySummary` com `children` populados corretamente
  - [ ] `getCategoriesWithChildren()` com mock retornando array vazio: retorna `[]` sem erro
  - [ ] `getCategoriesWithProducts()` com mock retornando 1 categoria com 10 produtos ativos: retorna 8 produtos (limit padrão)
  - [ ] `getCategoriesWithProducts(4)` com mock retornando 1 categoria com 6 produtos: retorna exatamente 4 produtos
  - [ ] `getCategoriesWithProducts()` com mock retornando categorias sem produtos ativos: retorna `[]`
  - [ ] Campos mapeados em `CategorySummary`: `id`, `name`, `slug`, `imageUrl` (null se ausente), `children`
  - [ ] Campos mapeados em `CategoryWithProducts`: `id`, `name`, `slug`, `products` com todos os campos de `ProductSummary`
- Testes de integração:
  - [ ] `npx tsc --noEmit` passa com o novo módulo importado por `layout.tsx` e `page.tsx`

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Ambas as funções compilam sem erros TypeScript
- Os tipos retornados correspondem exatamente a `CategorySummary[]` e `CategoryWithProducts[]`
- Nenhum tipo Prisma vazando para os consumidores do módulo
