---
status: completed
title: Integrar navegação ao Header.tsx
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_05
  - task_06
---

# Task 7: Integrar navegação ao Header.tsx

## Overview

Integra todas as peças ao `Header.tsx`: adiciona `Promise.all([getCategoriesForNav(), getProductsForNav()])` no render do Server Component, passa `categories` e `products` para `MobileMenu` e `CategoryNav`/`ProductsDropdown`, e insere `CategoryNav` como Camada 3 no desktop e `ProductsDropdown` ao lado dos itens de navegação desktop. Esta é a tarefa de integração final da feature de navegação.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE manter `Header.tsx` como Server Component (sem `'use client'`)
- DEVE adicionar `Promise.all([getCategoriesForNav(), getProductsForNav()])` importando de `lib/nav-data.ts` — veja ADR-002 e seção "System Architecture" do TechSpec
- DEVE passar `categories` e `products` como props para `MobileMenu`
- DEVE passar `categories` para `CategoryNav` na Camada 3 (desktop only) — verificar se `CategoryNav` já aceita a prop ou precisa de ajuste mínimo
- DEVE renderizar `ProductsDropdown` com `products` no MainBar desktop (`hidden md:flex`)
- DEVE renderizar `MobileMenu` com ambas as props para uso mobile
- NÃO DEVE converter `Header.tsx` para Client Component
- NÃO DEVE alterar a estrutura das Camadas 1 (TopBar) e 2 (MainBar) além da inserção dos novos componentes
</requirements>

## Subtasks

- [x] 7.1 Ler o `Header.tsx` atual para entender a estrutura existente de camadas (TopBar, MainBar, Camada 3) e os imports em uso
- [x] 7.2 Adicionar `Promise.all([getCategoriesForNav(), getProductsForNav()])` no corpo async do Header
- [x] 7.3 Importar e renderizar `MobileMenu` passando `categories` e `products`
- [x] 7.4 Importar e renderizar `ProductsDropdown` no MainBar desktop com `products`
- [x] 7.5 Confirmar que `CategoryNav` está na Camada 3 desktop e passa `categories` corretamente (adicionar prop se necessário)
- [x] 7.6 Verificar visualmente que desktop e mobile não têm regressões
- [x] 7.7 Executar testes

## Implementation Details

Modificar `components/layout/Header.tsx`. Veja a seção "Component Overview" e as "Notas de Implementação" do ADR-002 para o esquema exato de como o Header deve ficar após a integração.

Atenção ao risco descrito em TechSpec "Known Risks": `CategoryNav` tem seu próprio `bg-brand-navy` — testar visualmente se há conflito com o `shadow-md` do `<header>`.

Verificar antes de implementar: `CategoryNav` já aceita `categories` como prop ou renderiza seus próprios dados? A resposta determinará se a Camada 3 exige ajuste em `CategoryNav.tsx`.

### Relevant Files

- `components/layout/Header.tsx` — arquivo principal a modificar
- `lib/nav-data.ts` — fonte de `getCategoriesForNav` e `getProductsForNav` (task_02)
- `components/layout/CategoryNav.tsx` — a integrar na Camada 3; verificar assinatura de props
- `components/layout/ProductsDropdown.tsx` — novo componente a renderizar (task_05)
- `components/layout/MobileMenu.tsx` — novo componente a renderizar (task_06)

### Dependent Files

- `app/(public)/layout.tsx` — renderiza o `Header`; não deve precisar de alterações
- Todas as páginas públicas — herdam o Header via layout; confirmar que não há regressões

### Related ADRs

- [ADR-001: Integrar CategoryNav existente ao Header](../adrs/adr-001.md) — Decisão de reuso do CategoryNav na Camada 3
- [ADR-002: Extrair MobileMenu como Client Component](../adrs/adr-002.md) — Define que Header permanece Server Component com fetch server-side

## Deliverables

- `components/layout/Header.tsx` atualizado com fetch de navegação e novos componentes integrados
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `Header` renderiza sem erros quando `getCategoriesForNav` retorna array vazio e `getProductsForNav` retorna array vazio (mock das funções)
  - [ ] `Header` renderiza sem erros com 5 categorias e 10 produtos (mock das funções)
  - [ ] `MobileMenu` está presente na DOM ao renderizar o Header
  - [ ] `ProductsDropdown` está presente na DOM ao renderizar o Header
  - [ ] `CategoryNav` está presente na DOM (Camada 3) ao renderizar o Header
  - [ ] `getCategoriesForNav` e `getProductsForNav` são chamadas uma vez cada no render
- Testes de integração:
  - [ ] GET `/` (qualquer página pública) renderiza sem erro de runtime com o Header completo
  - [ ] `Promise.all` de `getCategoriesForNav` e `getProductsForNav` resolve corretamente com dados mockados do Prisma
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `Header.tsx` permanece Server Component (sem `'use client'`)
- `CategoryNav`, `ProductsDropdown` e `MobileMenu` visíveis em desktop/mobile respectivamente
- Nenhuma regressão nas páginas públicas existentes
- `tsc --noEmit` retorna exit code 0
