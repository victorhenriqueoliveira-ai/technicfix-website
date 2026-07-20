---
status: completed
title: Criar PriceFilter.tsx e estender produtos/page.tsx com filtro de preço
type: frontend
complexity: medium
dependencies:
  - task_06
---

# Task 10: Criar `PriceFilter.tsx` e estender `produtos/page.tsx` com filtro de preço

## Overview

Cria o componente Client Component `PriceFilter` usando o `@base-ui/react` Slider já instalado e estende a página de catálogo para aceitar `minPrice`/`maxPrice` nos searchParams, filtrar produtos por faixa de preço na query Prisma, e adicionar canonical quando o filtro de categoria está ativo.

<critical>
- SEMPRE LEIA o PRD (F10) e o TechSpec (seções "Core Interfaces", "Data Models" e ADR-003, ADR-005) antes de começar
- REFERENCIE O TECHSPEC para a interface `PriceFilterProps`, a query Prisma com `Decimal`, e o código de canonical
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `PriceFilter.tsx` DEVE ser um Client Component (`'use client'`) usando `@base-ui/react/Slider`
- O Slider DEVE operar em range mode com dois handles (mínimo e máximo)
- `onValueCommitted` DEVE chamar `router.push` com `minPrice` e `maxPrice` nos searchParams, preservando `categoria` e `busca` existentes
- Os valores atuais DEVEM ser exibidos em tempo real no formato BRL (ex.: `R$ 25,00 — R$ 350,00`)
- `produtos/page.tsx` DEVE ler `minPrice` e `maxPrice` de `searchParams` e passá-los como filtros `gte`/`lte` na query Prisma
- Produtos com `price = null` DEVEM ser excluídos quando o filtro de preço está ativo (comportamento automático das condições `gte`/`lte`)
- `generateMetadata` em `produtos/page.tsx` DEVE retornar `alternates: { canonical: '/categorias/${categoria}' }` quando `categoria` está presente no searchParams
- `revalidateAll()` em `actions/products.ts` DEVE incluir `revalidatePath('/categorias/[slug]', 'page')` para invalidar landing pages de categoria
- VERIFICAR se `@base-ui/react` Slider suporta range mode (array de dois valores) antes de implementar — ver documentação instalada
</requirements>

## Subtasks

- [x] 10.1 Ler a documentação de `@base-ui/react/Slider` instalada em `node_modules/@base-ui/react` para confirmar suporte a range mode e API de `onValueCommitted`
- [x] 10.2 Criar `components/catalog/PriceFilter.tsx` com Slider de dois handles, display BRL e chamada a `router.push`
- [x] 10.3 Calcular `minPrice` e `maxPrice` globais (mínimo e máximo de todos os produtos ativos) para definir os limites do slider
- [x] 10.4 Estender `searchParams` de `app/(public)/produtos/page.tsx` para ler `minPrice` e `maxPrice`
- [x] 10.5 Adicionar condições `price: { gte: Decimal }` e `price: { lte: Decimal }` na query Prisma
- [x] 10.6 Adicionar `generateMetadata` com canonical em `produtos/page.tsx` quando `categoria` está presente
- [x] 10.7 Adicionar `PriceFilter` na sidebar da página de produtos, abaixo do filtro de categorias
- [x] 10.8 Adicionar `revalidatePath('/categorias/[slug]', 'page')` em `revalidateAll()` em `actions/products.ts`

## Implementation Details

`produtos/page.tsx` atualmente tem `searchParams: Promise<{ categoria?, busca?, page? }>`. A extensão adiciona `minPrice?: string` e `maxPrice?: string` (searchParams são sempre strings).

Os valores de `minPrice`/`maxPrice` recebidos como string devem ser convertidos para `new Decimal(value)` antes de passar para o Prisma. Verificar que `Decimal` é importado de `@prisma/client` ou de `decimal.js`.

O cálculo de limites globais (min e max de preços ativos) pode ser feito com:
```
db.product.aggregate({ _min: { price: true }, _max: { price: true }, where: { status: 'ativo', price: { not: null } } })
```

Ver TechSpec seção "Data Models" para a query Prisma exata e ADR-003 para a estrutura do componente `PriceFilter`.

### Relevant Files

- `components/catalog/PriceFilter.tsx` — arquivo novo a criar
- `app/(public)/produtos/page.tsx` — estender searchParams, query, metadata e sidebar
- `actions/products.ts` — adicionar `revalidatePath` para categorias
- `lib/types.ts` — `ProductWithCategory` disponível após task_06

### Dependent Files

- `app/(public)/categorias/[slug]/page.tsx` — task_11 reutiliza a lógica de query de produtos estendida nesta task

### Related ADRs

- [ADR-003: Componente Slider de preço via @base-ui/react](adrs/adr-003.md) — define o uso de `@base-ui/react` e o evento `onValueCommitted`
- [ADR-005: /categorias/[slug] como URL canônica](adrs/adr-005.md) — define que `/produtos?categoria=` deve ter canonical apontando para `/categorias/[slug]`

## Deliverables

- `components/catalog/PriceFilter.tsx` criado e funcional
- `app/(public)/produtos/page.tsx` com filtro de preço na query e canonical em metadata
- `actions/products.ts` com `revalidatePath` para `/categorias/[slug]`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `PriceFilter` com `currentMin=50, currentMax=200` exibe `R$ 50,00 — R$ 200,00`
  - [ ] `PriceFilter` ao disparar `onValueCommitted([30, 150])` chama `router.push` com `minPrice=30&maxPrice=150` preservando outros params
  - [ ] `PriceFilter` ao disparar `onValueCommitted([min, max])` (valores iguais aos limites globais) remove os params `minPrice`/`maxPrice` da URL (ou os inclui — definir comportamento esperado)
  - [ ] `produtos/page.tsx` com `minPrice=50&maxPrice=200` no searchParams monta query Prisma com `price: { gte: 50, lte: 200 }`
  - [ ] `produtos/page.tsx` sem `minPrice`/`maxPrice` monta query sem filtros de preço
  - [ ] `generateMetadata` com `categoria=parafusos` retorna `alternates.canonical = '/categorias/parafusos'`
  - [ ] `generateMetadata` sem `categoria` retorna objeto de metadata sem `alternates.canonical`
- Testes de integração:
  - [ ] Em `/produtos?minPrice=10&maxPrice=100`, apenas produtos com preço entre R$10 e R$100 aparecem na listagem
  - [ ] Filtro de preço combinado com `busca=parafuso` retorna apenas produtos que atendem ambos os critérios
  - [ ] Em `/produtos?categoria=parafusos`, `<head>` contém `<link rel="canonical" href="/categorias/parafusos">`
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Slider funciona em touch (mobile) e arrasto de mouse (desktop)
- Estado preservado na URL ao navegar com botão voltar
- Nenhuma nova dependência npm adicionada
