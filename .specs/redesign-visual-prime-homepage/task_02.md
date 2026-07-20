---
status: completed
title: "page.tsx: badge, heroBadges e remoção de Testimonials"
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 02: page.tsx: badge, heroBadges e remoção de Testimonials

## Overview

Realiza três edições mínimas e cirúrgicas em `app/(public)/page.tsx`: remove o import e uso de `TestimonialsSection` (ADR-002), inclui o campo `badge` no mapeamento de produtos e propaga `heroBadge1`/`heroBadge2` do `SiteConfig` para o componente `<Hero>`. Nenhuma lógica de fetch, estrutura de `Promise.all` ou roteamento é alterada.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "page.tsx — Edições Mínimas" para as 3 alterações exatas
- FOQUE NO "QUÊ" — 3 mudanças cirúrgicas; não refatorar o restante do arquivo
- MINIMIZE CÓDIGO — cada alteração é de 1-3 linhas; não altere o que não está especificado
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE remover o import `TestimonialsSection` de `app/(public)/page.tsx`.
- DEVE remover o JSX `<TestimonialsSection />` do retorno da página (sem alterar a ordem das demais seções).
- DEVE adicionar `badge: p.badge ?? null` ao mapeamento `ProductRow → ProductSummary` em `getFeaturedProducts`.
- DEVE adicionar o tipo `badge?: string | null` ao tipo local `ProductRow` para que o compilador reconheça o campo vindo do Prisma.
- DEVE passar `heroBadge1={config.heroBadge1 ?? null}` e `heroBadge2={config.heroBadge2 ?? null}` como props ao `<Hero>`.
- DEVE adicionar `heroBadge1: null, heroBadge2: null` ao objeto de fallback `config` (quando `siteConfig` for null).
- NÃO DEVE alterar a lógica dos fetches (`getBanners`, `getCategories`, `getFeaturedProducts`, `getSiteConfig`).
- NÃO DEVE alterar a estrutura `Promise.all` nem o retorno da página além das 3 mudanças especificadas.
- O arquivo `components/home/TestimonialsSection.tsx` NÃO deve ser deletado — apenas removido da homepage.
</requirements>

## Subtasks

- [x] 2.1 Remover import `TestimonialsSection` e seu JSX do retorno da página
- [x] 2.2 Adicionar `badge?: string | null` ao tipo local `ProductRow`
- [x] 2.3 Adicionar `badge: p.badge ?? null` ao mapeamento de `ProductRow` para `ProductSummary`
- [x] 2.4 Adicionar `heroBadge1`/`heroBadge2` ao objeto de fallback `config`
- [x] 2.5 Passar `heroBadge1` e `heroBadge2` como props ao `<Hero>`
- [x] 2.6 Confirmar que `npx tsc --noEmit` passa sem erros após as mudanças

## Implementation Details

Ver TechSpec seção "page.tsx — Edições Mínimas" para o código exato de cada alteração.

O tipo local `ProductRow` precisa incluir `badge?: string | null` para que o TypeScript aceite `p.badge` no mapeamento. O Prisma retorna o campo automaticamente após a migração da task_01.

O objeto de fallback `config` (criado quando `siteConfig` é `null`) deve ser atualizado para incluir os novos campos, caso contrário o TypeScript reportará erro de tipo incompleto na interface `SiteConfig`.

### Relevant Files

- `app/(public)/page.tsx` — único arquivo a modificar nesta tarefa

### Dependent Files

- `components/home/Hero.tsx` — receberá `heroBadge1/2` como props; task_04 implementa a aceitação dessas props
- `lib/types.ts` — `ProductSummary` e `SiteConfig` atualizados na task_01 são consumidos aqui

### Related ADRs

- [ADR-002: Remoção da TestimonialsSection](adrs/adr-002.md) — justifica a remoção do JSX/import
- [ADR-003: Propagação do Campo Badge via page.tsx](adrs/adr-003.md) — detalha as 3 edições acordadas

## Deliverables

- `app/(public)/page.tsx` com as 3 alterações (remoção de Testimonials, badge no map, heroBadges ao Hero)
- `npx tsc --noEmit` passando sem erros **(OBRIGATÓRIO)**
- Homepage renderizando sem `TestimonialsSection` **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `page.tsx` compila sem erro TypeScript após as mudanças
  - [ ] O objeto de fallback `config` satisfaz a interface `SiteConfig` completa (incluindo `heroBadge1/2`)
  - [ ] O mapeamento de `ProductRow` com campo `badge: null` produz `ProductSummary` válido
  - [ ] O mapeamento de `ProductRow` com `badge: "Mais Vendido"` produz `ProductSummary` com badge correto
- Testes de integração:
  - [ ] Página renderiza sem erro em modo de desenvolvimento com `npm run dev`
  - [ ] `TestimonialsSection` não aparece no HTML renderizado da homepage
  - [ ] `<Hero>` recebe as props `heroBadge1` e `heroBadge2` (verificável via React DevTools ou snapshot)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `npx tsc --noEmit` sem erros
- Homepage renderiza corretamente sem `TestimonialsSection`
- `<Hero>` recebe `heroBadge1` e `heroBadge2` via props
- Nenhuma outra seção da homepage foi alterada ou reordenada
