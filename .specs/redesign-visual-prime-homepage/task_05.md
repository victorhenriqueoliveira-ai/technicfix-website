---
status: completed
title: "FeaturedProducts.tsx: badge visual + card depth + preço amber"
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 05: FeaturedProducts.tsx: badge visual + card depth + preço amber

## Overview

Redesenha `components/home/FeaturedProducts.tsx` adicionando o badge dinâmico sobre a imagem do produto (quando `product.badge` não for nulo), aumentando a profundidade visual dos cards (sombra em camadas com translate no hover) e alterando a cor do preço para amber. A estrutura de grid e a lógica de dados permanecem intactas.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "FeaturedProducts.tsx" para classes, posicionamento e comportamento do badge
- FOQUE NO "QUÊ" — melhorias visuais no `ProductCard`; não alterar props de dados de `FeaturedProducts`
- MINIMIZE CÓDIGO — alterar classes existentes e adicionar o badge; não reorganizar a estrutura do componente
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE atualizar `ProductCard` para consumir `product.badge: string | null` do tipo `ProductSummary` (atualizado na task_01).
- DEVE renderizar o badge sobre a imagem quando `product.badge` não for nulo: `absolute top-3 left-3 z-10`, fundo `bg-brand-amber`, texto `text-brand-navy`, estilo `rounded-full text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5`.
- NÃO DEVE renderizar nenhum elemento de badge quando `product.badge` for `null` (sem espaço em branco extra).
- DEVE aumentar a sombra base do card de `shadow-sm` para `shadow-md`.
- DEVE adicionar `hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/10` ao card no hover.
- DEVE alterar a cor do preço de `text-brand-navy` para `text-brand-amber` mantendo `text-lg font-extrabold`.
- NÃO DEVE alterar a estrutura de grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).
- NÃO DEVE alterar o botão "Ver todos os produtos" além de adicionar `shadow-sm hover:shadow-md transition-shadow`.
- Toda alteração de classe DEVE usar tokens do design system — zero hex hardcoded.
</requirements>

## Subtasks

- [x] 5.1 Adicionar renderização condicional do badge sobre a imagem em `ProductCard`
- [x] 5.2 Atualizar sombra base do card de `shadow-sm` para `shadow-md`
- [x] 5.3 Adicionar `hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/10` ao card
- [x] 5.4 Alterar preço de `text-brand-navy` para `text-brand-amber`
- [x] 5.5 Adicionar `shadow-sm hover:shadow-md` ao botão "Ver todos"
- [x] 5.6 Verificar que produto sem badge não exibe espaço em branco extra

## Implementation Details

Ver TechSpec seção "FeaturedProducts.tsx" para o snippet exato do badge e as classes de sombra.

O badge deve ser renderizado dentro do `<div className="relative w-full aspect-square bg-gray-50">` que envolve a imagem — o contexto `relative` já existe para o `<Image fill>`, então `absolute top-3 left-3 z-10` funciona diretamente.

O elemento `<div className="relative w-full aspect-square bg-gray-50">` precisa garantir `overflow-hidden` para que o badge não vaze fora do canto arredondado do card (o card já tem `rounded-2xl overflow-hidden`).

O card wrapper (o `<Link>`) atualmente tem `transition-all duration-200`. Adicionar `-translate-y-1` ao hover exige que `transition-all` inclua `transform` — o que já acontece com `transition-all`. Nenhum ajuste extra necessário.

### Relevant Files

- `components/home/FeaturedProducts.tsx` — único arquivo a modificar
- `lib/types.ts` — `ProductSummary` com `badge: string | null` (adicionado na task_01)

### Dependent Files

- `app/(public)/page.tsx` — fornece `products` com `badge` via `getFeaturedProducts`; task_02 configura o mapeamento

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — badges e card depth como parte do redesign
- [ADR-003: Propagação do Campo Badge via page.tsx](adrs/adr-003.md) — origem do dado `product.badge`

## Deliverables

- `components/home/FeaturedProducts.tsx` com badge condicional, sombra em camadas e preço amber
- Card sem badge quando `product.badge` é `null` (sem gap visual) **(OBRIGATÓRIO)**
- Card com badge amber posicionado no canto superior esquerdo quando `product.badge` está preenchido **(OBRIGATÓRIO)**
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductCard` com `badge: null` não renderiza elemento de badge no DOM
  - [x] `ProductCard` com `badge: "Mais Vendido"` renderiza span com texto "MAIS VENDIDO" (uppercase) no canto superior esquerdo
  - [x] `ProductCard` com `badge: "Profissional"` renderiza badge com classes `bg-brand-amber` e `text-brand-navy`
  - [x] Preço renderiza com classe `text-brand-amber` (não `text-brand-navy`)
  - [x] Card tem classe `shadow-md` como base (não `shadow-sm`)
  - [x] Card tem `hover:-translate-y-1` na lista de classes
  - [x] Produto sem imagem exibe fallback SVG sem interferir com o badge
- Testes de integração:
  - [x] `FeaturedProducts` com array vazio retorna `null` sem erro
  - [x] `FeaturedProducts` com lista de produtos renderiza o grid completo sem overflow em 375px
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Badge visível em produtos com campo preenchido, ausente nos demais
- Preço em amber com legibilidade adequada sobre fundo branco (contraste ≥ 4.5:1)
- Hover de elevação (`-translate-y-1`) visualmente perceptível sem quebra de layout
