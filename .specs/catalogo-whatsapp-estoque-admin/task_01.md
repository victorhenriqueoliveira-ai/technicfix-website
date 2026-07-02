---
status: completed
title: Migration Prisma — model Sale, enum ProductType, campos novos em Product
type: infra
complexity: medium
dependencies: []
---

# Task 01: Migration Prisma — model Sale, enum ProductType, campos novos em Product

## Overview

Adiciona ao schema Prisma a model `Sale`, o enum `ProductType` e três novos campos em `Product` (`showPrice`, `productType`, `relatedProductIds`), além da relação `Product.sales`. Essa migration é o pré-requisito de todas as demais tasks — sem ela, o Prisma client não possui os tipos necessários para as Server Actions, componentes e páginas novas.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar enum `ProductType` com valores `varejo`, `atacado`, `ambos` ao schema Prisma.
- DEVE adicionar campo `showPrice Boolean @default(true)` ao model `Product`.
- DEVE adicionar campo `productType ProductType @default(ambos)` ao model `Product`.
- DEVE adicionar campo `relatedProductIds String[] @default([])` ao model `Product`.
- DEVE criar model `Sale` com campos: `id`, `productId` (FK obrigatória para Product), `quantity Int`, `buyerType LeadType`, `notes String?`, `createdAt DateTime @default(now())`.
- DEVE adicionar relação `sales Sale[]` ao model `Product`.
- DEVE gerar e aplicar a migration via `prisma migrate dev`.
- DEVE regenerar o Prisma client após a migration.
- NÃO DEVE alterar campos ou relações existentes que não fazem parte desta task.
- Os valores default devem garantir que produtos existentes não quebrem: `showPrice = true`, `productType = ambos`.
</requirements>

## Subtasks

- [x] 1.1 Adicionar enum `ProductType` e campos `showPrice`, `productType`, `relatedProductIds` ao model `Product` em `prisma/schema.prisma`.
- [x] 1.2 Criar model `Sale` com todos os campos especificados e relação com `Product`.
- [x] 1.3 Adicionar `sales Sale[]` ao model `Product`.
- [x] 1.4 Rodar `prisma migrate dev --name add_sale_product_type` e verificar que a migration foi criada sem erros.
- [x] 1.5 Verificar que `prisma generate` conclui sem erros e que os novos tipos estão disponíveis no client.
- [x] 1.6 Confirmar que registros `Product` existentes continuam acessíveis com os novos campos no valor default.

## Implementation Details

Ver seção "Data Models" do TechSpec para o schema Prisma completo de `Sale`, `ProductType` e os campos novos em `Product`.

O arquivo `prisma/prisma.config.ts` declara o caminho do schema e da migration — não alterar esse arquivo.

O padrão de configuração do datasource (sem `url` no `schema.prisma`, com URL em `prisma.config.ts`) deve ser mantido conforme já existente.

### Relevant Files

- `prisma/schema.prisma` — arquivo principal a modificar com novos modelos e campos
- `prisma/prisma.config.ts` — configuração do Prisma 7; não alterar
- `lib/prisma.ts` — exporta `db`; o client regenerado estará disponível automaticamente

### Dependent Files

- `actions/sales.ts` (task_02) — usa `db.sale` e `db.product` com os novos campos
- `actions/leads.ts` (task_03) — usa `db.siteConfig` para obter `contactEmail`
- `actions/products.ts` (task_04) — usa `showPrice`, `productType`, `relatedProductIds`
- `components/catalog/ProductCTAs.tsx` (task_05) — usa `productType` via props
- `components/catalog/RelatedProducts.tsx` (task_06) — usa `relatedProductIds`
- `app/(admin)/admin/produtos/page.tsx` (task_10) — usa `stock` com alerta condicional

### Related ADRs

- [ADR-004: Nova model Sale separada](adrs/adr-004.md) — Justifica criação da model Sale em vez de reutilizar Lead

## Deliverables

- `prisma/schema.prisma` atualizado com model `Sale`, enum `ProductType` e campos novos em `Product`
- Migration gerada em `prisma/migrations/` e aplicada ao banco
- Prisma client regenerado com os novos tipos
- Testes de integração validando schema e defaults **(OBRIGATÓRIO)**

## Tests

- Testes de integração:
  - [ ] Criar um `Product` sem informar `showPrice` e `productType` — deve persistir com `showPrice=true` e `productType='ambos'`.
  - [ ] Criar um `Sale` com `productId` válido, `quantity=2`, `buyerType='varejo'` — deve ser persistido com `createdAt` preenchido.
  - [ ] Tentar criar um `Sale` com `productId` inexistente — deve falhar com erro de FK.
  - [ ] Buscar produto existente (pré-migration) com `db.product.findFirst` — deve retornar `showPrice=true` e `productType='ambos'` sem erro.
  - [ ] Array `relatedProductIds` vazio no produto existente — `[]` deve ser o valor padrão.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Migration aplicada sem erros em ambiente de desenvolvimento
- `npx prisma validate` retorna sem erros
- Produtos existentes continuam acessíveis sem regressão de dados
