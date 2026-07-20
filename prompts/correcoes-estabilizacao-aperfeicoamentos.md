<task>
Correções, estabilização e aperfeiçoamentos do Technicfix
</task>

<goal>
Elevar a confiabilidade, qualidade de código e SEO do e-commerce Technicfix, resolvendo riscos ativos em produção (env vars sem validação, notificações de lead perdidas silenciosamente), eliminando débito técnico acumulado (código morto, tipos duplicados, inline style) e expandindo funcionalidades-chave do catálogo público: filtro de preço por slider, carrossel de produtos relacionados, landing pages dedicadas por categoria e sitemap dinâmico. O conjunto de melhorias aumenta a robustez operacional e a capacidade de geração de tráfego orgânico do site.
</goal>

<requirements>
Negocio:
- Garantir que o sistema falhe de forma ruidosa e descritiva ao subir sem uma variável de ambiente crítica, em vez de quebrar em runtime sem contexto.
- Garantir que toda notificação de novo lead por email seja tentada até 3 vezes com backoff exponencial antes de ser descartada.
- Registrar formalmente o risco da versão beta do NextAuth v5 no repositório, com critérios claros para upgrade futuro.
- Exibir na página de produto (/produtos/[slug]) um carrossel de até 6 produtos relacionados com imagem, nome, preço e botão de interesse.
- Criar landing pages dedicadas para cada categoria em /categorias/[slug], com header descritivo e grid de produtos filtrados.
- Adicionar filtro de preço via slider de faixa (min-max) na sidebar de /produtos.
- Gerar sitemap dinâmico com todos os produtos ativos e categorias, acessível em /sitemap.xml.
- Adicionar gráfico de evolução de leads por período no dashboard admin.

Arquitetura:
- Criar lib/env.ts com schema Zod que valida todas as variáveis de ambiente críticas no startup; substituir todos os acessos diretos a process.env.* no código por importações desse módulo.
- Implementar retry 3x com backoff exponencial no envio de email via Resend dentro da Server Action de leads, sem bloquear a resposta ao usuário.
- Criar docs/adr/001-nextauth-beta.md documentando versão atual, riscos identificados e critérios de quando e como executar o upgrade para versão stable.
- Remover código morto comentado: CategoryNav em Header.tsx (linhas 78-83) e item "Entrega" em BenefitsBar.tsx.
- Centralizar o tipo ProductWithCategory (hoje definido localmente em app/(public)/produtos/page.tsx) em lib/types.ts e atualizar imports.
- Substituir style={{ height: '650px' }} em Hero.tsx por classe Tailwind equivalente (h-[650px]).
- Envolver as tabelas de /admin/produtos e /admin/categorias em div com overflow-x-auto para scroll horizontal no mobile.
- Criar app/sitemap.ts usando MetadataRoute.Sitemap do Next.js, retornando URLs de todos os produtos (status=ativo) e categorias com lastModified.
- Converter /categorias/[slug] de redirect para Server Component dedicado; buscar categoria por slug com produtos associados.
- Estender query de /produtos para aceitar searchParams minPrice e maxPrice e filtrar WHERE price >= minPrice AND price <= maxPrice no Prisma.
- Carregar relatedProductIds da página de produto e buscar os produtos correspondentes para alimentar o carrossel.
- Adicionar query de leads por data no dashboard admin e renderizar com Recharts (já instalado).

UI/UX:
- Admin /admin/produtos e /admin/categorias: envolver tabela em div overflow-x-auto; garantir que nenhuma coluna seja cortada em mobile.
- Hero.tsx: remover style inline; usar classe Tailwind h-[650px] ou variante responsiva.
- Página /produtos/[slug]: abaixo da seção de detalhes técnicos, exibir seção "Produtos Relacionados" com carrossel horizontal scrollável; cada card deve conter imagem, nome, preço (ou "Sob consulta") e botão "Tenho interesse".
- Página /categorias/[slug]: exibir header com imagem da categoria (se cadastrada), nome e descrição (se houver), seguido de grid de produtos da categoria com os mesmos filtros e paginação de /produtos.
- Sidebar de /produtos: adicionar slider de faixa de preço com dois handles (mínimo e máximo), labels em BRL formatados dinamicamente; ao soltar o handle, atualizar searchParams e recarregar produtos.
- Dashboard admin: nova seção de gráfico de linha (Recharts LineChart) exibindo total de leads por dia nos últimos 30 dias, separado do gráfico de vendas existente.
</requirements>

<acceptance_criteria>
- Dado que o app sobe sem uma env var crítica configurada, quando o servidor iniciar, então deve lançar erro com o nome exato da variável faltando antes de aceitar qualquer requisição.
- Dado que o Resend falha ao enviar notificação de novo lead, quando a Server Action tentar o envio, então deve tentar 3 vezes com delay exponencial e registrar o erro final em console.error estruturado.
- Dado que o usuário admin acessa /admin/produtos em mobile, quando rolar horizontalmente, então deve conseguir ver todas as colunas sem corte de conteúdo.
- Dado que o usuário acessa /admin/categorias em mobile, quando rolar horizontalmente, então deve conseguir ver todas as colunas sem corte de conteúdo.
- Dado que o usuário visita /produtos/[slug] de um produto com produtos relacionados cadastrados, quando a página carregar, então deve ver um carrossel com até 6 cards (imagem, nome, preço, botão de interesse) scrolláveis horizontalmente.
- Dado que o usuário acessa /categorias/parafusos, quando a página carregar, então deve ver uma landing page com header da categoria e grid de produtos filtrados, sem ser redirecionado para /produtos.
- Dado que o usuário arrasta o slider de preço em /produtos e solta o handle, quando o filtro for aplicado, então apenas produtos com preço dentro da faixa selecionada devem ser exibidos.
- Dado que um crawler acessa /sitemap.xml, quando o sitemap for gerado, então deve conter URLs de todos os produtos com status=ativo e de todas as categorias, com lastModified correto.
- Dado que o admin acessa o dashboard, quando visualizar a seção de leads, então deve ver um gráfico de linha com quantidade de leads por dia nos últimos 30 dias.
- Dado que o arquivo docs/adr/001-nextauth-beta.md existe no repositório, quando um desenvolvedor consultar, então deve encontrar a versão atual do NextAuth, os riscos identificados e os critérios de upgrade.
- Dado que nenhum código morto comentado está presente, quando o Header.tsx e BenefitsBar.tsx forem lidos, então não devem conter blocos comentados de CategoryNav nem do item "Entrega".
- Dado que ProductWithCategory está centralizado em lib/types.ts, quando /produtos/page.tsx for lido, então não deve conter definição local do tipo.
</acceptance_criteria>

<constraints>
- FAÇA: usar lib/env.ts como único ponto de acesso a variáveis de ambiente em todo o projeto após a refatoração.
- FAÇA: implementar o retry do Resend de forma assíncrona sem bloquear o retorno da Server Action ao usuário.
- FAÇA: gerar o sitemap apenas com produtos de status=ativo.
- FAÇA: reutilizar o componente ProductCard existente no carrossel de produtos relacionados.
- FAÇA: verificar se Radix UI ou shadcn/ui já proveem um componente de slider antes de adicionar biblioteca de terceiros para o filtro de preço.
- FAÇA: manter canonical tag em /categorias/[slug] apontando para /produtos?categoria=[slug] para preservar SEO legacy durante transição.
- NÃO FAÇA: alterar o schema do Prisma neste PRD.
- NÃO FAÇA: expor variáveis de ambiente sensíveis (API keys, tokens, secrets) em componentes client-side.
- NUNCA: remover o arquivo docs/adr/001-nextauth-beta.md após criado sem decisão documentada de upgrade concluído.
</constraints>
