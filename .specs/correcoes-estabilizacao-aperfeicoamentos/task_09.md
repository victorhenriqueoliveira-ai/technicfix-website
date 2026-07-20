---
status: completed
title: Converter RelatedProducts.tsx para carrossel CSS scroll snap
type: frontend
complexity: low
dependencies:
  - task_06
---

# Task 09: Converter `RelatedProducts.tsx` para carrossel CSS scroll snap

## Overview

Converte o container de grid em `RelatedProducts.tsx` para um carrossel horizontal usando CSS scroll snap nativo. O componente permanece Server Component (sem hidratação adicional), o scroll funciona por toque em mobile e por trackpad/shift+scroll em desktop.

<critical>
- SEMPRE LEIA o PRD (F8) e o TechSpec (seção "System Architecture", ADR-004) antes de começar
- REFERENCIE O TECHSPEC para as classes Tailwind exatas do container e dos cards
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- O container de produtos relacionados DEVE usar `flex overflow-x-auto scroll-smooth snap-x snap-mandatory` em vez de `grid`
- Cada card DEVE ter largura fixa responsiva (`w-52 sm:w-60`) e `flex-none snap-start`
- A barra de scroll DEVE ser ocultada visualmente via `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`
- O componente DEVE permanecer Server Component (`async function`, sem `'use client'`)
- A seção DEVE continuar renderizando `null` quando há menos de 3 produtos disponíveis
- `ProductCard` existente DEVE ser reutilizado para cada item do carrossel
- A seção "Produtos Relacionados" DEVE ter um título visível acima do carrossel
</requirements>

## Subtasks

- [x] 9.1 Identificar o elemento container de grid atual em `RelatedProducts.tsx`
- [x] 9.2 Substituir as classes de grid pelo flex + scroll snap conforme TechSpec ADR-004
- [x] 9.3 Adicionar `w-52 sm:w-60 flex-none snap-start` em cada wrapper de card
- [x] 9.4 Adicionar classes de scroll invisível no container
- [x] 9.5 Testar em mobile (375px) que o carrossel faz snap entre cards corretamente
- [x] 9.6 Testar em desktop que o carrossel scrolls horizontalmente com shift+scroll ou trackpad

## Implementation Details

`RelatedProducts.tsx` atualmente renderiza um grid de 2/3/4 colunas (`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4`). A mudança é somente nas classes do container e no wrapper de cada card.

Ver TechSpec ADR-004 "Notas de Implementação" para as classes exatas do container:
```
flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
```

O componente usa `(p as { badge?: string | null }).badge` — não alterar este cast.

### Relevant Files

- `components/catalog/RelatedProducts.tsx` — único arquivo a modificar

### Dependent Files

- `app/(public)/produtos/[slug]/page.tsx` — renderiza `RelatedProducts`; layout pode mudar visualmente

### Related ADRs

- [ADR-004: Carrossel de produtos relacionados via CSS scroll snap](adrs/adr-004.md) — define a abordagem CSS-only e classes exatas a usar

## Deliverables

- `components/catalog/RelatedProducts.tsx` com container convertido para flex + scroll snap
- Nenhuma nova dependência adicionada
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `RelatedProducts` renderiza `null` quando há menos de 3 produtos
  - [x] `RelatedProducts` renderiza o container com classe `overflow-x-auto` quando há 3 ou mais produtos
  - [x] `RelatedProducts` renderiza o container com classe `snap-x` e `snap-mandatory`
  - [x] Cada card wrapper tem classe `flex-none` e `snap-start`
  - [x] Componente é Server Component (não contém `'use client'`)
- Testes de integração:
  - [x] Em uma página de produto com 3+ relacionados, o carrossel é visível e navegável por scroll horizontal em mobile (375px)
  - [x] O snap para no card correto ao soltar o dedo em mobile
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Nenhum `'use client'` em `RelatedProducts.tsx`
- Carrossel funcional em iOS Safari (testado em DevTools ou dispositivo real)
- Nenhuma nova dependência npm adicionada
