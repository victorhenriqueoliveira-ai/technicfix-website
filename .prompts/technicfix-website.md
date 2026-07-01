<task>
  Criar o website institucional e comercial da Technicfix, uma loja de parafusos
  e materiais de obra (varejo e atacado), com painel administrativo completo,
  desenvolvido em Next.js com as melhores práticas de arquitetura.
</task>

<goal>
  Gerar presença digital profissional para a Technicfix que converta visitantes
  em leads qualificados (varejo e atacado), apresente o catálogo de produtos
  gerenciado pelo próprio dono via painel admin, destaque a empresa irmã
  Technocalhas, e esteja pronto para evoluir para vendas online sem grandes
  refatorações.
</goal>

<requirements>
  - Stack: Next.js (App Router), TypeScript, Tailwind CSS
  - Arquitetura: rotas públicas (site) e privadas (admin), separação clara de
    concerns entre camadas (UI, server actions/API routes, domínio, persistência)
  - Home: hero com CTAs destacados, seções de categorias, produtos em destaque,
    seção institucional Technocalhas (vitrine informativa com logo, descrição e
    botão de contato), depoimentos e formulário de lead
  - Catálogo público: listagem de produtos com filtro por categoria, busca e
    detalhe de produto — sem checkout (modelo catálogo + lead)
  - Público duplo (varejo e atacado) com peso igual — separação visual e CTAs
    distintos para cada segmento (ex.: "Quero comprar no varejo" vs
    "Solicitar orçamento atacado")
  - Formulários de lead: varejo (produto de interesse + contato), atacado
    (volume estimado + CNPJ + contato) — prontos para integrar com CRM/e-mail
  - Painel Admin (rota privada com autenticação):
    - CRUD completo de produtos (nome, descrição, preço, categoria, imagens)
    - CRUD de categorias
    - Gestão de banners da home
    - Visualização e atualização de status dos leads recebidos
    - Configurações básicas do site
  - Arquitetura preparada para e-commerce: modelos de dados com campos de
    estoque, SKU e preço — sem implementar checkout no MVP
  - SEO: metadados dinâmicos por página, sitemap, robots.txt
  - Design responsivo (mobile-first), com identidade visual que transmita
    solidez e confiança para o setor de construção
</requirements>

<acceptance_criteria>
  - Home carrega em menos de 3s (LCP) em conexão 4G
  - Formulários de lead enviam dados e exibem confirmação ao usuário
  - Admin consegue criar, editar e excluir produto e o resultado reflete
    imediatamente no catálogo público (sem deploy)
  - Rotas do admin retornam 401/redirect para login quando não autenticado
  - Seção Technocalhas visível na home com identidade própria e CTA
  - Site funciona corretamente em mobile, tablet e desktop
  - Leads recebidos ficam acessíveis no painel admin com status gerenciável
</acceptance_criteria>

<constraints>
  - Next.js App Router (não Pages Router)
  - Banco de dados: a definir (deixar camada de persistência abstraída para
    troca fácil — ex.: começar com SQLite/Prisma, migrar para Postgres depois)
  - Sem integração de pagamento no MVP
  - Autenticação admin: NextAuth.js ou solução equivalente, sem OAuth externo
    obrigatório (email/senha suficiente no MVP)
  - Sem dependência de CMS externo — conteúdo gerenciado via admin próprio
  - Idioma do site: Português do Brasil
</constraints>
