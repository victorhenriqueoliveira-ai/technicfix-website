---
status: completed
title: page.tsx — refatoração para estrutura Jofepar
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_07
  - task_08
  - task_09
---

# Task 10: page.tsx — refatoração para estrutura Jofepar

## Overview

Refatora `app/(public)/page.tsx` para a estrutura Jofepar: substitui as seções antigas (`DiferenciaisSection`, `CategoryGrid`, `FeaturedProducts`, `TechnocalhasSection`, `LeadGeneralForm`) pela nova sequência `Hero → BenefitsBar → CategoryProductSection[]`. Adiciona `getCategoriesWithProducts(8)` ao `Promise.all` existente e mapeia uma seção por categoria-pai com produtos.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE refatorar `app/(public)/page.tsx` para usar `getCategoriesWithProducts(8)` em paralelo com `getBanners()` e `getSiteConfig()` via `Promise.all`
- DEVE renderizar na ordem: `<Hero banners={banners} />`, `<BenefitsBar />`, `{categoriesWithProducts.map(cat => <CategoryProductSection ... />)}`
- DEVE remover os imports e usos de `DiferenciaisSection`, `CategoryGrid`, `FeaturedProducts`, `TechnocalhasSection` e `LeadGeneralForm` (arquivos são mantidos no disco, apenas removidos do page.tsx)
- DEVE extrair `whatsappNumber` do `config?.whatsappNumber` limpando caracteres não-numéricos: `config?.whatsappNumber?.replace(/\D/g, '') ?? ''`
- DEVE passar `key={cat.id}` no map de `CategoryProductSection`
- DEVE manter o bloco de metadata (`export const metadata`) existente, atualizando description se relevante
- `npx tsc --noEmit` DEVE passar após a refatoração
</requirements>

## Subtasks

- [x] 10.1 Adicionar `getCategoriesWithProducts` ao `Promise.all` em `page.tsx`
- [x] 10.2 Remover imports e JSX de `DiferenciaisSection`, `CategoryGrid`, `FeaturedProducts`, `TechnocalhasSection`, `LeadGeneralForm`
- [x] 10.3 Adicionar imports de `BenefitsBar` e `CategoryProductSection`
- [x] 10.4 Montar o JSX na ordem correta: Hero → BenefitsBar → seções por categoria
- [x] 10.5 Extrair `whatsappNumber` do config com limpeza de máscara
- [x] 10.6 Escrever testes de integração da homepage

## Implementation Details

Veja a seção "page.tsx (REFATORADO)" do TechSpec para o código completo da refatoração.

O `page.tsx` atual (108 linhas) importa e renderiza 6 seções. A refatoração substitui por 3. Os arquivos das seções removidas (`DiferenciaisSection.tsx`, etc.) são mantidos no disco — apenas os imports e o JSX são removidos do `page.tsx`.

O `getSiteConfig()` já existe no projeto — verificar se retorna `whatsappNumber` como string com máscara ou limpo. A limpeza `replace(/\D/g, '')` garante apenas dígitos no link do WhatsApp.

O `Hero` já aceita `banners` — verificar que a prop continua compatível após a reescrita da task_08.

### Relevant Files

- `app/(public)/page.tsx` — refatoração principal
- `lib/data/categories.ts` — `getCategoriesWithProducts` importada (task_02)
- `components/home/Hero.tsx` — reescrito (task_08)
- `components/home/BenefitsBar.tsx` — novo (task_07)
- `components/home/CategoryProductSection.tsx` — novo (task_09)
- `components/home/DiferenciaisSection.tsx` — removido do page.tsx (mantido no disco)
- `components/home/CategoryGrid.tsx` — removido do page.tsx (mantido no disco)
- `components/home/FeaturedProducts.tsx` — removido do page.tsx (mantido no disco)
- `components/home/TechnocalhasSection.tsx` — removido do page.tsx (mantido no disco)
- `components/home/LeadGeneralForm.tsx` — removido do page.tsx (mantido no disco)

### Dependent Files

Nenhum arquivo depende de `page.tsx` diretamente.

### Related ADRs

- [ADR-001: Substituição Completa do Header e Homepage](../adrs/adr-001.md) — define a remoção das seções antigas e a nova estrutura Jofepar

## Deliverables

- `app/(public)/page.tsx` refatorado com a nova estrutura
- Imports das seções antigas removidos
- Testes de integração da homepage **(OBRIGATÓRIO)**
- `npx tsc --noEmit` passando **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Com 2 categorias com produtos e 0 categorias vazias: renderiza Hero + BenefitsBar + 2 CategoryProductSection
  - [x] Com 0 categorias com produtos: renderiza Hero + BenefitsBar + 0 seções (sem erro)
  - [x] `DiferenciaisSection` NÃO está presente no JSX renderizado
  - [x] `FeaturedProducts` NÃO está presente no JSX renderizado
  - [x] `LeadGeneralForm` NÃO está presente no JSX renderizado
  - [x] `whatsappNumber` passado ao `CategoryProductSection` contém apenas dígitos (sem máscara)
- Testes de integração:
  - [x] Homepage renderiza com 2 categorias mockadas sem erro 500
  - [x] `Promise.all` com `getCategoriesWithProducts` falhando: homepage ainda renderiza (tratar com catch ou verificar comportamento)
  - [x] `npx tsc --noEmit` passa após todas as mudanças

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Homepage renderiza na ordem: Hero → BenefitsBar → seções por categoria
- Nenhuma seção antiga presente no render
- `whatsappNumber` sem máscara passado para os cards
- `npx tsc --noEmit` sem erros
