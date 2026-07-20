---
status: completed
title: Criar MobileMenu.tsx com Sheet controlled
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_04
---

# Task 6: Criar MobileMenu.tsx com Sheet controlled

## Overview

Cria o Client Component `MobileMenu.tsx` que encapsula toda a interatividade do menu mobile: Sheet controlado via `useState<boolean>`, `HeaderSearchBar` com callback `onSearch` para fechar o menu ao buscar, `CategoryAccordion` com as categorias e um accordion de Produtos inline com os links de produtos. O `Header` (Server Component) permanece sem `'use client'` e passa categorias e produtos como props.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um `'use client'` Component em `components/layout/MobileMenu.tsx`
- DEVE aceitar `categories: CategorySummary[]` e `products: ProductNavItem[]` como props — veja "Core Interfaces" do TechSpec
- DEVE usar `useState<boolean>` para controlar `open`/`onOpenChange` do Sheet — veja ADR-002
- DEVE passar `onSearch={() => setOpen(false)}` para `HeaderSearchBar`, fechando o Sheet ao confirmar busca
- DEVE renderizar `CategoryAccordion` (importado de `CategoryNav.tsx`) com `variant="light"` e as categorias recebidas por prop
- DEVE renderizar um accordion de Produtos inline (usando `<details>/<summary>`) com links para cada produto (`/produtos/[slug]`) e o link "Ver todos os produtos" ao final
- DEVE ser visível apenas em mobile (`md:hidden` ou equivalente) — desktop usa `CategoryNav` e `ProductsDropdown`
- NÃO DEVE fazer fetch de dados — recebe tudo via props do `Header` Server Component
- O `Sheet` em `components/ui/sheet.tsx` já passa `...props` para o root — usar `open` e `onOpenChange` sem modificar `sheet.tsx`
</requirements>

## Subtasks

- [x] 6.1 Ler `components/ui/sheet.tsx`, `components/layout/CategoryNav.tsx` (export `CategoryAccordion`) e o `Header.tsx` atual para entender os contratos de interface
- [x] 6.2 Criar `components/layout/MobileMenu.tsx` com `useState<boolean>` controlando o Sheet
- [x] 6.3 Adicionar `HeaderSearchBar` com `onSearch={() => setOpen(false)}`
- [x] 6.4 Adicionar `CategoryAccordion` com `variant="light"` e as categorias recebidas por prop
- [x] 6.5 Adicionar accordion de Produtos inline (`<details>/<summary>`) com links dos produtos e "Ver todos os produtos"
- [x] 6.6 Escrever testes do componente

## Implementation Details

Criar novo arquivo `components/layout/MobileMenu.tsx`. Veja as seções "Component Overview", "Core Interfaces" e "Key Decisions" do TechSpec para o design completo.

O `CategoryAccordion` já está exportado de `components/layout/CategoryNav.tsx` — importar diretamente de lá.

O Sheet em `components/ui/sheet.tsx` já suporta controlled mode via `...props` spread — confirmar lendo o arquivo antes de implementar.

### Relevant Files

- `components/ui/sheet.tsx` — Sheet a ser usado em modo controlled (`open`/`onOpenChange`)
- `components/layout/CategoryNav.tsx` — fonte do `CategoryAccordion` a importar
- `components/layout/HeaderSearchBar.tsx` — componente a usar com prop `onSearch` (task_04)
- `lib/types.ts` — fonte de `CategorySummary` e `ProductNavItem` (task_01)

### Dependent Files

- `components/layout/Header.tsx` (task_07) — importará e renderizará `MobileMenu`, passando `categories` e `products`

### Related ADRs

- [ADR-002: Extrair MobileMenu como Client Component para controle do Sheet](../adrs/adr-002.md) — Define a arquitetura desta tarefa

## Deliverables

- `components/layout/MobileMenu.tsx` criado
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `MobileMenu` renderiza o botão hamburguer sem lançar erros (com `categories=[]` e `products=[]`)
  - [ ] Clicar no botão hamburguer abre o Sheet (`open` muda para `true`)
  - [ ] `HeaderSearchBar` está presente no Sheet com a prop `onSearch` configurada
  - [ ] Chamar `onSearch` (simulando busca confirmada) fecha o Sheet (`open` muda para `false`)
  - [ ] `CategoryAccordion` é renderizado com as categorias passadas via prop
  - [ ] Accordion de Produtos renderiza links para cada produto em `products`
  - [ ] Accordion de Produtos sempre exibe "Ver todos os produtos" apontando para `/produtos`
  - [ ] Com `products=[]`, accordion de Produtos exibe apenas "Ver todos os produtos"
- Testes de integração:
  - [ ] `MobileMenu` inserido em um Header mockado renderiza sem erro com dados reais de categoria
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Sheet fecha automaticamente ao confirmar busca no `HeaderSearchBar`
- `CategoryAccordion` exibe hierarquia de categorias corretamente
- Accordion de Produtos exibe todos os produtos + link "Ver todos os produtos"
- `Header.tsx` pode importar `MobileMenu` sem precisar de `'use client'`
- Código TypeScript sem erros (`tsc --noEmit`)
