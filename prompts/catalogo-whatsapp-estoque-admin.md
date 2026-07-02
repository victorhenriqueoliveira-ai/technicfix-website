<task>
Catálogo público orientado a WhatsApp com controle de estoque e admin enriquecido
</task>

<goal>
Transformar as páginas públicas de produto em um catálogo focado em conversão via WhatsApp — sem checkout — onde cada produto gera um link direto com o nome do produto, diferenciando fluxo varejo (compra direta) de atacado (pedido de orçamento). Complementar com formulário de captura de lead como canal alternativo ao WhatsApp. Na página de produto, exibir produtos relacionados para aumentar o tempo de permanência e o ticket médio.

No admin, criar o módulo de Vendas (registro manual que desconta do estoque) e enriquecer o Dashboard com gráficos de vendas ao longo do tempo e ranking dos produtos mais vendidos, mantendo o painel enxuto e funcional.
</goal>

<requirements>
Negocio:
- Cada produto tem um tipo de público: varejo, atacado ou ambos — definido pelo admin no cadastro do produto.
- Na página pública do produto, o visitante que identifica ser varejista vê o botão "Comprar via WhatsApp" com mensagem pré-preenchida contendo o nome do produto.
- O visitante que identifica ser atacadista vê o botão "Pedir Orçamento via WhatsApp" com mensagem pré-preenchida solicitando orçamento com o nome do produto.
- O visitante escolhe seu perfil (varejista / atacadista) na própria página do produto — essa escolha altera o CTA exibido.
- Além do WhatsApp, o visitante pode preencher um formulário de lead na mesma página; o lead é salvo no banco de dados E dispara e-mail de notificação para o responsável da loja.
- O formulário de lead captura: nome, e-mail, telefone, tipo (varejo/atacado) e mensagem opcional; para atacado, também captura empresa, CNPJ, volume estimado e prazo desejado (campos opcionais).
- A página de produto exibe uma seção de produtos relacionados: automaticamente produtos da mesma categoria, com possibilidade de o admin fixar manualmente produtos relacionados específicos no cadastro do produto.
- No admin, um novo módulo "Vendas" permite registrar uma venda manualmente: selecionar produto, informar quantidade vendida e, ao confirmar, descontar automaticamente do campo `stock` do produto.
- O registro de venda também armazena: produto, quantidade, tipo de comprador (varejo/atacado), data e notas opcionais.
- O Dashboard exibe: métricas existentes (produtos, categorias, leads novos) + total de vendas do mês + gráfico de vendas por dia/semana + ranking dos 5 produtos mais vendidos por quantidade.

Arquitetura:
- O campo `stock` já existe no model `Product` (Prisma). Adicionar campo `productType` (enum: varejo, atacado, ambos) ao model `Product`.
- Criar novo model `Sale` no Prisma: id, productId, quantity, buyerType (varejo/atacado), notes, createdAt.
- Adicionar campo `relatedProductIds String[]` ao model `Product` para os relacionados manuais.
- Criar Server Actions para: registrar venda (decrementa stock, cria Sale), buscar vendas com filtros de período.
- O e-mail de notificação de lead deve ser enviado via Server Action usando a configuração de e-mail já presente em `SiteConfig` (campo `contactEmail`).
- O número de WhatsApp já existe em `SiteConfig.whatsappNumber` — usar esse valor para montar os links de WhatsApp.
- Produtos relacionados automáticos: query de produtos da mesma categoria excluindo o produto atual; relacionados manuais: query pelos ids em `relatedProductIds`.
- As cores e identidade visual (TechnicFix) já estão definidas na branch — não alterar paleta nem tipografia.

UI/UX:
- Página pública do produto: adicionar seletor de perfil (varejista / atacadista) — pode ser toggle ou dois botões distintos — que troca o CTA do WhatsApp em tempo real (client component).
- Botão WhatsApp varejo: cor primária da marca, ícone WhatsApp, texto "Comprar via WhatsApp".
- Botão WhatsApp atacado: variação de cor ou badge "Atacado", texto "Pedir Orçamento via WhatsApp".
- Formulário de lead: seção colapsável ou card abaixo dos CTAs, com campos progressivos (campos de atacado aparecem ao selecionar tipo atacado).
- Seção "Produtos Relacionados" ao final da página de produto: grid responsivo de cards de produto (reaproveitar `ProductCard` existente), mínimo 3, máximo 8 itens.
- Admin — módulo Vendas: listagem de vendas com colunas (produto, qtd, tipo, data, notas) + botão "Registrar Venda" que abre modal/drawer com campos: busca de produto, quantidade, tipo de comprador, notas.
- Admin — Dashboard enriquecido: nova métrica "Vendas este mês" + gráfico de linha ou barras de vendas por período (últimos 30 dias por padrão, com seletor semanal/mensal) + lista de top 5 produtos mais vendidos com barra de progresso visual. Layout em grid enxuto, sem poluição visual.
- Admin — Produtos: exibir coluna "Estoque" na listagem de produtos; ao entrar no produto, mostrar estoque atual e alertar visualmente quando stock ≤ 5.
- Manter sidebar admin existente; adicionar item "Vendas" no menu.
- Layout responsivo em todas as telas novas; mobile-first.
</requirements>

<api_contracts>
APIs de backend (Server Actions / API Routes):

- `registerSale(productId, quantity, buyerType, notes?)` — valida estoque suficiente, cria `Sale`, decrementa `Product.stock`. Retorna erro se quantity > stock atual.
- `getSalesSummary(period: '7d' | '30d' | 'month')` — retorna total de vendas e agrupamento por dia para o gráfico do dashboard.
- `getTopProducts(limit: 5)` — retorna produtos ordenados por soma de vendas no período.
- `submitLead(data: LeadFormData)` — cria Lead no banco e envia e-mail de notificação para `SiteConfig.contactEmail`.
- `getRelatedProducts(productId, categoryId, manualIds[])` — retorna até 8 produtos: manuais primeiro, complementados pelos da mesma categoria.
</api_contracts>

<acceptance_criteria>
- Dado que o visitante está na página de um produto varejo, quando selecionar "Sou varejista", então o botão WhatsApp exibe "Comprar via WhatsApp" com mensagem pré-preenchida com o nome do produto.
- Dado que o visitante está na página de um produto atacado, quando selecionar "Sou atacadista", então o botão WhatsApp exibe "Pedir Orçamento via WhatsApp" com mensagem pré-preenchida solicitando orçamento.
- Dado que o visitante preenche e envia o formulário de lead, então o lead é salvo no banco de dados E um e-mail de notificação é enviado para o e-mail configurado em SiteConfig.
- Dado que há produtos na mesma categoria, quando o visitante acessa a página de um produto, então a seção "Produtos Relacionados" exibe ao menos 3 produtos.
- Dado que o admin registra uma venda informando produto e quantidade, então o campo `stock` do produto é decrementado exatamente pela quantidade informada.
- Dado que a quantidade solicitada na venda excede o estoque atual, então o sistema exibe erro e não registra a venda.
- Dado que o admin acessa o Dashboard, então visualiza o gráfico de vendas dos últimos 30 dias e o ranking dos 5 produtos mais vendidos.
- Dado que um produto tem estoque ≤ 5, então a listagem de produtos no admin exibe alerta visual nessa linha.
- Dado que o admin acessa o menu lateral, então o item "Vendas" está presente e navega para a listagem de vendas.
</acceptance_criteria>

<constraints>
- FAÇA: usar o campo `whatsappNumber` de `SiteConfig` para montar todos os links de WhatsApp — nunca hardcodar o número.
- FAÇA: usar o campo `contactEmail` de `SiteConfig` para o e-mail de notificação de lead.
- FAÇA: reaproveitar componentes existentes — `ProductCard`, `LeadStatusBadge`, `LeadTypeBadge`, `MetricCard` — estendendo-os se necessário.
- FAÇA: validar estoque disponível antes de confirmar qualquer venda.
- FAÇA: manter a paleta de cores e identidade visual já definida na branch `feature/redesign-visual-publico`.
- NÃO FAÇA: implementar checkout, carrinho ou pagamento de nenhuma forma.
- NÃO FAÇA: alterar o fluxo de autenticação do admin existente.
- NÃO FAÇA: criar nova biblioteca de gráficos sem verificar se já existe dependência compatível no projeto.
- NUNCA: expor o número de WhatsApp hardcodado no código — sempre buscar de SiteConfig.
- NUNCA: enviar e-mail diretamente do cliente (browser) — sempre via Server Action.
</constraints>
