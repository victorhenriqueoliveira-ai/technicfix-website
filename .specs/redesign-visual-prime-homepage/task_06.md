---
status: completed
title: "CategoryGrid.tsx: hover elevation + labels uppercase"
type: frontend
complexity: low
dependencies: []
---

# Task 06: CategoryGrid.tsx: hover elevation + labels uppercase

## Overview

Redesenha visualmente `components/home/CategoryGrid.tsx` adicionando hover de elevação aos cards (translate + shadow profunda) e refinando o label do nome da categoria para uppercase com letter-spacing maior. Nenhuma alteração de dados, grid ou lógica de fallback de imagem.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "CategoryGrid.tsx" para as classes de hover exatas
- FOQUE NO "QUÊ" — 3 ajustes de classe CSS; não alterar estrutura do componente
- MINIMIZE CÓDIGO — substituir/adicionar classes; não reorganizar JSX
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/15` ao `<Link>` do card.
- DEVE manter `transition-all duration-200` já existente (os novos hovers funcionam automaticamente com `transition-all`).
- DEVE alterar o label do nome da categoria de `text-sm font-bold` para `text-xs font-bold uppercase tracking-wider`.
- DEVE alterar o fundo do placeholder sem imagem de `bg-brand-navy/5` para `bg-brand-navy-light/20`.
- NÃO DEVE alterar a estrutura do grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`).
- NÃO DEVE alterar a lógica de `isValidUrl`, o componente `<Image>` nem o `ScrewIcon` de fallback.
- NÃO DEVE alterar o heading da seção nem o eyebrow "Nosso Catálogo".
- Toda alteração de classe DEVE usar tokens do design system — zero hex hardcoded.
</requirements>

## Subtasks

- [x] 6.1 Adicionar `hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/15` ao wrapper `<Link>` do card
- [x] 6.2 Alterar label do nome de `text-sm font-bold` para `text-xs font-bold uppercase tracking-wider`
- [x] 6.3 Alterar fundo do placeholder de `bg-brand-navy/5` para `bg-brand-navy-light/20`
- [x] 6.4 Verificar visualmente em 375px e 1440px que o hover não causa overflow

## Implementation Details

Ver TechSpec seção "CategoryGrid.tsx" para as classes exatas de cada alteração.

O `<Link>` wrapper do card já possui `rounded-2xl overflow-hidden`. O `overflow-hidden` garante que o translate no hover não cause scroll horizontal — o elemento é contido pelo próprio card.

O `transition-all` já existente no card `<Link>` cobre `transform` e `box-shadow`, portanto nenhum `transition` adicional é necessário.

O label fica dentro de `<div className="p-3 border-t-2 border-transparent group-hover:border-brand-amber transition-colors">` — alterar apenas o `<span>` com o nome da categoria, não o container.

### Relevant Files

- `components/home/CategoryGrid.tsx` — único arquivo a modificar

### Dependent Files

- Nenhum arquivo depende das saídas desta tarefa

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — hover elevation como parte do polish de cards

## Deliverables

- `components/home/CategoryGrid.tsx` com hover elevation e labels uppercase
- Cards elevam-se no hover sem overflow horizontal em nenhum breakpoint **(OBRIGATÓRIO)**
- Label de categoria em uppercase com tracking-wider **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Card `<Link>` possui classe `hover:-translate-y-1` no DOM renderizado
  - [x] Card `<Link>` possui classe `hover:shadow-xl` no DOM renderizado
  - [x] Label de nome da categoria possui classe `uppercase` e `tracking-wider`
  - [x] Placeholder sem imagem usa `bg-brand-navy-light/20` (não `bg-brand-navy/5`)
  - [x] Grid de categorias renderiza 0 cards quando `categories` é array vazio (retorna `null`)
  - [x] Grid renderiza N cards correspondendo ao `categories.length`
- Testes de integração:
  - [x] Em viewport 375px, nenhum card causa overflow horizontal na seção
  - [x] Hover em card não quebra layout de categorias adjacentes
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Cards elevam-se no hover com sombra profunda perceptível
- Labels em uppercase com letter-spacing visualmente legíveis
- Nenhum overflow horizontal em qualquer breakpoint
