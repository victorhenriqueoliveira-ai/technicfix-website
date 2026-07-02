---
status: completed
title: Componente RelatedProducts (Server Component)
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 06: Componente RelatedProducts (Server Component)

## Overview

Cria `components/catalog/RelatedProducts.tsx` como Server Component que busca e exibe produtos relacionados ao produto atual: primeiro os fixados manualmente via `relatedProductIds` (campo criado na task_01), complementados automaticamente por produtos da mesma categoria. Exibe entre 3 e 8 produtos em grid responsivo reutilizando o `ProductCard` existente, aumentando o tempo de permanência na página e a chance de cross-sell.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Server Component (sem `'use client'`).
- DEVE aceitar props: `productId` (produto atual a excluir dos resultados), `categoryId` (para busca automática), `relatedProductIds` (IDs fixados manualmente pelo admin).
- DEVE buscar primeiro os produtos de `relatedProductIds`, filtrando apenas os com `status='ativo'`.
- DEVE complementar com produtos da mesma `categoryId` (excluindo o produto atual e os já incluídos via IDs manuais) até atingir o limite total de 8.
- DEVE exibir no mínimo 3 produtos; se a busca retornar menos de 3, não renderizar a seção (retornar `null`).
- DEVE reutilizar o componente `ProductCard` existente para cada item do grid.
- DEVE renderizar um grid responsivo: 2 colunas em mobile, 3 em tablet, 4 em desktop.
- NÃO DEVE exibir produtos com `status='inativo'` nos relacionados.
</requirements>

## Subtasks

- [x] 6.1 Criar `components/catalog/RelatedProducts.tsx` como async Server Component.
- [x] 6.2 Implementar query de produtos manuais (por `relatedProductIds`) com filtro `status='ativo'`.
- [x] 6.3 Implementar query complementar por categoria, excluindo o produto atual e os manuais já incluídos.
- [x] 6.4 Implementar lógica de limite (máx 8) e condição mínima (< 3 → retornar `null`).
- [x] 6.5 Renderizar grid com `ProductCard` e título "Produtos Relacionados".

## Implementation Details

Ver seção "Component Overview" do TechSpec (bloco `[RelatedProducts]`) e a nota técnica em "Known Risks" sobre `relatedProductIds` com IDs órfãos — a query deve usar `where: { id: { in: relatedIds }, status: 'ativo' }` para filtrar automaticamente IDs inválidos.

O `ProductCard` existente em `components/catalog/ProductCard.tsx` aceita props do produto — verificar sua interface antes de implementar o grid.

A query deve ser feita diretamente com `db.product.findMany` — sem criar uma Server Action separada para isso (o componente é Server Component e tem acesso direto ao `db`).

### Relevant Files

- `components/catalog/ProductCard.tsx` — componente reutilizado no grid de relacionados
- `prisma/schema.prisma` — campos `relatedProductIds`, `status`, `categoryId` em `Product` (task_01)
- `lib/prisma.ts` — exporta `db` para uso direto no Server Component
- `app/(public)/produtos/[slug]/page.tsx` — ponto de integração onde `RelatedProducts` será inserido (task_07)

### Dependent Files

- `app/(public)/produtos/[slug]/page.tsx` (task_07) — importa e renderiza `RelatedProducts` ao final da página

### Related ADRs

Nenhum ADR específico para esta task.

## Deliverables

- `components/catalog/RelatedProducts.tsx` implementado
- Testes unitários para lógica de seleção e limite de produtos **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Com 5 IDs manuais todos ativos e 10 produtos na categoria — deve retornar exatamente 8 (5 manuais + 3 da categoria).
  - [x] Com 0 IDs manuais e 4 produtos ativos na categoria (excluindo o atual) — deve retornar os 4.
  - [x] Com 0 IDs manuais e 2 produtos ativos na categoria — deve retornar `null` (menos de 3).
  - [x] IDs manuais com um produto `status='inativo'` — produto inativo NÃO deve aparecer no resultado.
  - [x] IDs manuais com um ID inexistente no banco — deve ser ignorado sem erro.
  - [x] O produto atual (`productId`) nunca aparece nos relacionados.
- Testes de integração:
  - [ ] Query real ao banco: produto com `relatedProductIds` preenchidos retorna os relacionados corretos na ordem (manuais primeiro). (Não implementado — requer banco real; coberto por mocks unitários)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Seção não é renderizada quando há menos de 3 relacionados disponíveis
- IDs de produtos deletados não causam erro de runtime
- Grid responsivo verificado manualmente em mobile e desktop
