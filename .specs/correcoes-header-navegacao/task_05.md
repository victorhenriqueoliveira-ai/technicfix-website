---
status: completed
title: Criar ProductsDropdown.tsx
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 5: Criar ProductsDropdown.tsx

## Overview

Cria o Client Component `ProductsDropdown.tsx` que exibe um dropdown desktop com até 30 produtos ativos em ordem alfabética (A–Z) mais o link fixo "Ver todos os produtos". O comportamento de hover usa `useState<boolean>` + `onMouseEnter`/`onMouseLeave`, idêntico ao padrão já adotado no `CategoryNav.tsx` existente.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um `'use client'` Component em `components/layout/ProductsDropdown.tsx`
- DEVE aceitar `products: ProductNavItem[]` como prop — veja "Core Interfaces" do TechSpec
- DEVE exibir cada produto como link para `/produtos/[slug]`
- DEVE exibir o link "Ver todos os produtos" apontando para `/produtos` ao final da lista, sempre visível independente da quantidade de produtos
- DEVE controlar abertura/fechamento via `useState<boolean>` + `onMouseEnter`/`onMouseLeave` — padrão do `CategoryNav.tsx`
- DEVE ser visível apenas em desktop (`hidden md:flex` ou similar via Tailwind) — mobile usa accordion no `MobileMenu`
- NÃO DEVE renderizar nada em mobile (o accordion de produtos mobile está em `MobileMenu.tsx`)
- NÃO DEVE adicionar dependências npm para o comportamento de hover
</requirements>

## Subtasks

- [x] 5.1 Ler `components/layout/CategoryNav.tsx` para entender o padrão exato de hover com `useState` a replicar
- [x] 5.2 Criar `components/layout/ProductsDropdown.tsx` com a prop `products: ProductNavItem[]`
- [x] 5.3 Implementar o dropdown com lista de links e o link "Ver todos os produtos" ao final
- [x] 5.4 Aplicar classes Tailwind de visibilidade (`hidden md:flex`) e estilo consistente com o Header
- [x] 5.5 Escrever testes do componente

## Implementation Details

Criar novo arquivo `components/layout/ProductsDropdown.tsx`. Seguir o padrão de hover de `CategoryNav.tsx` — veja a seção "Technical Considerations / Key Decisions" do TechSpec e ADR-003.

Veja também a seção "Component Overview" do TechSpec para entender o posicionamento deste componente na hierarquia do Header.

### Relevant Files

- `components/layout/CategoryNav.tsx` — padrão de hover com `useState` a replicar
- `lib/types.ts` — fonte de `ProductNavItem` (task_01)

### Dependent Files

- `components/layout/Header.tsx` (task_07) — importará e renderizará `ProductsDropdown` no MainBar desktop, passando `products`

### Related ADRs

- [ADR-003: ProductsDropdown com React state hover, consistente com CategoryNav](../adrs/adr-003.md) — Define o padrão de implementação do hover

## Deliverables

- `components/layout/ProductsDropdown.tsx` criado
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductsDropdown` com `products=[]` renderiza apenas o link "Ver todos os produtos"
  - [x] `ProductsDropdown` com 3 produtos renderiza 3 links de produto + link "Ver todos os produtos" (total 4 links)
  - [x] `ProductsDropdown` com 30 produtos renderiza 30 links de produto + link "Ver todos os produtos"
  - [x] Link "Ver todos os produtos" sempre aponta para `/produtos`
  - [x] Link do primeiro produto aponta para `/produtos/[slug]` correto
  - [x] Dropdown não é visível por padrão (estado inicial `isOpen = false`)
  - [x] `onMouseEnter` no elemento raiz abre o dropdown (`isOpen = true`)
  - [x] `onMouseLeave` no elemento raiz fecha o dropdown (`isOpen = false`)
- Testes de integração:
  - [x] `ProductsDropdown` inserido em um Header mockado renderiza sem erro
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Dropdown abre ao hover e fecha ao sair em desktop
- Link "Ver todos os produtos" sempre visível no final da lista
- Componente invisível em mobile (sem impacto no layout mobile)
- Código TypeScript sem erros (`tsc --noEmit`)
