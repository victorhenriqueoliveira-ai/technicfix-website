# Catálogo WhatsApp + Estoque + Admin Enriquecido — Lista de Tarefas

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Migration Prisma — model Sale, enum ProductType, campos novos em Product | completed | medium | — |
| 02 | Server Actions de Vendas (registerSale, getSalesSummary, getTopProducts) | completed | medium | task_01 |
| 03 | Notificação de lead por e-mail via Resend | completed | low | task_01 |
| 04 | Suporte aos campos showPrice, productType e relatedProductIds no admin de produtos | completed | medium | task_01 |
| 05 | Reescrita de ProductCTAs + novo LeadFormInline | completed | high | task_01, task_04 |
| 06 | Componente RelatedProducts (Server Component) | completed | medium | task_01 |
| 07 | Integração na página pública de produto (/produtos/[slug]) | completed | medium | task_05, task_06 |
| 08 | Módulo de Vendas no admin (página + SalesList + RegisterSaleDrawer + sidebar) | completed | high | task_02 |
| 09 | Dashboard enriquecido com Recharts (gráficos + métricas de venda) | completed | high | task_02 |
| 10 | Alerta visual de estoque baixo na listagem de produtos admin | completed | low | task_01 |
