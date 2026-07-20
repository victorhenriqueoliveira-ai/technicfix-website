# PRD: Homepage E-commerce Estilo Jofepar — TechnicFix

## Visão Geral

A homepage atual da TechnicFix transmite uma identidade institucional — útil para apresentar a empresa, mas fraca para converter visitantes em compradores. O objetivo é transformá-la em uma vitrine de e-commerce profissional, inspirada no Jofepar (referência de mercado em fixadores no Brasil), onde o visitante entra e imediatamente reconhece que está em uma loja real: categorias navegáveis, produtos com foto e preço, banners promocionais, e acesso direto ao WhatsApp por produto.

A conversão continua via WhatsApp — sem carrinho, sem checkout. O site funciona como catálogo visual que qualifica o visitante e o leva diretamente à conversa de venda.

**Para:** visitantes do site (construtores, encarregados de obra, compradores de manutenção industrial, pequenos varejistas).
**Valor:** credibilidade de loja real → mais tempo no site → mais cliques no botão WhatsApp → mais pedidos.

---

## Objetivos

- Aumentar a taxa de clique no botão WhatsApp da homepage em pelo menos 40% (baseline: próximas 30 dias após o lançamento).
- Reduzir a taxa de rejeição (bounce rate) da homepage em 25% — visitante que encontra categorias e produtos fica mais tempo.
- Fazer o visitante encontrar produtos relevantes em menos de 3 cliques a partir da homepage.
- Elevar a percepção de profissionalismo da marca (avaliação subjetiva via feedback de clientes).

---

## Histórias de Usuário

### Visitante Novo (comprador não-técnico)

- Como comprador novo, quero ver imediatamente as categorias de produto disponíveis para saber se a loja tem o que preciso.
- Como comprador novo, quero clicar em uma categoria no menu e ver subcategorias detalhadas para encontrar o tipo exato de fixador.
- Como comprador novo, quero ver fotos de produto com preço para decidir se vale entrar em contato.
- Como comprador novo, quero um botão "Falar pelo WhatsApp" direto no card do produto para não precisar procurar o contato.

### Visitante Recorrente (comprador técnico/profissional)

- Como comprador profissional, quero usar a busca no header para encontrar um produto específico por nome ou código sem navegar pelas categorias.
- Como comprador profissional, quero ver o badge do produto (ex.: "Mais Vendido", "Inox") para identificar rapidamente o item certo.
- Como comprador profissional, quero clicar em "Ver detalhes" para acessar as especificações técnicas completas antes de entrar em contato.

### Visitante Mobile (obra/campo)

- Como visitante mobile, quero que o header e o menu sejam fáceis de usar com o polegar para navegar no celular no canteiro de obra.
- Como visitante mobile, quero que o carrossel de banners e os cards de produto carreguem rápido e sem necessidade de zoom.

---

## Features Principais

### F1 — Header Renovado em 3 Camadas

**O que faz:** substitui o header atual (una linha com nav de links) por 3 camadas distintas.

1. **Top bar** (linha superior estreita, fundo navy): exibe informação de contato ou aviso de entrega. Visível apenas em desktop.
2. **Linha principal** (logo + busca + CTA): logo à esquerda, campo de busca central que redireciona para `/produtos?busca=<termo>` ao pressionar Enter ou clicar na lupa, botão "Falar pelo WhatsApp" à direita.
3. **Barra de categorias** (fundo navy ou amber): uma categoria-pai por item, cada uma com ícone derivado da imagem da categoria + nome em texto. Ao hover no desktop, exibe mega-dropdown com as subcategorias daquela categoria-pai. Menu mobile: hamburger que abre sheet lateral com categorias expansíveis (acordeão).

**Por que importante:** é a primeira estrutura que o visitante percorre. Define se ele entende que está em uma loja ou em um site institucional.

---

### F2 — Hero Banner Full-Width Sem Overlay Pesado

**O que faz:** o carrossel de banners do BD ocupa 100% da largura da tela com altura fixa (~420px no desktop). Sem overlay navy pesado — a imagem é visível por completo. Setas de navegação nas laterais e indicadores de dots abaixo. Auto-rotação mantida. Quando não há banners no BD, exibe fallback com fundo amber e texto "Fixação que não Falha" sem quebrar.

**Por que importante:** banner full-width é o sinal mais imediato de loja profissional. O overlay escuro atual oculta o conteúdo da imagem promovida.

---

### F3 — Barra de Benefícios (4 Itens)

**O que faz:** faixa horizontal logo abaixo do banner com 4 colunas. Cada item: ícone outline + título bold (ex.: "Frete para Todo o Brasil") + descrição small (ex.: "Correios e transportadoras"). Fundo branco, borda inferior leve. Conteúdo fixo no código (não configurável via BD nesta fase).

**Por que importante:** o Jofepar usa essa faixa para construir confiança imediatamente após o banner — entrega, pagamento, qualidade, contato. Reduz a hesitação do visitante antes de navegar pelos produtos.

**4 benefícios padrão:**
1. Frete para Todo o Brasil — Correios e transportadoras
2. Atendimento via WhatsApp — Resposta rápida
3. Qualidade Garantida — Produtos certificados
4. Variedade de Fixadores — Parafusos, porcas, arruelas e mais

---

### F4 — Hierarquia de Categorias (Pai / Filho)

**O que faz:** o modelo de categoria ganha suporte a hierarquia: uma categoria pode ser filha de outra. Categorias-pai aparecem no nav; subcategorias (filhas) aparecem no mega-dropdown de cada pai e nas URLs de filtro de produto.

**Por que importante:** sem hierarquia, o mega-dropdown não tem conteúdo. E sem mega-dropdown, o nav é apenas uma lista plana de links — sem o poder de orientação do Jofepar.

**Fluxo de cadastro:** o operador cria categorias-pai (ex.: "Parafusar") e depois cria categorias-filho vinculando ao pai (ex.: "Parafuso Allen", "Parafuso Sextavado") no admin.

---

### F5 — Seções de Produto por Categoria na Homepage

**O que faz:** para cada categoria-pai que tiver produtos cadastrados, a homepage exibe uma seção com:
- Título da categoria em bold uppercase com linha decorativa à esquerda (padrão Jofepar)
- Grid de até 8 produtos da categoria (ou de suas subcategorias) em 4 colunas no desktop / 2 no mobile
- Link "Ver todos" ao final da seção → `/produtos?categoria=<slug>`

**Card de produto:**
- Imagem quadrada 1:1, fundo cinza claro, sem corte
- Badge no canto superior esquerdo se `product.badge` estiver preenchido
- Nome do produto (2 linhas, truncado)
- Preço em destaque amber bold (visível apenas se `showPrice=true`)
- Dois botões: "Falar pelo WhatsApp" (abre conversa com mensagem pré-preenchida: "Olá, tenho interesse no produto [nome]") + "Ver detalhes" (link para página do produto)

**Por que importante:** é o conteúdo central da homepage — o catálogo em si. Sem isso, a homepage é uma landing page vazia com um banner.

---

### F6 — Barra de Busca Funcional no Header

**O que faz:** input de busca no header reutiliza a lógica existente de `SearchBar.tsx` (debounce 300ms, atualiza URL). No header, ao pressionar Enter ou clicar na lupa, redireciona para `/produtos?busca=<termo>` onde a página de produtos já filtra por nome.

**Por que importante:** visitante profissional sabe o que quer — ele digita "parafuso M8 inox" e vai direto ao resultado. Sem busca no header, ele precisaria navegar até `/produtos` primeiro.

---

## Experiência do Usuário

### Fluxo Principal — Visitante Desktop

1. Acessa a homepage → vê o novo header com logo, busca e botão WhatsApp em destaque.
2. Olha a barra de categorias → reconhece as categorias do negócio.
3. Hover em uma categoria → mega-dropdown exibe subcategorias em lista.
4. Vê o banner full-width → imagem promocional visível sem overlay.
5. Vê a barra de benefícios → confia que tem frete e atendimento.
6. Rola para baixo → encontra seções "PARAFUSAR", "FIXAR", etc. com produtos.
7. Vê um produto de interesse → clica "Falar pelo WhatsApp" → WhatsApp abre com mensagem pré-preenchida.

### Fluxo Alternativo — Visitante Mobile

1. Acessa pelo celular → header compacto com logo e hamburger.
2. Abre o menu → categorias em acordeão (pai expande para mostrar filhos).
3. Busca no campo do header → redireciona para /produtos com filtro ativo.
4. Rola os cards em grid 2 colunas → toca em "Ver detalhes" para especificações.
5. Confirma interesse → toca em "Falar pelo WhatsApp".

### Considerações de UX

- Mega-dropdown fecha ao mover o mouse para fora da categoria — sem travar na tela.
- Banner mantém auto-rotação de 5s mas pausa ao hover.
- Cards com `showPrice=false` ocultam o preço mas mantêm os botões de ação.
- Seções de categoria sem produtos não são renderizadas (sem seções vazias).

---

## Restrições Técnicas de Alto Nível

- Não introduzir novas bibliotecas de UI além das já presentes (Tailwind CSS, shadcn/ui, Lucide icons).
- Não adicionar chamadas de API externas — todos os dados vêm do BD.
- Número de WhatsApp sempre vindo do `SiteConfig` — nunca hardcoded.
- A página de produtos (`/produtos`), a página de produto (`/produtos/[slug]`) e as demais rotas públicas não são alteradas nesta feature.
- O painel admin é atualizado para suportar cadastro de categoria-pai/filho, mas a UI admin não é redesenhada.

---

## Não-Objetivos (Fora de Escopo)

- **Carrinho de compras** — fora do escopo; conversão é sempre via WhatsApp.
- **Login/cadastro de cliente** — fora do escopo.
- **Autocomplete na busca** (sugestões em dropdown enquanto digita) — fase futura.
- **Filtros avançados na homepage** (por material, diâmetro, etc.) — já existem em `/produtos`.
- **Barra de redes sociais no top bar** — não há links de redes sociais cadastrados; fora do escopo inicial.
- **Redesign da página de produtos** (`/produtos`) — inalterada nesta fase.
- **Redesign do admin** além do suporte a categoria pai/filho.
- **Animação 3D ExplodingScene** — removida do hero nesta versão (hero passa a ser banner puro).
- **TechnocalhasSection** na homepage — movida para o footer ou removida; não está no fluxo Jofepar.
- **LeadGeneralForm** na homepage — removida; WhatsApp é o canal de contato.

---

## Plano de Lançamento em Fases

### MVP (Fase 1) — Homepage Jofepar Funcional

- Hierarquia de categorias (parentId) implementada com migração.
- Header novo com top bar, linha logo/busca/WhatsApp e barra de categorias + mega-dropdown.
- Banner full-width sem overlay pesado.
- Barra de benefícios com 4 itens fixos.
- Seções de produto por categoria (sem seções vazias) com cards WhatsApp + Ver detalhes.
- Admin de categorias atualizado para suportar pai/filho.
- **Critério de avanço:** homepage ao vivo, nenhuma regressão nas outras páginas, mega-dropdown funcional no mobile.

### Fase 2 — Refinamentos

- Barra de benefícios configurável via `SiteConfig` (textos e ícones editáveis no admin).
- Autocomplete na busca do header (sugestões de produto ao digitar).
- TechnocalhasSection movida para o footer como link discreto.

### Fase 3 — Otimização

- Analytics de cliques por seção de categoria (qual categoria gera mais cliques no WhatsApp).
- A/B test: seções ordenadas por popularidade vs. ordem manual.

---

## Métricas de Sucesso

- **Taxa de clique no WhatsApp** (homepage): aumento ≥ 40% nos primeiros 30 dias.
- **Bounce rate** da homepage: redução ≥ 25%.
- **Tempo médio na página**: aumento de pelo menos 30 segundos.
- **Páginas por sessão**: aumento de 1,5x (visitante navega por mais seções).
- **Zero regressão**: todas as páginas públicas e admin funcionando após o deploy.

---

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Header novo quebra em mobile (mega-dropdown) | Média | Testar em iOS Safari e Android Chrome antes do merge |
| Categorias sem parentId no BD — mega-dropdown vazio | Alta | Documentar para o operador criar hierarquia no admin; fallback: mostrar todas as categorias planas no dropdown |
| Performance da homepage com múltiplas seções de produto | Média | Limitar a 8 produtos por seção; usar `loading="lazy"` nas imagens |
| Visitante confuso com remoção do formulário de contato | Baixa | WhatsApp já está em destaque no header e em cada card |
| Banner sem imagem no BD (sem fallback visual) | Baixa | Fallback com cor amber + tagline mantido |

---

## Architecture Decision Records

- [ADR-001: Substituição Completa do Header e Homepage](adrs/adr-001.md) — Abordagem Jofepar pura escolhida em vez de evolução incremental ou ajuste mínimo.

---

## Questões em Aberto

- Os ícones das categorias no nav serão as imagens do BD (`imageUrl`) ou ícones SVG fixos por categoria? Definir antes da implementação do header.
- Ordem das seções de categoria na homepage: alfabética, por quantidade de produtos ou manual (campo `order` a ser adicionado ao Category)?
- A `TechnocalhasSection` vai para o footer ou é removida completamente?
