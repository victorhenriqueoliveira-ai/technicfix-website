---
status: completed
title: Criar lib/nav-data.ts com helpers de navegação
type: backend
complexity: low
dependencies:
  - task_01
---

# Task 2: Criar lib/nav-data.ts com helpers de navegação

## Overview

Cria o arquivo `lib/nav-data.ts` com duas funções assíncronas — `getCategoriesForNav()` e `getProductsForNav()` — que buscam no banco os dados necessários para popular a navegação do Header. Estas funções são chamadas pelo `Header` (Server Component) em `Promise.all`, garantindo zero latência visível para o visitante.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `lib/nav-data.ts` (novo arquivo) exportando `getCategoriesForNav` e `getProductsForNav`
- `getCategoriesForNav` DEVE retornar `Promise<CategorySummary[]>` filtrando apenas `parentId: null`, com filhos ordenados A–Z até 2 níveis de profundidade — veja "Data Models" no TechSpec
- `getProductsForNav` DEVE retornar `Promise<ProductNavItem[]>` filtrando `status: 'ativo'`, ordenados A–Z, limitado a 30 itens (`take: 30`) — veja "Data Models" no TechSpec
- DEVE importar `CategorySummary` e `ProductNavItem` de `lib/types.ts`
- DEVE usar o cliente Prisma existente (`lib/db` ou `lib/prisma`) — verificar o padrão já adotado no projeto
- NÃO DEVE criar caching manual; o Next.js 15 faz cache de Server Component renders automaticamente
</requirements>

## Subtasks

- [x] 2.1 Identificar o caminho correto do cliente Prisma no projeto (ex.: `lib/db.ts`, `lib/prisma.ts`)
- [x] 2.2 Criar `lib/nav-data.ts` com `getCategoriesForNav` seguindo a query do TechSpec
- [x] 2.3 Adicionar `getProductsForNav` com filtro `status='ativo'`, ordenação A–Z e `take: 30`
- [x] 2.4 Verificar compilação TypeScript e executar testes

## Implementation Details

Criar novo arquivo `lib/nav-data.ts`. As queries exatas estão na seção "Data Models" do TechSpec — não duplicar aqui.

Verificar antes de criar: o projeto usa `lib/db.ts` ou `lib/prisma.ts` para o singleton do Prisma. Usar o mesmo padrão dos outros arquivos em `lib/` e `actions/`.

### Relevant Files

- `lib/types.ts` — fonte de `CategorySummary` e `ProductNavItem` (task_01)
- `lib/db.ts` ou `lib/prisma.ts` — cliente Prisma; verificar qual existe no projeto
- `actions/products.ts` — referência de padrão de query Prisma já em uso no projeto

### Dependent Files

- `components/layout/Header.tsx` (task_07) — importará e chamará ambas as funções em `Promise.all`

### Related ADRs

- [ADR-001: Integrar CategoryNav existente ao Header](../adrs/adr-001.md) — Decisão de buscar dados server-side no Header via helpers

## Deliverables

- `lib/nav-data.ts` criado com `getCategoriesForNav` e `getProductsForNav`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração (mock Prisma) **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `getCategoriesForNav` com mock Prisma retornando 3 categorias pai com 2 filhas cada — retorna array com `parentId: null` e `children` ordenados A–Z
  - [x] `getCategoriesForNav` com banco vazio retorna array vazio sem erro
  - [x] `getProductsForNav` com mock de 50 produtos ativos retorna exatamente 30 itens
  - [x] `getProductsForNav` com mock de 5 produtos ativos retorna todos os 5 itens
  - [x] `getProductsForNav` filtra produtos com `status != 'ativo'` — esses não aparecem no retorno
  - [x] Retorno de `getProductsForNav` está ordenado A–Z por `name`
- Testes de integração:
  - [x] `Promise.all([getCategoriesForNav(), getProductsForNav()])` resolve sem erro com mock Prisma configurado
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `lib/nav-data.ts` criado e exportando ambas as funções tipadas corretamente
- `tsc --noEmit` retorna exit code 0
- Nenhum arquivo existente foi modificado por esta tarefa
