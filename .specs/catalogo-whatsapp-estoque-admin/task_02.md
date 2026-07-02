---
status: completed
title: Server Actions de Vendas (registerSale, getSalesSummary, getTopProducts)
type: backend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Server Actions de Vendas (registerSale, getSalesSummary, getTopProducts)

## Overview

Cria o arquivo `actions/sales.ts` com três Server Actions: `registerSale` (valida estoque e cria `Sale` + decrementa `Product.stock` em transação), `getSalesSummary` (agrega vendas por dia para o gráfico do dashboard) e `getTopProducts` (ranking dos produtos mais vendidos). Estas actions são o núcleo do módulo de vendas e alimentam tanto a página de vendas (task_08) quanto o dashboard (task_09).

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE implementar `registerSale(input)` que: valida `quantity > 0` e `quantity <= Product.stock` atual; cria `Sale` e decrementa `Product.stock` em `db.$transaction`; retorna `{ success, newStock }` em caso de sucesso ou `{ success: false, error }` em caso de falha.
- DEVE bloquear `registerSale` se `quantity > stock`, retornando `{ success: false, error: 'Estoque insuficiente' }` sem criar nenhum registro.
- DEVE implementar `getSalesSummary({ period })` com suporte a `'7d'`, `'30d'` e `'month'`; retorna array `{ date: string, total: number }[]` agrupado por dia.
- DEVE implementar `getTopProducts({ period, limit })` retornando array `{ productId, productName, totalSold }[]` ordenado por `totalSold` decrescente.
- DEVE usar `db.$transaction` no `registerSale` para garantir atomicidade entre criação de `Sale` e decremento de `stock`.
- DEVE marcar o arquivo com `'use server'` no topo.
- Interfaces de retorno DEVEM seguir a seção "Core Interfaces" do TechSpec.
</requirements>

## Subtasks

- [x] 2.1 Criar `actions/sales.ts` com `'use server'` e imports necessários (`db`, tipos Prisma).
- [x] 2.2 Implementar `registerSale`: buscar estoque atual, validar, executar transação, retornar resultado.
- [x] 2.3 Implementar `getSalesSummary`: construir filtro de data por período, agrupar por dia com `db.sale.groupBy`.
- [x] 2.4 Implementar `getTopProducts`: agrupar por `productId`, somar `quantity`, juntar com nome do produto, ordenar.
- [x] 2.5 Exportar as três functions e verificar que TypeScript compila sem erros.

## Implementation Details

Ver seção "API Endpoints (Server Actions)" e "Core Interfaces" do TechSpec para assinaturas completas e tipos de retorno.

Padrão de importação do db: `import { db } from '@/lib/prisma'` (igual às demais actions do projeto).

O padrão `'use server'` no topo do arquivo é obrigatório para que Next.js trate as funções como Server Actions — ver `actions/leads.ts` como referência do padrão existente.

Para `getSalesSummary`, o agrupamento por data pode ser feito com `db.sale.groupBy({ by: ['createdAt'], _sum: { quantity: true } })` com filtro `where: { createdAt: { gte: startDate } }` e pós-processamento para formatar as datas como `'YYYY-MM-DD'`.

### Relevant Files

- `actions/leads.ts` — referência de padrão para Server Actions com `db` e retorno `{ success, error }`
- `actions/products.ts` — referência de padrão de transação e validação
- `lib/prisma.ts` — exporta `db` com o Prisma client
- `prisma/schema.prisma` — model `Sale` e campos `stock` em `Product` (criados na task_01)

### Dependent Files

- `app/(admin)/admin/vendas/page.tsx` (task_08) — chama `registerSale` via `RegisterSaleDrawer`
- `app/(admin)/admin/page.tsx` (task_09) — chama `getSalesSummary` e `getTopProducts`
- `components/admin/RegisterSaleDrawer.tsx` (task_08) — chama `registerSale`

### Related ADRs

- [ADR-004: Nova model Sale separada](adrs/adr-004.md) — Justifica uso de `db.$transaction` entre `Sale` e `Product.stock`

## Deliverables

- `actions/sales.ts` com as três Server Actions implementadas e exportadas
- Testes unitários para `registerSale` (validação de estoque) **(OBRIGATÓRIO)**
- Testes de integração para transação atômica **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `registerSale` com `quantity=1` e produto com `stock=5` — deve retornar `{ success: true, newStock: 4 }`.
  - [x] `registerSale` com `quantity=10` e produto com `stock=5` — deve retornar `{ success: false, error: 'Estoque insuficiente' }` sem criar `Sale`.
  - [x] `registerSale` com `quantity=0` — deve retornar `{ success: false, error }` de validação.
  - [x] `getSalesSummary({ period: '7d' })` — deve retornar array com no máximo 7 entradas, cada uma com `date` no formato `'YYYY-MM-DD'` e `total >= 0`.
  - [x] `getSalesSummary({ period: 'month' })` — deve retornar apenas vendas do mês corrente.
  - [x] `getTopProducts({ period: '30d', limit: 5 })` — deve retornar no máximo 5 itens, ordenados por `totalSold` decrescente.
- Testes de integração:
  - [x] `registerSale` bem-sucedida: verificar que `Sale` foi criada E `Product.stock` decrementou atomicamente.
  - [x] Falha simulada no `db.sale.create` dentro da transação: verificar que `Product.stock` NÃO foi alterado.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `registerSale` nunca produz estoque negativo
- TypeScript compila sem erros em `actions/sales.ts`
- Transação garante atomicidade entre criação de `Sale` e decremento de `stock`
