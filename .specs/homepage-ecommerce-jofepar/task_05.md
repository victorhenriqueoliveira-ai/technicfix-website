---
status: completed
title: Header.tsx reescrita 3 camadas + layout.tsx async
type: frontend
complexity: high
dependencies:
  - task_02
  - task_03
  - task_04
---

# Task 05: Header.tsx reescrita 3 camadas + layout.tsx async

## Overview

Reescreve `components/layout/Header.tsx` na estrutura de 3 camadas do Jofepar (TopBar + MainBar + CategoryNav) e torna `app/(public)/layout.tsx` async para buscar categorias no servidor e passá-las como prop ao Header. É a tarefa de maior risco de regressão — o Header é usado em todas as páginas públicas do site.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE reescrever `components/layout/Header.tsx` com exatamente 3 camadas: TopBar (desktop-only, fundo navy-dark), MainBar (logo + HeaderSearchBar + WhatsApp CTA), CategoryNav
- O `Header.tsx` DEVE aceitar `categories: CategorySummary[]` como prop obrigatória com default `[]` para evitar regressão se layout.tsx falhar
- O `Header.tsx` PODE ser Server Component (sem `'use client'`) — os sub-componentes interativos (`HeaderSearchBar`, `CategoryNav`) já são Client Components
- DEVE tornar `app/(public)/layout.tsx` um async Server Component que executa `getCategoriesWithChildren()` envolvida em `.catch(() => [])` para resiliência a falhas
- O número de WhatsApp do CTA DEVE vir de `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` (padrão existente)
- DEVE manter o comportamento sticky do header (`sticky top-0 z-40`)
- DEVE preservar a lógica do Sheet mobile existente, agora integrando o acordeão de categorias do `CategoryNav`
- DEVE remover os links de nav antigos (Início, Produtos, Sobre, Contato, Technocalhas) da MainBar — a navegação passa a ser pelas categorias no `CategoryNav`
- `npx tsc --noEmit` DEVE passar sem erros após a reescrita
</requirements>

## Subtasks

- [x] 5.1 Reescrever `components/layout/Header.tsx` com TopBar, MainBar e CategoryNav
- [x] 5.2 Adicionar prop `categories: CategorySummary[]` com default `[]` ao Header
- [x] 5.3 Integrar `HeaderSearchBar` na MainBar
- [x] 5.4 Integrar `CategoryNav` na terceira camada, passando `categories`
- [x] 5.5 Tornar `app/(public)/layout.tsx` async e adicionar `getCategoriesWithChildren().catch(() => [])`
- [x] 5.6 Verificar que todas as rotas públicas (/produtos, /produtos/[slug], etc.) continuam renderizando sem erros
- [x] 5.7 Escrever testes unitários e de integração

## Implementation Details

Veja as seções "Header.tsx (REESCRITO)", "layout.tsx (MODIFICADO)" e o diagrama de "Component Overview" do TechSpec para a estrutura exata.

O Header atual (`components/layout/Header.tsx`) tem 136 linhas com nav de links estáticos e Sheet mobile próprio. A reescrita substitui tudo — não é incremental.

O `GearIcon` definido inline no Header atual pode ser mantido ou removido se o novo design não o usar. O novo Logo deve ser um link `/` com SVG de engrenagem + "TechnicFix" conforme o TechSpec.

O WhatsApp CTA da MainBar deve usar `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` — verificar que a variável já está no `.env`.

### Relevant Files

- `components/layout/Header.tsx` — reescrita completa
- `app/(public)/layout.tsx` — torna-se async
- `components/layout/HeaderSearchBar.tsx` — importado (task_03)
- `components/layout/CategoryNav.tsx` — importado (task_04)
- `lib/data/categories.ts` — `getCategoriesWithChildren` importada no layout (task_02)
- `lib/types.ts` — `CategorySummary` para tipagem da prop

### Dependent Files

- Todas as rotas sob `app/(public)/` — herdam o novo layout e Header
- `app/(public)/page.tsx` — homepage (task_10)
- `app/(public)/produtos/` — página de listagem
- `app/(public)/produtos/[slug]/` — página de produto

### Related ADRs

- [ADR-001: Substituição Completa do Header e Homepage](../adrs/adr-001.md) — justifica a reescrita total em vez de evolução incremental
- [ADR-003: layout.tsx Async para Prover Dados ao Header](../adrs/adr-003.md) — define a estratégia de passar categorias via prop server-side

## Deliverables

- `components/layout/Header.tsx` reescrito em 3 camadas
- `app/(public)/layout.tsx` async com getCategoriesWithChildren
- Testes unitários do Header com diferentes estados de `categories` **(OBRIGATÓRIO)**
- Testes de integração nas rotas públicas **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Header renderiza com `categories: []`: TopBar, MainBar e CategoryNav (vazia) visíveis sem crash
  - [x] Header renderiza com 3 categorias: CategoryNav recebe o array correto via prop
  - [x] MainBar contém HeaderSearchBar renderizado
  - [x] MainBar contém link WhatsApp com href contendo o número do env
  - [x] TopBar exibe texto de entrega e atendimento, oculto no mobile (`hidden md:block`)
  - [x] Header tem className `sticky top-0 z-40`
- Testes de integração:
  - [x] `app/(public)/layout.tsx` async: getCategoriesWithChildren falha → layout renderiza com `categories: []` (sem erro 500)
  - [x] Rota `/produtos` renderiza com o novo Header sem erros de hidratação
  - [x] `npx tsc --noEmit` passa após reescrita

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Header renderiza corretamente em todas as rotas públicas
- Nenhuma regressão em `/produtos` e `/produtos/[slug]`
- layout.tsx async com fallback resiliente a falha de banco
- `npx tsc --noEmit` sem erros
