---
status: completed
title: Schema Prisma parentId + atualização de lib/types.ts
type: backend
complexity: medium
dependencies: []
---

# Task 01: Schema Prisma parentId + atualização de lib/types.ts

## Overview

Adiciona suporte a hierarquia de categorias (pai/filho) ao schema Prisma via campo `parentId` auto-referencial nullable, roda a migração de banco de dados e atualiza `lib/types.ts` com os novos tipos `CategorySummary` (com `children`), `CategoryWithProducts` e o campo `showPrice` em `ProductSummary`. Esta tarefa é o fundamento de todas as demais — nenhuma outra pode começar sem o Prisma client regenerado.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `parentId String?`, relação `parent` e `children` ao model `Category` em `prisma/schema.prisma` exatamente como especificado na seção "Data Models" do TechSpec
- DEVE rodar `npx prisma migrate dev --name add_category_parent` para gerar a migração SQL e regenerar o Prisma client
- DEVE adicionar `CategorySummary` com campo `children: CategorySummary[]` a `lib/types.ts`
- DEVE adicionar `CategoryWithProducts` com campo `products: ProductSummary[]` a `lib/types.ts`
- DEVE adicionar `showPrice: boolean` ao `ProductSummary` existente em `lib/types.ts` (campo já existe no schema Prisma, apenas faltava no tipo TypeScript)
- DEVE verificar que nenhum uso existente de `ProductSummary` quebra com a adição de `showPrice` (adição de campo não quebra — mas conferir)
- DEVE passar `npx tsc --noEmit` sem erros após as mudanças
</requirements>

## Subtasks

- [x] 1.1 Adicionar `parentId`, `parent` e `children` ao model `Category` em `prisma/schema.prisma`
- [x] 1.2 Rodar migração Prisma e regenerar o client
- [x] 1.3 Adicionar `CategorySummary` e `CategoryWithProducts` a `lib/types.ts`
- [x] 1.4 Adicionar `showPrice: boolean` ao `ProductSummary` em `lib/types.ts`
- [x] 1.5 Verificar compilação TypeScript sem erros
- [x] 1.6 Escrever testes unitários para os novos tipos (type guards ou serialização)

## Implementation Details

Veja a seção "Data Models" e "Core Interfaces" do TechSpec para a definição exata do schema Prisma e dos tipos TypeScript.

O model `Category` atual (em `prisma/schema.prisma`) não possui `parentId` nem relações auto-referenciais. A migração é additive (coluna nullable) — sem risco de perda de dados.

O `ProductSummary` em `lib/types.ts` atualmente tem 9 campos. Adicionar `showPrice: boolean` é adição pura; os selects existentes no código que não incluem `showPrice` precisam ser verificados para manter consistência de tipo.

### Relevant Files

- `prisma/schema.prisma` — model `Category` a ser modificado com parentId e relações
- `lib/types.ts` — adicionar `CategorySummary`, `CategoryWithProducts` e `showPrice` em `ProductSummary`
- `prisma/migrations/` — nova migração gerada automaticamente
- `app/(public)/page.tsx` — usa `ProductSummary`; verificar compatibilidade após adição de `showPrice`
- `lib/data.ts` ou equivalente — qualquer select de produtos que popula `ProductSummary`

### Dependent Files

- `lib/data/categories.ts` (task_02) — depende do Prisma client com `parentId`
- `components/layout/CategoryNav.tsx` (task_04) — usa `CategorySummary`
- `components/home/HomepageProductCard.tsx` (task_06) — usa `ProductSummary` com `showPrice`
- `components/home/CategoryProductSection.tsx` (task_09) — usa `CategoryWithProducts`
- `actions/categories.ts` (task_11) — model Category com parentId

### Related ADRs

- [ADR-002: Hierarquia de Categorias via parentId Auto-referencial](../adrs/adr-002.md) — define a escolha pelo campo auto-referencial e a limitação a 2 níveis

## Deliverables

- `prisma/schema.prisma` com model `Category` atualizado
- Arquivo de migração SQL gerado em `prisma/migrations/`
- Prisma client regenerado (build artifact)
- `lib/types.ts` com `CategorySummary`, `CategoryWithProducts` e `showPrice` em `ProductSummary`
- Testes unitários para os novos tipos e de non-regression nos existentes **(OBRIGATÓRIO)**
- `npx tsc --noEmit` passando sem erros **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `CategorySummary` com `children: []` serializa e desserializa corretamente
  - [ ] `CategorySummary` com `children` populados preserva todos os campos dos filhos
  - [ ] `ProductSummary` com `showPrice: true` mantém todos os campos anteriores sem regressão
  - [ ] `ProductSummary` com `showPrice: false` é válido como tipo
  - [ ] `CategoryWithProducts` com `products: []` é aceito sem erro de tipo
- Testes de integração:
  - [ ] Migração aplicada com sucesso em banco de desenvolvimento: `npx prisma migrate dev` retorna sem erro
  - [ ] Prisma client gerado aceita `category.findMany({ include: { children: true } })` sem erro de tipo
  - [ ] `npx tsc --noEmit` passa após todas as mudanças de tipo

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Migração aplicada e reversível sem perda de dados
- Prisma client regenerado sem erros
- `lib/types.ts` compilando com os 3 novos tipos/campos
- Nenhuma regressão TypeScript nos arquivos que usavam `ProductSummary` anteriormente
