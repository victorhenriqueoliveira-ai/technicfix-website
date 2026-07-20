---
status: completed
title: Hero.tsx reescrita full-width sem overlay
type: frontend
complexity: medium
dependencies: []
---

# Task 08: Hero.tsx reescrita full-width sem overlay

## Overview

Reescreve `components/home/Hero.tsx` para o padrão full-width do Jofepar: banner com altura fixa 420px, imagem visível por completo sem overlay navy pesado, setas de navegação nas laterais, dots de posição abaixo e autorotação de 5s com pause no hover. Remove a dependência de `ExplodingScene`/HeroDecor. Mantém o fallback com fundo amber quando não há banners.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Client Component (`'use client'`) — necessário para `useState`, `useEffect` (autorotação) e handlers de hover/click
- DEVE aceitar `banners: Banner[]` (ou equivalente — verificar tipo existente no projeto) como prop
- DEVE ter altura fixa de 420px no desktop, com `w-full overflow-hidden`
- DEVE renderizar a imagem do banner atual com `object-cover` e SEM overlay navy pesado ou gradiente escuro
- DEVE ter botões de seta esquerda/direita com ícones `ChevronLeft` e `ChevronRight` do Lucide
- DEVE ter dots de navegação no centro inferior com clique para ir ao banner específico
- DEVE autorotar a cada 5s com `useEffect`, pausando no `onMouseEnter` e retomando no `onMouseLeave`
- DEVE exibir fallback com fundo `bg-brand-amber` e texto centralizado "Fixação que não Falha" quando não há banners ou quando `banner.imageUrl` está vazio
- DEVE remover qualquer import de `ExplodingScene`, `HeroDecor` ou componentes 3D
- NÃO DEVE ter overlay navy escuro sobre a imagem (diferença central em relação ao Hero atual)
</requirements>

## Subtasks

- [x] 8.1 Reescrever `components/home/Hero.tsx` com estrutura full-width e altura 420px
- [x] 8.2 Implementar estado `current` e lógica de prev/next
- [x] 8.3 Implementar setas ChevronLeft/ChevronRight e dots clicáveis
- [x] 8.4 Implementar autorotação com pause no hover
- [x] 8.5 Implementar fallback amber para banners sem imageUrl
- [x] 8.6 Remover imports de ExplodingScene/HeroDecor
- [x] 8.7 Escrever testes unitários

## Implementation Details

Veja a seção "Hero.tsx (REESCRITO)" do TechSpec para a estrutura JSX exata, incluindo os botões de seta e dots.

O Hero atual tem overlay navy com badges dinâmicos (heroBadge1, heroBadge2) e integra a cena 3D `ExplodingScene`. Tudo isso deve ser removido na reescrita.

Verificar qual é o tipo exato do array de banners passado ao Hero — provavelmente um tipo `Banner` definido em `lib/types.ts` ou retornado por `getBanners()` em `lib/data.ts`.

A lógica de autorotação: `useEffect` que cria um `setInterval` de 5s, avançando `current`. O intervalo é cancelado no `onMouseEnter` do container e reiniciado no `onMouseLeave` — implementar com `useRef` para o ID do interval.

### Relevant Files

- `components/home/Hero.tsx` — reescrita completa
- `lib/types.ts` — verificar tipo `Banner` (se existir)
- `lib/data.ts` ou equivalente — `getBanners()` para entender o shape do dado
- `components/home/ExplodingScene.tsx` ou `HeroDecor.tsx` — NÃO importar (verificar nomes reais e remover imports)

### Dependent Files

- `app/(public)/page.tsx` (task_10) — importa `Hero` e passa `banners`

### Related ADRs

- [ADR-001: Substituição Completa do Header e Homepage](../adrs/adr-001.md) — remove `ExplodingScene` como parte da abordagem Jofepar pura

## Deliverables

- `components/home/Hero.tsx` reescrito sem overlay pesado e sem ExplodingScene
- Testes unitários para carrossel, autorotação e fallback **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Com 3 banners: renderiza a imagem do banner 0 inicialmente
  - [x] Clicar na seta direita: avança para o banner 1
  - [x] Clicar na seta esquerda a partir do banner 0: vai para o último banner (loop)
  - [x] Clicar no dot 2: vai para o banner 2
  - [x] Com `banners: []` (array vazio): renderiza fallback amber com texto "Fixação que não Falha"
  - [x] Banner com `imageUrl: ""` ou null: renderiza fallback amber sem crash
  - [x] Container tem `style={{ height: '420px' }}` ou equivalente
  - [x] Nenhum elemento com overlay navy escuro (verificar ausência de classe `bg-brand-navy` com opacity sobre a imagem)
- Testes de integração:
  - [x] Hero renderiza na homepage sem erro de hidratação (Client Component dentro de Server Component)
  - [x] `npx tsc --noEmit` passa após remoção dos imports de ExplodingScene

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Banner full-width sem overlay pesado visível
- Autorotação funciona e pausa no hover
- Fallback amber exibido quando sem banners
- Nenhum import de ExplodingScene ou HeroDecor
