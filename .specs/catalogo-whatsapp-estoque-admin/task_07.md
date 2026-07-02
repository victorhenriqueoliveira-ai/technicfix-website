---
status: completed
title: Integração na página pública de produto (/produtos/[slug])
type: frontend
complexity: medium
dependencies:
  - task_05
  - task_06
---

# Task 07: Integração na página pública de produto (/produtos/[slug])

## Overview

Atualiza `app/(public)/produtos/[slug]/page.tsx` para: buscar `SiteConfig.whatsappNumber` em paralelo com o produto, passar as novas props (`whatsappNumber`, `productType`, `showPrice`, `stock`) para o `ProductCTAs` reescrito (task_05), exibir preço ou "Sob consulta" com base em `showPrice`, e adicionar o componente `RelatedProducts` (task_06) ao final da página. Esta task fecha o ciclo da experiência pública de produto.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE buscar `SiteConfig.whatsappNumber` via `db.siteConfig.findUnique({ where: { id: 'singleton' } })` no Server Component, em paralelo com a busca do produto (`Promise.all`).
- DEVE passar `whatsappNumber`, `productType`, `showPrice` e `stock` como props para `ProductCTAs`.
- DEVE exibir o preço formatado em BRL quando `showPrice=true`; exibir o texto "Sob consulta" quando `showPrice=false`.
- DEVE renderizar `<RelatedProducts productId categoryId relatedProductIds />` ao final do conteúdo principal.
- NÃO DEVE renderizar os botões WhatsApp se `whatsappNumber` estiver vazio ou nulo — condicional no Server Component.
- DEVE manter `export const dynamic = 'force-dynamic'` para garantir dados frescos de `SiteConfig`.
- DEVE preservar todo o comportamento existente: metadata, galeria de imagens, descrição, detalhes técnicos, `notFound()` para produtos inativos.
</requirements>

## Subtasks

- [x] 7.1 Adicionar query `db.siteConfig.findUnique` em `Promise.all` junto com a query do produto.
- [x] 7.2 Atualizar a chamada de `ProductCTAs` com as novas props obrigatórias.
- [x] 7.3 Implementar exibição condicional de preço vs. "Sob consulta".
- [x] 7.4 Adicionar `<RelatedProducts>` ao final da página com as props corretas.
- [x] 7.5 Verificar que `generateMetadata` e `notFound()` continuam funcionando corretamente.

## Implementation Details

Ver seção "Fluxo de dados — CTA WhatsApp" em "Component Overview" do TechSpec para o fluxo exato de props do Server Component para `ProductCTAs`.

A query adicional de `SiteConfig` deve ser feita com `Promise.all` para não serializar com a query de produto existente:

```typescript
const [product, siteConfig] = await Promise.all([
  db.product.findFirst({ where: { slug, status: 'ativo' }, include: { category: true } }),
  db.siteConfig.findUnique({ where: { id: 'singleton' } }),
])
```

O campo `product.whatsappNumber` não existe — o número vem de `siteConfig?.whatsappNumber ?? ''`.

### Relevant Files

- `app/(public)/produtos/[slug]/page.tsx` — arquivo principal desta task
- `components/catalog/ProductCTAs.tsx` (task_05) — interface de props atualizada a ser consumida aqui
- `components/catalog/RelatedProducts.tsx` (task_06) — componente a inserir no final da página
- `prisma/schema.prisma` — model `SiteConfig` e campos `showPrice`, `productType`, `relatedProductIds` em `Product`

### Dependent Files

Nenhum arquivo downstream depende desta task diretamente.

### Related ADRs

- [ADR-005: SiteConfig como fonte do número WhatsApp nos CTAs](adrs/adr-005.md) — Justifica a query de SiteConfig nesta página

## Deliverables

- `app/(public)/produtos/[slug]/page.tsx` atualizado com query SiteConfig, props novas e RelatedProducts
- Testes de página cobrindo exibição de preço vs. "Sob consulta" e ausência de WhatsApp sem número **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Página com `showPrice=true` e `price=99.90` — deve exibir "R$ 99,90".
  - [ ] Página com `showPrice=false` — deve exibir "Sob consulta" e não exibir o valor do preço.
  - [ ] Página com `SiteConfig.whatsappNumber=''` — `ProductCTAs` não deve renderizar botões WhatsApp.
  - [ ] Página com produto `status='inativo'` — deve retornar `notFound()`.
  - [ ] `generateMetadata` com produto válido — deve retornar título e `openGraph.images` corretos.
- Testes de integração:
  - [ ] Requisição GET a `/produtos/[slug-valido]` — deve retornar 200 com `ProductCTAs` e `RelatedProducts` renderizados.
  - [ ] Requisição GET a `/produtos/[slug-inexistente]` — deve retornar 404.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Página exibe "Sob consulta" corretamente para produtos com `showPrice=false`
- Nenhum erro de runtime quando `SiteConfig` não está configurado
- `RelatedProducts` renderizado abaixo do conteúdo principal
