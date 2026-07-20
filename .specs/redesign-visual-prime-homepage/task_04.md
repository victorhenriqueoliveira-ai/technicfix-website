---
status: completed
title: "Hero.tsx: overlay gradiente + pills dinâmicos + CTA premium"
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 04: Hero.tsx: overlay gradiente + pills dinâmicos + CTA premium

## Overview

Redesenha visualmente `components/home/Hero.tsx` substituindo o overlay opaco flat por um gradiente direcional navy, adicionando pills de badge dinâmicas vindas do `SiteConfig` via props, e refinando o CTA de WhatsApp com efeito hover de sombra expansível. A lógica de carrossel, intervalo e indicadores de dots não é alterada.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seções "Hero.tsx" e "Core Interfaces" para props e classes exatas
- FOQUE NO "QUÊ" — visual premium; não alterar a lógica de state/efeito/carousel
- MINIMIZE CÓDIGO — substituir classes, não reescrever a estrutura do componente
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE aceitar as novas props `heroBadge1?: string | null` e `heroBadge2?: string | null` na interface `HeroProps`.
- DEVE substituir `bg-black/60` (overlay flat) por gradiente direcional: `bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent`.
- DEVE renderizar pills de badge dinâmicas quando `heroBadge1` ou `heroBadge2` não forem nulos, posicionadas acima do headline.
- DEVE renderizar cada pill com: fundo `bg-brand-amber/15`, borda `border-brand-amber/50`, texto `text-brand-amber`, ponto âmbar animado.
- NÃO DEVE renderizar nenhum elemento de pill quando ambos os badges forem `null`.
- DEVE refinar o CTA WhatsApp: substituir `hover:scale-105` por `hover:shadow-xl hover:shadow-brand-amber/40`.
- NÃO DEVE alterar o estado `current`, o `useEffect` de intervalo, os indicadores de dots nem a lógica de `items`/`FALLBACK_BANNER`.
- NÃO DEVE alterar a lógica de `isValidUrl`, o elemento `<img>` do banner nem o componente `ExplodingScene`.
- Toda alteração de classe DEVE usar tokens do design system (`bg-brand-*`, `text-brand-*`) — zero hex hardcoded.
</requirements>

## Subtasks

- [x] 4.1 Atualizar a interface `HeroProps` para incluir `heroBadge1?: string | null` e `heroBadge2?: string | null`
- [x] 4.2 Substituir o `<div>` de overlay opaco pelo gradiente direcional navy
- [x] 4.3 Implementar bloco de pills dinâmicas renderizadas condicionalmente acima do headline
- [x] 4.4 Refinar o CTA WhatsApp: remover `hover:scale-105`, adicionar `hover:shadow-xl hover:shadow-brand-amber/40`
- [x] 4.5 Testar renderização sem pills (ambos null) e com 1 ou 2 pills preenchidos

## Implementation Details

Ver TechSpec seção "Hero.tsx" para o snippet de renderização das pills e as classes exatas de cada alteração.

A pill atual existente no componente ("TechnicFix — Parafusos e Fixadores") é um eyebrow label estático acima do `<h1>` — deve ser mantida. As novas pills de badge dinâmicas ficam **abaixo** do eyebrow label e **acima** do `<h1>`, em um `<div className="flex flex-wrap gap-2 justify-center mb-5">`.

O overlay atual é um `<div className="absolute inset-0 bg-black/60" />`. Substituir apenas a classe `bg-black/60` pelo gradiente, mantendo `absolute inset-0`.

O botão WhatsApp já tem `shadow-lg shadow-brand-amber/30` — adicionar `hover:shadow-xl hover:shadow-brand-amber/40` e remover `hover:scale-105` da classe do `<a>`.

### Relevant Files

- `components/home/Hero.tsx` — único componente a modificar
- `components/home/HeroDecor.tsx` — componente `ExplodingScene` usado internamente; NÃO modificar

### Dependent Files

- `app/(public)/page.tsx` — passa `heroBadge1/2` como props; task_02 já configura isso

### Related ADRs

- [ADR-004: Pill Badges via SiteConfig](adrs/adr-004.md) — justifica props dinâmicas e renderização condicional

## Deliverables

- `components/home/Hero.tsx` com overlay gradiente, pills dinâmicos e CTA refinado
- Hero renderizando sem pills quando `heroBadge1/2` são null **(OBRIGATÓRIO)**
- Hero renderizando 1 pill quando só `heroBadge1` está preenchido **(OBRIGATÓRIO)**
- Hero renderizando 2 pills quando ambos estão preenchidos **(OBRIGATÓRIO)**
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Renderiza sem elemento de pill quando `heroBadge1=null` e `heroBadge2=null`
  - [x] Renderiza 1 pill com texto "Frete Grátis" quando `heroBadge1="Frete Grátis"` e `heroBadge2=null`
  - [x] Renderiza 2 pills quando ambos `heroBadge1` e `heroBadge2` estão preenchidos
  - [x] Overlay usa classe de gradiente (não `bg-black/60`) no DOM renderizado
  - [x] CTA WhatsApp não possui classe `hover:scale-105`
  - [x] Eyebrow label "TechnicFix — Parafusos e Fixadores" ainda está presente
  - [x] `ExplodingScene` ainda é renderizado
  - [x] Lógica de carrossel (dots, intervalo) não foi alterada
- Testes de integração:
  - [x] Hero renderiza corretamente com lista de banners vazia (usa `FALLBACK_BANNER`)
  - [x] Hero renderiza corretamente com múltiplos banners e navega entre eles
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Overlay gradiente visível com parte da imagem do banner aparecendo à direita
- Pills de badge renderizadas condicionalmente sem erro visual quando ausentes
- CTA de WhatsApp com sombra expansível no hover (sem scale)
- Nenhuma regressão na lógica de carrossel
