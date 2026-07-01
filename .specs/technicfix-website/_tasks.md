# Technicfix Website — Lista de Tarefas

## Tasks

| # | Title | Status | Complexity | Dependencies |
|---|-------|--------|------------|--------------|
| 01 | Setup do projeto: Next.js, Tailwind, shadcn/ui, Prisma, variáveis de ambiente | completed | low | — |
| 02 | Schema Prisma + migrations + seed do AdminUser | completed | medium | task_01 |
| 03 | Auth.js v5: configuração, middleware de rotas e página de login | completed | medium | task_01, task_02 |
| 04 | Layout público: Header, Footer e botão WhatsApp flutuante | completed | medium | task_01 |
| 05 | Homepage: Hero rotativo, Categorias, Produtos em Destaque, Technocalhas, Depoimentos, Formulário de Lead Geral | completed | high | task_02, task_04 |
| 06 | Catálogo de produtos: listagem paginada, filtros por categoria, busca e página de detalhe | completed | high | task_02, task_04 |
| 07 | Server Actions de lead + modais de Lead Varejo e Lead Atacado | completed | medium | task_02, task_06 |
| 08 | Páginas institucionais: Sobre, Contato e Technocalhas | completed | medium | task_04 |
| 09 | Admin: layout, sidebar, header e dashboard com métricas | completed | medium | task_02, task_03 |
| 10 | Admin: CRUD de categorias | completed | medium | task_09 |
| 11 | Admin: CRUD de produtos + upload de imagens (presigned URL Cloudflare R2) | completed | high | task_09, task_10 |
| 12 | Admin: CRUD de banners + reordenação drag-and-drop | completed | high | task_09 |
| 13 | Admin: gestão de leads — listagem, filtros, detalhe, status e notas | completed | medium | task_07, task_09 |
| 14 | Admin: configurações do site (WhatsApp, e-mail, links Technocalhas) | completed | low | task_09 |
| 15 | SEO: generateMetadata por página, sitemap dinâmico e robots.txt | pending | medium | task_05, task_06, task_08 |
| 16 | Integração final R2 + next/image: configuração de remotePatterns e validação de URLs | pending | low | task_11, task_12 |
