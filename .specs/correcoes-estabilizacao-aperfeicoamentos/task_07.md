---
status: completed
title: Substituir inline style por h-[650px] no Hero.tsx
type: frontend
complexity: low
dependencies: []
---

# Task 07: Substituir inline style por `h-[650px]` no `Hero.tsx`

## Overview

Substitui a única declaração `style={{ height: '650px' }}` no componente `Hero.tsx` pela classe Tailwind equivalente `h-[650px]`. O comportamento visual permanece idêntico; apenas a forma de expressão do estilo muda para ser consistente com o restante do arquivo.

<critical>
- SEMPRE LEIA o PRD (F6) e o TechSpec (seção "Impact Analysis") antes de começar
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- A declaração `style={{ height: '650px' }}` no elemento `<section>` de `Hero.tsx` DEVE ser removida
- `h-[650px]` DEVE ser adicionado ao `className` do mesmo elemento
- O comportamento visual do Hero (altura, layout, imagem de fundo) DEVE permanecer idêntico
- Nenhum outro estilo, classe ou prop do componente DEVE ser alterado
</requirements>

## Subtasks

- [x] 7.1 Localizar o elemento com `style={{ height: '650px' }}` em `Hero.tsx`
- [x] 7.2 Remover o atributo `style` e adicionar `h-[650px]` ao `className` existente
- [x] 7.3 Verificar visualmente que a altura do Hero não mudou em viewport desktop e mobile

## Implementation Details

Exploração confirmou: `Hero.tsx` é um Client Component (`'use client'`). O inline style `style={{ height: '650px' }}` está no elemento `<section>` principal (linha ~74). Todos os outros estilos do arquivo já usam Tailwind.

Tailwind v4 (usado no projeto) suporta valores arbitrários com `h-[650px]` sem necessidade de configuração adicional.

### Relevant Files

- `components/home/Hero.tsx` — único arquivo a modificar

### Dependent Files

Nenhum arquivo depende de `Hero.tsx` de forma que esta mudança os afete.

### Related ADRs

Nenhum ADR se aplica a esta task.

## Deliverables

- `components/home/Hero.tsx` sem `style={{ height: '650px' }}`, com `h-[650px]` no `className`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `Hero` renderiza sem prop `style` no elemento `<section>` raiz
  - [x] `Hero` renderiza com classe `h-[650px]` no elemento `<section>` raiz
  - [x] `grep -n "style=" components/home/Hero.tsx` retorna zero resultados
- Testes de integração:
  - [x] Página inicial (`/`) renderiza Hero com altura visualmente equivalente a 650px antes e depois da mudança
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `grep -n 'style=' components/home/Hero.tsx` retorna zero resultados
- Build sem erros TypeScript
