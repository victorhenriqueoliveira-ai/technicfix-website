# Contexto — task_05

## Requisitos do PRD

- Homepage: Hero/Banner rotativo (dados do banco), Seção de Categorias, Produtos em Destaque, Seção Technocalhas (chamativa, fundo distinto, logo, descrição, CTA), Depoimentos estáticos, Formulário de Lead Geral
- Botão WhatsApp já está no layout (task_04)
- Design: tons laranja/amarelo, cinza industrial, mobile-first

## Especificação Técnica

### `app/(public)/page.tsx` — Server Component
Buscar em paralelo: banners ativos ordenados por `order`, categorias (máx 8), produtos com `featured: true` e `status: ativo` (máx 8), SiteConfig singleton.

### Componentes a criar em `components/home/`

**Hero.tsx** — carrossel de banners. Usar `embla-carousel-react` OU implementação simples com useState/intervalo. Se lista vazia: banner fallback com texto "Technicfix — Parafusos e Materiais de Obra".

**CategoryGrid.tsx** — grade 2-3-4 colunas (mobile/tablet/desktop). Cada card: imagem da categoria (next/image com placeholder se sem imagem) + nome. Link para `/categorias/[slug]`.

**FeaturedProducts.tsx** — grade de ProductCard simplificado (sem modal de lead — apenas link para página do produto). Título "Produtos em Destaque". Se lista vazia: não renderiza seção.

**TechnocalhasSection.tsx** — bloco com `bg-orange-600 text-white` ou cor distinta. Logo placeholder (texto "TC" grande ou ícone). Lê `technocalhasDescription` e `technocalhasUrl` do SiteConfig passado como prop. CTA: botão "Conheça a Technocalhas" linkando para `/technocalhas`.

**TestimonialsSection.tsx** — array hardcoded de 3 depoimentos com nome, cargo e texto. Grid de cards.

**LeadGeneralForm.tsx** — `'use client'`. Campos: nome, telefone, e-mail, mensagem. Ao submeter: chama `submitLead` (importada de `@/actions/leads`). Se action não existir ainda, criar placeholder que retorna `{ success: true }`. Exibir mensagem de sucesso após envio.

## Estado de dependências

- task_01 (integrada): Next.js 15, shadcn/ui, estrutura de pastas
- task_02 (integrada): `lib/prisma.ts` com `db`, modelos Product/Category/Banner/SiteConfig
- task_04 (integrada): `app/(public)/layout.tsx` existe com Header/Footer

## Importante para o worker

- Criar `app/(public)/page.tsx` e todos os componentes home/
- `embla-carousel-react` não está instalado — usar implementação simples de carrossel com auto-play via useEffect+useState, ou instalar: `npm install embla-carousel-react embla-carousel-autoplay`
- Para `next/image` sem domínio R2 configurado ainda: usar `unoptimized` prop em imagens de URL externa, ou deixar placeholder `<div>` com bg-gray para imagens do banco
- `submitLead` de `@/actions/leads` NÃO existe ainda (task_07) — criar stub: `export async function submitLead() { return { success: true } }`  em `actions/leads.ts` provisoriamente
- Criar testes unitários para Hero (fallback), CategoryGrid (cards), FeaturedProducts (vazio não renderiza), TechnocalhasSection (props), LeadGeneralForm (sucesso/erro)
- NÃO criar `actions/leads.ts` completo — apenas o stub mínimo
