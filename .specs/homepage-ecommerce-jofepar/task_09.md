---
status: completed
title: CategoryProductSection — seção de produtos por categoria
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_06
---

# Task 09: CategoryProductSection — seção de produtos por categoria

## Overview

Cria o componente Server Component `components/home/CategoryProductSection.tsx` que renderiza uma seção de produtos por categoria-pai no estilo Jofepar: título com barra decorativa amber, grid de até 8 produtos usando `HomepageProductCard` e link "Ver todos" ao final. Não renderiza nada se a categoria não tiver produtos. Depende da task_01 (tipo `CategoryWithProducts`) e da task_06 (`HomepageProductCard`).

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Server Component (sem `'use client'`) em `components/home/CategoryProductSection.tsx`
- DEVE aceitar `category: CategoryWithProducts` e `whatsappNumber: string` como props
- DEVE retornar `null` se `category.products.length === 0` (sem seções vazias)
- DEVE renderizar o título da categoria com a barra decorativa amber esquerda (`w-1 h-6 bg-brand-amber`) e linha horizontal (`flex-1 h-px bg-gray-200`) conforme o TechSpec
- DEVE usar grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4` para o grid de produtos
- DEVE renderizar um `HomepageProductCard` por produto, passando `product` e `whatsappNumber`
- DEVE exibir link "Ver todos em {category.name} →" apontando para `/produtos?categoria={category.slug}`
- DEVE aplicar as classes Tailwind exatas da seção "CategoryProductSection.tsx" do TechSpec
</requirements>

## Subtasks

- [x] 9.1 Criar `components/home/CategoryProductSection.tsx` como Server Component
- [x] 9.2 Implementar guard de `products.length === 0` retornando null
- [x] 9.3 Implementar header da seção com barra amber, título H2 e linha divisória
- [x] 9.4 Implementar grid de produtos com `HomepageProductCard`
- [x] 9.5 Implementar link "Ver todos" para `/produtos?categoria=<slug>`
- [x] 9.6 Escrever testes unitários

## Implementation Details

Veja a seção "CategoryProductSection.tsx (NOVO)" do TechSpec para a estrutura JSX exata e as classes Tailwind.

O `HomepageProductCard` (task_06) é importado e usado para cada produto — não reimplementar a lógica do card aqui.

O título da seção usa `font-black uppercase tracking-wide text-brand-navy` para o estilo Jofepar característico.

O `whatsappNumber` recebido por esta seção deve ser repassado diretamente para cada `HomepageProductCard`.

### Relevant Files

- `components/home/CategoryProductSection.tsx` — arquivo a ser criado
- `components/home/HomepageProductCard.tsx` — importado (task_06)
- `lib/types.ts` — `CategoryWithProducts` (task_01)

### Dependent Files

- `app/(public)/page.tsx` (task_10) — importa `CategoryProductSection` e mapeia uma por categoria

### Related ADRs

Nenhum ADR específico se aplica a esta tarefa.

## Deliverables

- `components/home/CategoryProductSection.tsx` implementado e compilando
- Testes unitários cobrindo guard de vazio, título e grid **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Categoria com `products: []`: componente retorna null (nada renderizado)
  - [ ] Categoria com 4 produtos: renderiza 4 instâncias de `HomepageProductCard`
  - [ ] Título da seção exibe o `category.name` correto
  - [ ] Link "Ver todos" tem href `/produtos?categoria=<category.slug>`
  - [ ] Grid tem classes `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
  - [ ] `whatsappNumber` é passado corretamente para cada `HomepageProductCard`
  - [ ] Barra decorativa amber (`bg-brand-amber`) está presente no header da seção
- Testes de integração:
  - [ ] Múltiplas `CategoryProductSection` renderizadas na homepage: apenas categorias com produtos aparecem
  - [ ] `npx tsc --noEmit` passa com `CategoryWithProducts` importado

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Seções sem produtos não são renderizadas
- Título estilo Jofepar com barra amber
- Grid responsivo correto
- Link "Ver todos" funcional
