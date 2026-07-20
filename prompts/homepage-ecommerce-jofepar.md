<task>
Homepage e-commerce estilo Jofepar para TechnicFix
</task>

<goal>
Reformular completamente a homepage da TechnicFix para ter a aparência e estrutura de um e-commerce profissional de fixadores — inspirado no Jofepar (jofepar.com.br). A conversão continua via WhatsApp (sem carrinho ou checkout). O visitante deve entrar no site e imediatamente perceber que está em uma loja real: banner promocional full-width, nav de categorias com mega-dropdown, cards de produto com foto e preço, e barra de benefícios. Resultado esperado: aumento de credibilidade visual e mais cliques no botão WhatsApp.
</goal>

<requirements>
Negocio:
- A homepage deve transmitir profissionalismo de e-commerce mesmo sem carrinho.
- Cada card de produto deve ter um botão "Falar pelo WhatsApp" que abre conversa direta com o número configurado no SiteConfig.
- Categorias principais (sem parentId) devem aparecer no nav horizontal; subcategorias (com parentId) aparecem no mega-dropdown de cada pai.
- O schema de Category deve receber campo parentId nullable (auto-referencial) com migração Prisma — permite estruturar hierarquia pai/filho no admin.
- As seções de produtos na homepage mostram produtos agrupados por categoria principal (as que têm featured=true ou as primeiras N por categoria).
- A barra de benefícios exibe 4 itens fixos configuráveis via SiteConfig ou hardcoded inicialmente: "Frete para todo o Brasil", "Atendimento via WhatsApp", "Qualidade Premium" e "Entrega Rápida".

Arquitetura:
- Adicionar parentId: String? @relation("CategoryChildren") ao model Category em prisma/schema.prisma, com relação self-referential (children e parent).
- Migração: npx prisma migrate dev --name add_category_parent.
- Atualizar lib/types.ts: CategorySummary ganha children: CategorySummary[] para uso no nav dropdown.
- O fetch de categorias no layout (ou page.tsx) deve incluir children aninhados (include: { children: true }).
- O Header.tsx atual deve ser substituído ou fortemente refatorado para incluir: barra superior navy, linha com logo + busca + CTA WhatsApp, barra de categorias com mega-dropdown.
- A busca no header é client-side input que redireciona para /produtos?q=<termo> (sem autocomplete na fase inicial).
- A homepage (page.tsx) deve buscar: banners, categorias com children, produtos em destaque por categoria.
- Substituir o Hero atual (navy escuro com overlay) por banner full-width sem overlay pesado — imagem ocupa 100% da largura, carrossel com dots e setas.
- Remover ou mover para após os produtos: DiferenciaisSection, TechnocalhasSection, LeadGeneralForm.

UI/UX:
- Paleta: fundo branco (#ffffff) e cinza clarissimo (#f5f5f5) para seções alternadas; acento laranja/amber (brand-amber) em botões, preços e destaques; navy só no top bar, nav de categorias e footer.
- Header em três linhas: (1) top bar navy estreita com info de contato/WhatsApp; (2) logo + input de busca + botão WhatsApp CTA; (3) barra de categorias amber/navy com mega-dropdown.
- Mega-dropdown: ao hover na categoria-pai, exibe painel com as subcategorias em lista. Fecha ao sair do hover.
- Banner hero: carrossel full-width, altura ~420px, imagem cobre tudo sem overlay escuro. Dots e setas de navegação.
- Barra de benefícios: 4 colunas com ícone outline + título bold + descrição small, fundo branco, borda-bottom ou separador leve.
- Seções de produtos por categoria: título da categoria em bold uppercase com linha decorativa à esquerda (como Jofepar) + grid 4 colunas de cards.
- Card de produto: fundo branco, imagem quadrada 1:1 fundo cinza claro, nome do produto (2 linhas truncadas), preço em amber bold, botão full-width verde WhatsApp "Falar pelo WhatsApp" com ícone.
- Badge de produto (campo badge do BD) exibido como etiqueta no canto superior esquerdo da imagem.
- Layout responsivo: mobile-first, grid colapsa para 2 colunas no mobile, 1 coluna no xs.
- Manter footer existente.
</requirements>

<acceptance_criteria>
- Dado que o visitante acessa a homepage, quando a página carrega, então vê o header com top bar + busca + nav de categorias.
- Dado que o visitante hover em uma categoria-pai no nav, quando o dropdown abre, então exibe as subcategorias daquela categoria.
- Dado que o visitante digita um termo na busca e pressiona Enter, quando redireciona, então vai para /produtos?q=<termo>.
- Dado que há banners cadastrados no BD, quando o hero carrega, então exibe as imagens em carrossel full-width sem overlay escuro.
- Dado que não há banners no BD, quando o hero carrega, então exibe um fallback com imagem ou cor de fundo amber/navy sem quebrar.
- Dado que a homepage carrega, então a barra de benefícios com 4 itens é exibida abaixo do hero.
- Dado que há produtos com categoria definida, quando as seções de produto carregam, então cada seção mostra o título da categoria e os produtos em grid 4 colunas.
- Dado que o visitante clica em "Falar pelo WhatsApp" em um card de produto, quando abre o WhatsApp, então a mensagem pré-preenchida menciona o nome do produto.
- Dado que um produto tem badge preenchido no BD, quando o card é renderizado, então o badge aparece no canto superior esquerdo da imagem.
- Dado que a tela é mobile (< 640px), quando o grid de produtos carrega, então exibe 2 colunas.
</acceptance_criteria>

<constraints>
- FAÇA: adicionar parentId ao model Category com migração antes de implementar o nav dropdown.
- FAÇA: manter o número de WhatsApp vindo do SiteConfig — nunca hardcoded.
- FAÇA: usar os tokens de cor existentes (brand-amber, brand-navy, brand-navy-dark) — apenas fundo das seções muda para branco/cinza claro.
- FAÇA: manter /produtos, /categorias, /contato e demais páginas intactas — apenas homepage e header são alterados.
- NÃO FAÇA: adicionar carrinho, checkout, login de cliente ou qualquer fluxo de compra.
- NÃO FAÇA: chamar APIs externas — todos os dados vêm do BD via Prisma.
- NÃO FAÇA: usar bibliotecas de UI externas (shadcn já disponível, Tailwind CSS).
- NUNCA: hardcodar preços, nomes de categoria ou número de WhatsApp.
</constraints>
