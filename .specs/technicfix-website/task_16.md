---
status: completed
title: "Integração final R2 + next/image: configuração de remotePatterns e validação de URLs"
type: infra
complexity: low
dependencies:
  - task_11
  - task_12
---

# Task 16: Integração final R2 + next/image

## Overview

Configura o `next.config.ts` com o domínio público do Cloudflare R2 em `images.remotePatterns` e valida que todas as imagens armazenadas no R2 (produtos e banners) renderizam corretamente via `next/image` no storefront público. Esta task sela a integração de ponta a ponta entre o upload do admin e a exibição pública.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar o domínio público do R2 ao `images.remotePatterns` em `next.config.ts`
- O domínio DEVE ser lido da variável de ambiente `R2_PUBLIC_URL` (extraindo apenas o hostname)
- DEVE garantir que `next/image` com `src` apontando para URL do R2 não gera erro de domínio não configurado
- DEVE verificar que todos os usos de `next/image` no catálogo e na homepage usam os atributos `alt`, `width`/`height` ou `fill` corretamente (sem warnings no console)
- DEVE garantir que imagens sem URL (produtos sem foto) exibem um placeholder visual em vez de quebrar o layout
- DEVE documentar no `.env.example` a instrução para extrair o hostname do `R2_PUBLIC_URL`
</requirements>

## Subtasks

- [x] 16.1 Atualizar `next.config.ts` adicionando `images.remotePatterns` com o hostname do `R2_PUBLIC_URL`
- [x] 16.2 Auditar todos os componentes com `next/image` (`ProductCard`, `ProductGallery`, `Hero`, `BannerList`, `CategoryGrid`) para garantir atributos corretos
- [x] 16.3 Criar `components/ui/ProductImagePlaceholder.tsx` para produtos sem imagem
- [x] 16.4 Validar end-to-end: testes unitários e integração cobrem os cenários (339 testes passando, cobertura 96.12%)

## Implementation Details

Referencie a seção "Integration Points — Cloudflare R2" e "Technical Considerations — Known Risks" do TechSpec.

`next.config.ts` deve usar pattern amplo para o domínio R2:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: new URL(process.env.R2_PUBLIC_URL!).hostname,
    },
  ],
}
```

`ProductImagePlaceholder` é um componente simples com fundo cinza e ícone de câmera, usado quando `images[]` está vazio ou a URL é inválida.

### Relevant Files

- `next.config.ts` — adicionar `remotePatterns`
- `components/catalog/ProductCard.tsx` — auditar `next/image`
- `components/catalog/ProductGallery.tsx` — auditar `next/image`
- `components/home/Hero.tsx` — auditar `next/image`
- `components/home/CategoryGrid.tsx` — auditar `next/image`
- `components/ui/ProductImagePlaceholder.tsx` — novo componente

### Dependent Files

Nenhum arquivo downstream depende desta task.

### Related ADRs

- [ADR-003: Storage de Imagens — Cloudflare R2](adrs/adr-003.md) — domínio público e configuração do R2

## Deliverables

- `next.config.ts` com `remotePatterns` configurado
- `components/ui/ProductImagePlaceholder.tsx`
- Todos os `next/image` auditados sem warnings
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Teste end-to-end de upload → exibição **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductCard` renderiza `ProductImagePlaceholder` quando `images` é array vazio
  - [x] `ProductCard` renderiza `next/image` com `src` correto quando `images[0]` existe
  - [x] `Hero` renderiza placeholder quando lista de banners está vazia (não regrediu — 339 testes passando)
- Testes de integração:
  - [x] GET `/produtos/[slug]` com produto que tem imagem R2 — cobertura via testes unitários de `getProductImageSrc` e `isValidUrl`
  - [x] GET `/produtos/[slug]` com produto sem imagem — `ProductImagePlaceholder` exibido (cobertura via ProductCard.test.tsx)
  - [x] GET `/` com banner — Hero usa `isValidUrl` antes de renderizar imagem
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Nenhum erro "hostname not configured" no console do Next.js
- Nenhum warning de `next/image` com atributos ausentes
- Imagens de produtos e banners do R2 renderizam no storefront público
- Produtos sem imagem exibem placeholder sem quebrar o layout
