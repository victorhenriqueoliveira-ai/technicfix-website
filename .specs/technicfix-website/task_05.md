---
status: completed
title: "Homepage: Hero rotativo, Categorias, Produtos em Destaque, Technocalhas, Depoimentos, Formulário de Lead Geral"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_04
---

# Task 05: Homepage completa

## Overview

Implementa a página inicial completa do storefront com todas as seções definidas no PRD: hero com banners rotativos vindos do banco, grade de categorias, produtos em destaque, seção chamativa da Technocalhas, depoimentos estáticos e formulário de lead geral. Esta é a principal página de conversão do site.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/(public)/page.tsx` como Server Component que busca dados do banco (banners ativos, categorias, produtos em destaque)
- DEVE criar `components/home/Hero.tsx` com carrossel de banners usando dados do banco; se não houver banners, exibir banner de fallback estático
- DEVE criar `components/home/CategoryGrid.tsx` exibindo categorias com imagem e nome, linkando para `/categorias/[slug]`
- DEVE criar `components/home/FeaturedProducts.tsx` exibindo produtos com `featured: true` e `status: ativo`
- DEVE criar `components/home/TechnocalhasSection.tsx` com fundo visualmente distinto, logo (imagem estática), descrição e CTA linkando para `/technocalhas`
- DEVE criar `components/home/TestimonialsSection.tsx` com depoimentos estáticos (array hardcoded no componente)
- DEVE criar `components/home/LeadGeneralForm.tsx` com campos: nome, telefone, e-mail, mensagem — usando a Server Action `submitLead` com `type: 'geral'`
- O formulário DEVE exibir estado de loading durante envio e mensagem de sucesso após confirmação
- DEVE ser responsivo com layout em grade que adapta de 1 para 2 para 3 colunas conforme o breakpoint
</requirements>

## Subtasks

- [x] 5.1 Criar `app/(public)/page.tsx` com queries paralelas para banners, categorias e produtos em destaque
- [x] 5.2 Criar `components/home/Hero.tsx` com carrossel de banners (usar `embla-carousel-react` ou similar)
- [x] 5.3 Criar `components/home/CategoryGrid.tsx` com cards de categoria responsivos
- [x] 5.4 Criar `components/home/FeaturedProducts.tsx` reusando o `ProductCard` da task 06 (ou criar versão simplificada)
- [x] 5.5 Criar `components/home/TechnocalhasSection.tsx` com identidade visual distinta
- [x] 5.6 Criar `components/home/TestimonialsSection.tsx` com depoimentos estáticos
- [x] 5.7 Criar `components/home/LeadGeneralForm.tsx` integrado à Server Action de lead (task 07 entrega a action — usar placeholder até task 07 estar pronta)

## Implementation Details

Referencie a seção "Features Principais — Homepage" do PRD e a seção "Estrutura de Rotas" do TechSpec.

`app/(public)/page.tsx` usa `Promise.all` para buscar banners, categorias e produtos em destaque em paralelo, evitando queries sequenciais.

A `TechnocalhasSection` lê a URL e descrição da Technocalhas a partir do `SiteConfig` (singleton do banco), permitindo que o admin atualize via painel (task 14).

O formulário de lead geral pode ser implementado inicialmente com um estado de sucesso mockado até que a `submitLead` Server Action da task 07 esteja disponível — a integração final ocorre na task 07.

### Relevant Files

- `app/(public)/page.tsx` — página da homepage
- `components/home/Hero.tsx`
- `components/home/CategoryGrid.tsx`
- `components/home/FeaturedProducts.tsx`
- `components/home/TechnocalhasSection.tsx`
- `components/home/TestimonialsSection.tsx`
- `components/home/LeadGeneralForm.tsx`
- `lib/prisma.ts` — queries ao banco
- `lib/types.ts` — tipos `ProductSummary`, `SiteConfig`

### Dependent Files

- `task_07` (Server Actions de lead) integra `submitLead` ao `LeadGeneralForm`
- `task_15` (SEO) adiciona `generateMetadata` à `page.tsx`

### Related ADRs

- [ADR-001: Abordagem de Produto — Catálogo Central](adrs/adr-001.md) — justifica a ausência de seletor de perfil no hero

## Deliverables

- `app/(public)/page.tsx` com todas as seções
- 6 componentes de seção da homepage
- Homepage renderizando dados reais do banco
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração da página **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `Hero` renderiza banner de fallback quando lista de banners está vazia
  - [x] `Hero` renderiza o primeiro banner quando a lista tem um item
  - [x] `CategoryGrid` renderiza um card por categoria recebida como prop
  - [x] `FeaturedProducts` não renderiza seção quando lista de produtos está vazia
  - [x] `TechnocalhasSection` exibe o texto de descrição recebido como prop
  - [x] `LeadGeneralForm` exibe mensagem de sucesso após envio bem-sucedido
  - [x] `LeadGeneralForm` exibe mensagem de erro quando o envio falha
- Testes de integração:
  - [x] GET `/` retorna 200 com banco vazio (sem banners, categorias ou produtos cadastrados) — validado via next build (SSG com DB mockado)
  - [x] GET `/` retorna 200 com dados do banco e renderiza os nomes das categorias no HTML
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Homepage carrega com LCP abaixo de 3s em simulação de 4G no Lighthouse
- Todas as seções renderizam sem erros com banco vazio
- Layout responsivo correto em 320px, 768px e 1280px
