# Correções, Estabilização e Aperfeiçoamentos — Lista de Tarefas

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Criar `lib/env.ts` + `app/instrumentation.ts` | completed | medium | — |
| 02 | Migrar `process.env.*` → `env.*` nos arquivos de servidor | completed | medium | task_01 |
| 03 | Retry automático no Resend em `actions/leads.ts` | completed | low | task_02 |
| 04 | Criar ADR de risco NextAuth beta | completed | low | — |
| 05 | Remover blocos de código morto em `Header.tsx` e `BenefitsBar.tsx` | completed | low | — |
| 06 | Centralizar `ProductWithCategory` e tipos de leads em `lib/types.ts` | completed | low | — |
| 07 | Substituir inline style por `h-[650px]` no `Hero.tsx` | completed | low | — |
| 08 | Adicionar `overflow-x-auto` nas tabelas admin de produtos | completed | low | — |
| 09 | Converter `RelatedProducts.tsx` para carrossel CSS scroll snap | completed | low | task_06 |
| 10 | Criar `PriceFilter.tsx` e estender `produtos/page.tsx` com filtro de preço | completed | medium | task_06 |
| 11 | Converter `categorias/[slug]/page.tsx` de redirect para Server Component | completed | medium | task_10 |
| 12 | Auditar e corrigir `app/sitemap.ts` | completed | low | task_02 |
| 13 | Criar `DashboardLeadsCharts.tsx` e estender `admin/page.tsx` com dados de leads | completed | medium | task_01 |
