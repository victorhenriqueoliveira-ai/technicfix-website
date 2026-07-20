# PRD — Correções e Melhorias de Navegação no Header

## Visão Geral

O site Technicfix apresenta três problemas que prejudicam a experiência do visitante: (1) a página de catálogo trava com erro de runtime causado por um import mal resolvido do slider de preço; (2) o visitante mobile precisa fechar o menu hambúrguer manualmente após fazer uma busca; (3) não há acesso rápido a categorias e produtos pelo Header — o visitante precisa percorrer a página inicial ou a listagem de produtos para encontrar o que quer.

Este PRD cobre a correção do erro de runtime, o ajuste de UX do menu mobile e a adição de dois itens de navegação no Header ("Categorias" e "Produtos") com dropdowns em desktop e accordions em mobile.

---

## Objetivos

- Eliminar o erro de runtime na página `/produtos` causado pelo import incorreto do componente Slider.
- Reduzir o número de toques necessários para o visitante mobile chegar a um resultado de busca (de 2 para 1 — buscar e chegar, sem fechar menu separado).
- Permitir que qualquer visitante alcance qualquer categoria ou produto em no máximo 2 cliques a partir do Header.
- Aumentar a taxa de cliques em categorias e produtos via navegação do Header (baseline: 0; meta: mensurar após lançamento).

---

## Histórias de Usuário

**Visitante desktop — descoberta de categoria:**
Como visitante desktop, quero passar o cursor sobre "Categorias" no Header e ver todas as categorias hierarquicamente, para encontrar o tipo de fixador que procuro sem acessar a página inicial.

**Visitante desktop — acesso direto a produto:**
Como visitante desktop, quero passar o cursor sobre "Produtos" no Header e ver os produtos em ordem alfabética, para ir diretamente ao produto que já sei o nome.

**Visitante mobile — busca sem fricção:**
Como visitante mobile, quero digitar minha busca dentro do menu e ser levado diretamente para os resultados, sem precisar fechar o menu manualmente depois.

**Visitante mobile — navegação por categoria:**
Como visitante mobile, quero tocar em "Categorias" no menu hambúrguer e ver a lista de categorias expansível, sem sair do menu.

**Visitante qualquer — catálogo sem erro:**
Como visitante na página `/produtos`, quero conseguir filtrar por faixa de preço sem erros de tela branca.

---

## Features Principais

### F1 — Correção do PriceFilter (erro de runtime)

O componente `PriceFilter.tsx` usa o slider de faixa de preço com um padrão de import que resulta em `undefined` em runtime, causando tela em branco na página `/produtos`. O import deve ser corrigido para o padrão esperado pela versão instalada da biblioteca.

Como parte desta correção, todos os outros componentes do projeto que importam bibliotecas de UI de terceiros devem ser verificados para o mesmo tipo de erro (import namespace vs. named export), garantindo que não existam outras instâncias do problema.

### F2 — Fechamento automático do menu mobile após busca

Ao confirmar uma busca dentro do menu hambúrguer (pressionar Enter ou clicar no botão de busca), o menu deve fechar automaticamente antes de exibir os resultados. O visitante não deve precisar fechar o drawer manualmente — a navegação é imediata e sem etapas extras.

### F3 — Item "Categorias" no Header com dropdown hierárquico

Um item "Categorias" aparece na barra de navegação do Header em desktop e no menu hambúrguer em mobile.

**Desktop:** ao hover ou clique, um dropdown exibe as categorias pai em ordem alfabética. Cada categoria pai com subcategorias exibe as filhas abaixo, em formato de mega-menu. Cada item leva para `/categorias/[slug]`.

**Mobile:** "Categorias" aparece como item no Sheet (menu hambúrguer). Ao tocar, um accordion expande exibindo a lista de categorias (com subcategorias se houver), sem fechar o menu.

### F4 — Item "Produtos" no Header com dropdown plano

Um item "Produtos" aparece ao lado de "Categorias" na navegação do Header.

**Desktop:** ao hover ou clique, um dropdown exibe até 30 produtos ativos em ordem alfabética (A–Z), cada um com link para `/produtos/[slug]`. Um link fixo "Ver todos os produtos" aparece ao final da lista, levando para `/produtos`.

**Mobile:** "Produtos" aparece como item no Sheet com accordion expansível, mesmo comportamento do item "Categorias".

---

## Experiência do Usuário

**Visitante desktop:**
1. Acessa qualquer página do site.
2. Visualiza o Header com os itens "Categorias" e "Produtos" na barra de navegação.
3. Passa o cursor (ou clica) em "Categorias" — dropdown abre com hierarquia de categorias.
4. Clica na categoria desejada — navega para `/categorias/[slug]`.
5. Alternativamente: passa o cursor em "Produtos" — dropdown abre com até 30 produtos A–Z + "Ver todos".

**Visitante mobile:**
1. Toca no ícone de menu hambúrguer — drawer abre.
2. Vê itens "Categorias" e "Produtos" no topo do drawer (antes do WhatsApp).
3. Toca em "Categorias" — accordion expande com lista de categorias; toca na desejada e navega.
4. Ou: digita no campo de busca e pressiona Enter — drawer fecha automaticamente e resultados aparecem.

**Requisitos de acessibilidade:**
- Dropdowns e accordions devem ser navegáveis por teclado (Tab, Enter, Escape).
- Links devem ter texto descritivo acessível.
- Drawer mobile deve manter foco gerenciado ao abrir/fechar.

---

## Restrições Técnicas de Alto Nível

- Categorias e produtos são dados dinâmicos do banco — devem ser buscados server-side para não impactar o tempo de interação (sem loading states visíveis para o visitante).
- O Header aparece em todas as páginas públicas — qualquer degradação de performance é amplificada.
- O componente `CategoryNav.tsx` existente (que já implementa a navegação hierárquica) deve ser reaproveitado.
- Sem dependências npm novas para os dropdowns.

---

## Não-Objetivos (Fora de Escopo)

- Busca dentro dos dropdowns (filtrar categorias ou produtos dentro do dropdown via campo de texto).
- Imagens de produto ou categoria dentro dos dropdowns.
- Paginação dentro do dropdown de Produtos (o limite de 30 itens substitui a necessidade).
- Reordenação manual de itens nos dropdowns (sempre A–Z).
- Animações elaboradas de abertura/fechamento dos dropdowns além do comportamento padrão de hover/focus.
- Modificação do design visual do Header além da adição dos dois novos itens de navegação.

---

## Plano de Lançamento em Fases

### MVP (Fase 1) — Correção e navegação básica

- F1: Correção do PriceFilter + varredura de imports
- F2: Fechamento automático do menu mobile após busca
- F3: Item "Categorias" com dropdown hierárquico (desktop + mobile)
- F4: Item "Produtos" com dropdown plano limitado a 30 (desktop + mobile)

**Critério de sucesso:** `/produtos` carrega sem erro de runtime; menu mobile fecha ao buscar; ambos os dropdowns funcionam em desktop e mobile com dados reais do banco.

### Fase 2 — Refinamento (futuro, fora deste PRD)

- Animações de abertura/fechamento dos dropdowns.
- Destaque visual para categoria ou produto "em alta" no dropdown.
- Busca inline dentro do dropdown de Produtos.

---

## Métricas de Sucesso

- Taxa de erro runtime na página `/produtos`: 0% (baseline: 100% com PriceFilter).
- Cliques em "Categorias" ou "Produtos" no Header: mensurar via eventos de analytics após lançamento.
- Número de etapas para o visitante mobile chegar ao resultado de busca: 1 (era 2 — buscar + fechar menu).
- Ausência de regressões: todas as páginas públicas carregam sem erro após o deploy.

---

## Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Fetch de categorias e produtos em todas as páginas aumenta latência do Header | Executar os dois fetches em paralelo (Promise.all); ambas as queries são leves (select de name e slug) |
| CategoryNav existente pode ter comportamento visual incompatível com a nova posição no Header | Testar visualmente em desktop e mobile antes de finalizar; ajustar estilos via props/classes se necessário |
| Dropdown de Produtos com 30 itens pode não cobrir os mais buscados (se o banco tiver muitos produtos) | O link "Ver todos os produtos" garante acesso completo; em Fase 2 pode-se priorizar por popularidade |

---

## Architecture Decision Records

- [ADR-001: Integrar CategoryNav existente ao Header em vez de criar NavBar do zero](adrs/adr-001.md) — Reusa `CategoryNav.tsx` já funcional para o dropdown de Categorias; cria `ProductsDropdown` análogo para Produtos.

---

## Questões em Aberto

- Deve o item "Produtos" no dropdown ordenar por popularidade (mais vendidos) em vez de A–Z em uma Fase 2? A definir conforme dados de analytics pós-lançamento.
- Os itens "Categorias" e "Produtos" devem aparecer em qual posição exata na NavBar do desktop — antes ou depois de outros links existentes (ex.: "Sobre", "Contato")? Verificar com o layout atual do Header no momento da implementação.
