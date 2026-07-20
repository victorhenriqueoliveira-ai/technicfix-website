---
status: completed
title: Centralizar ProductWithCategory e tipos de leads em lib/types.ts
type: refactor
complexity: low
dependencies: []
---

# Task 06: Centralizar `ProductWithCategory` e tipos de leads em `lib/types.ts`

## Overview

Adiciona `ProductWithCategory`, `LeadsByDay`, `LeadsByType` e `LeadFunnel` a `lib/types.ts` e remove a definição local de `ProductWithCategory` de `app/(public)/produtos/page.tsx`. Tasks 09, 10 e 13 dependem desta task para importar os tipos corretos.

<critical>
- SEMPRE LEIA o PRD (F5) e o TechSpec (seção "Core Interfaces") antes de começar
- REFERENCIE O TECHSPEC para as definições exatas dos tipos a adicionar
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `ProductWithCategory` DEVE ser adicionado a `lib/types.ts` conforme definição no TechSpec seção "Core Interfaces"
- `LeadsByDay`, `LeadsByType` e `LeadFunnel` DEVEM ser adicionados a `lib/types.ts` conforme TechSpec seção "Core Interfaces"
- A definição local de `ProductWithCategory` em `app/(public)/produtos/page.tsx` DEVE ser removida e substituída por import de `lib/types.ts`
- Todos os tipos existentes em `lib/types.ts` DEVEM ser preservados sem alteração
- `ProductWithCategory.price` DEVE ser tipado como `Decimal | number | null` para ser compatível com o retorno do Prisma
</requirements>

## Subtasks

- [x] 6.1 Ler `lib/types.ts` para entender a estrutura atual e evitar conflitos de nomes
- [x] 6.2 Adicionar `ProductWithCategory` a `lib/types.ts` conforme TechSpec
- [x] 6.3 Adicionar `LeadsByDay`, `LeadsByType` e `LeadFunnel` a `lib/types.ts` conforme TechSpec
- [x] 6.4 Verificar se `Decimal` de `@prisma/client` já é importado em `lib/types.ts` ou adicionar o import
- [x] 6.5 Remover a definição local de `ProductWithCategory` de `app/(public)/produtos/page.tsx` e adicionar import de `@/lib/types`
- [x] 6.6 Confirmar que o TypeScript não apresenta erros após a mudança (`tsc --noEmit`)

## Implementation Details

`lib/types.ts` atualmente exporta: `LeadType`, `LeadStatus`, `ProductStatus`, `CategorySummary`, `CategoryWithProducts`, `ProductSummary`, `LeadPayload`, `SiteConfig`. Não há `ProductWithCategory` — ela existe apenas localmente em `produtos/page.tsx`.

`ProductSummary` já existe em `lib/types.ts` e tem estrutura similar mas diferente de `ProductWithCategory` — NÃO renomear `ProductSummary`, adicionar `ProductWithCategory` como tipo separado.

Ver TechSpec seção "Core Interfaces" para as definições exatas de todos os quatro tipos.

### Relevant Files

- `lib/types.ts` — arquivo a modificar; adicionar 4 tipos novos
- `app/(public)/produtos/page.tsx` — remover definição local e importar de `lib/types.ts`

### Dependent Files

- `components/catalog/RelatedProducts.tsx` — task_09 pode usar `ProductWithCategory` se conveniente
- `components/catalog/PriceFilter.tsx` — task_10 usa `ProductWithCategory` para tipagem de produtos na query
- `components/admin/DashboardLeadsCharts.tsx` — task_13 usa `LeadsByDay`, `LeadsByType`, `LeadFunnel`
- `app/(admin)/admin/page.tsx` — task_13 usa os tipos de leads para tipagem das queries

### Related ADRs

Nenhum ADR se aplica diretamente a esta task.

## Deliverables

- `lib/types.ts` com 4 novos tipos adicionados
- `app/(public)/produtos/page.tsx` sem definição local de `ProductWithCategory`
- Build TypeScript sem erros
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `lib/types.ts` exporta `ProductWithCategory` com os campos: `id`, `name`, `slug`, `price`, `images`, `featured`, `showPrice`, `category`
  - [ ] `lib/types.ts` exporta `LeadsByDay` com campos `date: string` e `total: number`
  - [ ] `lib/types.ts` exporta `LeadsByType` com campos `date`, `varejo`, `atacado`, `geral`
  - [ ] `lib/types.ts` exporta `LeadFunnel` com campos `status: string` e `count: number`
  - [ ] `app/(public)/produtos/page.tsx` não define `ProductWithCategory` localmente (grep retorna zero)
  - [ ] Import de `ProductWithCategory` em `produtos/page.tsx` aponta para `@/lib/types`
- Testes de integração:
  - [ ] Página `/produtos` renderiza sem erros TypeScript após a mudança de import
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `grep -n "ProductWithCategory" lib/types.ts` retorna a definição do tipo
- `grep -n "interface ProductWithCategory\|type ProductWithCategory" app/\(public\)/produtos/page.tsx` retorna zero resultados
- Build sem erros TypeScript
