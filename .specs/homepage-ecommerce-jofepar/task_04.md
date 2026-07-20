---
status: completed
title: CategoryNav — barra de categorias com mega-dropdown e mobile
type: frontend
complexity: high
dependencies:
  - task_01
---

# Task 04: CategoryNav — barra de categorias com mega-dropdown e mobile

## Overview

Cria o componente Client Component `components/layout/CategoryNav.tsx` — a terceira camada do header, responsável pela navegação de categorias. No desktop exibe uma barra horizontal com mega-dropdown por hover para subcategorias; no mobile integra um acordeão no Sheet lateral. É a tarefa mais complexa do header e a principal responsável pela experiência Jofepar de navegação.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Client Component (`'use client'`) em `components/layout/CategoryNav.tsx`
- DEVE aceitar `categories: CategorySummary[]` como prop (tipo da task_01)
- DEVE renderizar no desktop (`md:flex`, hidden no mobile) uma `<nav>` horizontal com um item por categoria-pai: ícone (`next/image` se `imageUrl`, senão círculo amber com inicial) + nome
- DEVE abrir o mega-dropdown ao `onMouseEnter` na categoria-pai e fechar ao `onMouseLeave` (estado `hoveredId: string | null`)
- O mega-dropdown DEVE listar os filhos (`category.children`) da categoria hovered como links para `/produtos?categoria=<slug>`
- DEVE renderizar no mobile (dentro de um Sheet) as categorias em padrão acordeão: pai expande para exibir filhos
- Links de categorias sem filhos DEVEM ainda funcionar, levando diretamente para `/produtos?categoria=<slug>` sem abrir painel vazio
- DEVE aplicar classes Tailwind exatas da seção "CategoryNav.tsx" do TechSpec: fundo `bg-brand-navy`, itens `text-white`, dropdown `bg-white shadow-xl`
- DEVE exportar as categorias para o Sheet do Header pai poder injetar o acordeão mobile (ou receber o Sheet como composição interna — definir durante implementação)
</requirements>

## Subtasks

- [x] 4.1 Criar `components/layout/CategoryNav.tsx` com estrutura desktop (nav horizontal)
- [x] 4.2 Implementar estado `hoveredId` e lógica de abertura/fechamento do mega-dropdown
- [x] 4.3 Implementar ícone condicional: `next/image` se `imageUrl`, círculo amber com inicial se não
- [x] 4.4 Implementar links de subcategorias no dropdown (`/produtos?categoria=<slug>`)
- [x] 4.5 Implementar o acordeão mobile para uso no Sheet
- [x] 4.6 Escrever testes unitários para os comportamentos de hover e mobile

## Implementation Details

Veja a seção "CategoryNav.tsx (NOVO)" do TechSpec para as classes Tailwind exatas, estrutura do dropdown e comportamento mobile.

O Header atual (`components/layout/Header.tsx`) já possui um Sheet mobile com hamburger — o `CategoryNav` deve integrar o acordeão de categorias nesse Sheet existente, não criar um novo Sheet. Coordenar com task_05 para a integração.

O dropdown deve ter `z-50` para ficar acima do conteúdo da página. Usar `position: absolute` relativo ao item da nav.

Categorias sem filhos (`children.length === 0`) não devem abrir painel — clicar leva direto para `/produtos?categoria=<slug>`.

### Relevant Files

- `components/layout/CategoryNav.tsx` — arquivo a ser criado
- `lib/types.ts` — `CategorySummary` (task_01)
- `components/layout/Header.tsx` — Sheet mobile existente que será modificado na task_05

### Dependent Files

- `components/layout/Header.tsx` (task_05) — importa e usa `CategoryNav`

### Related ADRs

- [ADR-001: Substituição Completa do Header e Homepage](../adrs/adr-001.md) — define a adoção do mega-dropdown como elemento central da experiência Jofepar

## Deliverables

- `components/layout/CategoryNav.tsx` implementado e compilando
- Comportamento de hover no desktop (abre/fecha dropdown)
- Acordeão mobile funcional
- Links de subcategorias corretos
- Testes unitários cobrindo desktop e mobile **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Renderiza 3 itens de categoria na barra quando recebe `categories` com 3 raízes
  - [x] Hover em categoria com 2 filhos: painel dropdown abre e exibe os 2 filhos
  - [x] MouseLeave na categoria: painel dropdown fecha (hoveredId volta a null)
  - [x] Categoria sem filhos (`children: []`): hover não abre painel; link aponta para `/produtos?categoria=<slug>`
  - [x] Categoria com `imageUrl`: renderiza `<img>` (ou `next/image`) com o src correto
  - [x] Categoria sem `imageUrl`: renderiza círculo amber com a inicial do nome
  - [x] No mobile (Sheet): acordeão exibe categorias-pai; clicar em pai expande filhos
  - [x] Link de subcategoria: href é `/produtos?categoria=<slug-do-filho>`
- Testes de integração:
  - [x] `CategoryNav` renderiza dentro do `Header` sem erros de hidratação (SSR/CSR)
  - [x] Receber `categories: []` renderiza nav vazia sem crash

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Mega-dropdown funciona no desktop: abre no hover, fecha ao sair
- Acordeão mobile funciona no Sheet
- Categorias sem filhos não abrem painel vazio
- Nenhum erro de TypeScript
