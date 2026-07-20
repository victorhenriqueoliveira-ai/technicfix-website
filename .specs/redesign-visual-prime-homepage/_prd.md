# PRD: Redesign Visual Prime da Homepage

## Visão Geral

A homepage da TechnicFix é o principal cartão de visitas do negócio — o primeiro ponto de contato de profissionais da construção e consumidores que buscam fixadores e ferramentas de qualidade. Hoje o site comunica competência, mas não transmite a credibilidade premium que o produto e o atendimento merecem: cards planos, testimonials sem identidade e ausência de sinais visuais de confiança deixam margem para que o visitante hesite antes de acionar o WhatsApp.

Este PRD descreve um redesign visual da homepage que eleva a percepção de valor da marca sem alterar a identidade navy + amber existente, utilizando profundidade visual, hierarquia tipográfica mais forte, badges dinâmicos de produto e sinais de confiança mais ricos — tudo convergindo para aumentar o volume de contatos via WhatsApp.

**Para quem:** visitantes mistos — profissionais B2B (engenheiros, mestres de obra, construtores) e consumidores finais em reformas, que chegam pela primeira vez ou retornam para pesquisar produtos.

**Por que é valioso:** um visual premium diferencia a TechnicFix de concorrentes regionais de aparência genérica, reforça a percepção de qualidade do produto antes mesmo do contato, e cria mais oportunidades de acionamento do WhatsApp ao longo da página.

---

## Objetivos

- **Conversão:** aumentar o volume de cliques no CTA de WhatsApp originados da homepage em pelo menos 20% após o lançamento, medido por analytics de eventos.
- **Percepção:** visitantes que veem a homepage devem perceber o site como "profissional e confiável" — medido por pesquisa qualitativa pontual ou heatmap de engajamento.
- **Qualidade visual:** zero quebras de layout em viewports de 375px a 1440px após o redesign.
- **Consistência:** todos os componentes redesenhados devem usar exclusivamente os tokens de marca `--brand-navy` e `--brand-amber` sem hardcode de hex.
- **Prazo:** pronto para produção em uma única sprint de desenvolvimento.

---

## Histórias de Usuário

### Profissional B2B (engenheiro, mestre de obra)

- Como profissional, quero ver rapidamente que a TechnicFix é uma fornecedora confiável, para que eu não perca tempo avaliando se vale entrar em contato.
- Como profissional, quero identificar produtos em destaque com badges claros (ex.: "Mais Vendido", "Profissional"), para que eu saiba quais itens são mais adequados para uso intensivo.
- Como profissional, quero ver depoimentos reais de outros clientes com nome e avaliação, para que eu confie na qualidade do atendimento antes de pedir orçamento.

### Consumidor Final (reforma, faça-você-mesmo)

- Como consumidor, quero entender de imediato o que a loja vende e como posso ser atendido, para que eu não me perca na homepage sem tomar nenhuma ação.
- Como consumidor, quero ver as categorias de produtos de forma clara e atraente, para que eu consiga navegar facilmente até o que preciso.
- Como consumidor, quero um call-to-action de WhatsApp visível e convidativo, para que eu possa tirar dúvidas sem precisar preencher formulários longos.

### Visitante em geral (primeira visita)

- Como visitante novo, quero que a hero section me comunique o valor da loja em segundos, para que eu decida ficar na página ao invés de sair.
- Como visitante novo, quero ver um formulário de contato acessível se preferir não usar WhatsApp, para que eu tenha alternativa de contato.

---

## Features Principais

### 1. Hero Section Refinada *(Prioridade Alta)*
Overlay do banner em gradiente navy profundo e direcional, com headline em tipografia extrabold e subheadline de apoio. Badges/pills animadas ("Frete Grátis", "Qualidade Premium") posicionadas sobre o banner. CTA principal de WhatsApp em amber com efeito hover de impacto (escala + brilho). A lógica de carrossel de banners do banco de dados não é alterada — apenas o tratamento visual ao redor.

### 2. CategoryGrid com Hover Rico *(Prioridade Alta)*
Cards de categoria com bordas sutis e transição de elevação no hover (sombra profunda + scale). Labels de categoria em uppercase com letter-spacing. Ícone/imagem sobre fundo navy-light. O grid já responsivo (2/3/4 colunas) é mantido.

### 3. Product Cards com Badges Dinâmicos *(Prioridade Alta)*
Cards de produto com sombra em camadas (base + hover) e visual de profundidade. Badge dinâmico proveniente do campo `badge` do produto no banco de dados (ex.: "Mais Vendido", "Profissional", "Lançamento") — exibido somente quando o campo estiver preenchido. Preço em tipografia bold com cor de destaque amber. Botão de ação ("Ver Produto") consistente com o CTA da hero.

### 4. Testimonials com Sinais de Confiança *(Prioridade Alta)*
Cards de depoimento com borda esquerda em amber, foto/avatar do cliente (inicial do nome como fallback), nome completo, cargo/empresa e avaliação por estrelas (1–5). Fundo levemente diferenciado do branco puro (off-white ou navy/5) para destacar a seção. Posicionamento estratégico: a seção permanece próxima ao formulário de lead para reforçar credibilidade no momento de conversão.

### 5. LeadGeneralForm como "Dark Band" de Conversão *(Prioridade Média)*
Seção de formulário com fundo navy escuro, texto em branco e botão de submissão em amber — padrão "dark band" amplamente usado em e-commerces premium. Contrasta visualmente com o restante da página, criando um bloco de conversão reconhecível.

### 6. DiferenciaisSection com Ícones e Background Alternados *(Prioridade Média)*
Ícones em tamanho maior com animação leve no hover. Background alternado (navy ou off-white conforme seções vizinhas) para garantir contraste. Texto mais conciso e impactante nos diferenciais.

### 7. Badge Dinâmico no Modelo de Produto *(Prioridade Alta — pré-requisito)*
Adição de campo `badge` (texto livre, opcional) ao modelo `Product` no banco de dados. O campo é exibido visualmente no card de produto na homepage e nas páginas de produto. Produtos sem badge não exibem nenhum elemento adicional — comportamento backward-compatible.

---

## Experiência do Usuário

### Jornada do Visitante Novo

1. **Primeiro impacto (0–3s):** O visitante chega e vê a hero com overlay navy profundo, headline extrabold com proposta de valor clara e CTA de WhatsApp em amber com pill badges flutuantes. A identidade visual transmite "profissional e especializado" imediatamente.

2. **Exploração (3–30s):** O visitante rola para baixo e encontra as categorias em grid limpo com hover rico — identifica facilmente o tipo de produto. Em seguida, os produtos em destaque aparecem com badges dinâmicos ("Mais Vendido"), preço em destaque e botão consistente.

3. **Construção de confiança (30s–2min):** A seção de diferenciais reforça os pontos fortes da loja com ícones maiores. Os depoimentos com foto, estrelas e nome real reforçam a credibilidade — o visitante se sente seguro.

4. **Conversão (ao longo de toda a rolagem):** O WhatsApp está disponível em múltiplos pontos: CTA na hero, botão flutuante e botão na header. Ao final, a "dark band" do formulário captura quem prefere formulário a WhatsApp.

### Princípios de UI/UX

- **Hierarquia clara:** headline > subheadline > corpo em toda a página; o visitante nunca se perde no que é mais importante.
- **Breathing room:** seções com padding generoso — a página não "aperta" o visitante.
- **Amber como sinal de ação:** qualquer elemento em amber é um ponto de ação — CTA, badge de destaque, estrelas, borda de depoimento.
- **Navy como âncora:** fundos navy comunicam profissionalismo e estrutura; seções alternadas (navy / branco / off-white) criam ritmo visual.
- **Mobile-first:** todas as melhorias são validadas em 375px; hover states têm equivalentes de tap em mobile.
- **Acessibilidade:** contraste mínimo de 4.5:1 entre texto e fundo em todas as seções.

---

## Restrições Técnicas de Alto Nível

- O redesign se limita aos componentes em `components/home/` e ao arquivo `app/globals.css` — nenhuma outra área do codebase é tocada, exceto o schema Prisma para o campo `badge`.
- Todos os tokens de cor devem permanecer centralizados em `:root` em `globals.css`; nenhum valor hex hardcoded fora desse bloco.
- Nenhuma nova dependência de biblioteca de UI ou CSS pode ser introduzida.
- A lógica de fetch e a estrutura de dados de `app/(public)/page.tsx` não são alteradas.
- O campo `badge` no modelo `Product` deve ser opcional (nullable) para não impactar produtos existentes.

---

## Não-Objetivos (Fora de Escopo)

- **Redesign de outras páginas:** páginas de produto, categorias, contato, sobre e technocalhas ficam fora deste escopo.
- **Alteração do header e footer:** a navegação global e o rodapé não são redesenhados nesta fase.
- **Implementação de avaliações/ratings reais:** as estrelas nos testimonials são um campo de dado da seção de depoimento, não um sistema de avaliação de produtos.
- **Vídeos no hero:** suporte a hero em vídeo fica para uma fase futura.
- **Animações complexas/Lottie:** micro-interações simples (scale, opacity, shadow) são suficientes; animações de entrada mais elaboradas ficam para uma Fase 2.
- **Testes A/B:** a comparação de variantes fica fora deste escopo.
- **Dark mode:** o redesign é exclusivo para o tema light atual.

---

## Plano de Lançamento em Fases

### MVP — Fase 1: Foundation Visual
**Inclui:**
- Tokens CSS refinados (maior contraste e saturação no `:root`)
- Hero Section com overlay graduado, headline extrabold, pill badges e CTA amber impactante
- CategoryGrid com hover de elevação e labels uppercase
- LeadGeneralForm como dark band (fundo navy + CTA amber)

**Critério para avançar:** nenhuma quebra de layout em 375px, 768px e 1440px; hero comunica proposta de valor em 3s ou menos (avaliação qualitativa).

### Fase 2: Trust & Products
**Inclui:**
- Campo `badge` adicionado ao modelo Product + migração de BD
- Product cards com sombra em camadas e badges dinâmicos
- TestimonialsSection com foto/avatar, estrelas e borda amber
- DiferenciaisSection com ícones maiores e background alternado

**Critério para avançar:** badges aparecem corretamente em produtos com o campo preenchido; testimonials exibem fallback de inicial quando não há foto.

### Fase 3: Polish & Refinement
**Inclui:**
- Micro-interações adicionais (hover em diferenciais, transições suaves entre seções)
- Revisão de acessibilidade (contraste 4.5:1 verificado em todos os estados)
- Otimização de performance (animações com `transform` e `opacity` apenas)

**Critério de longo prazo:** aumento mensurável de cliques no CTA de WhatsApp da homepage vs. baseline pré-redesign.

---

## Métricas de Sucesso

- **Cliques no WhatsApp originados da homepage:** aumento de ≥ 20% comparado ao baseline pré-lançamento (medido por evento de analytics).
- **Taxa de rejeição da homepage:** redução de ≥ 10% — visitantes exploram pelo menos uma seção além do hero.
- **Zero quebras de layout:** 100% de seções sem overflow ou sobreposição em viewports de 375px a 1440px.
- **Consistência de tokens:** 0 valores hex hardcoded fora de `:root` no CSS (verificado por lint).
- **Backward-compatibility de badges:** 100% dos produtos existentes sem campo `badge` continuam exibidos normalmente.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Campo `badge` no BD causa confusão de conteúdo (texto livre sem padrão) | Média | Médio | Documentar valores recomendados (ex.: "Mais Vendido", "Profissional", "Lançamento") na interface admin |
| Sombras e micro-interações degradam performance em dispositivos mobile lentos | Baixa | Médio | Usar apenas `transform` e `opacity` em animações; evitar `box-shadow` animado |
| Seções com fundo alternado (navy/off-white) criam conflito visual entre seções contíguas | Média | Baixo | Definir sequência de fundos explícita: branco → navy → off-white → navy-dark → branco |
| Redesign de testimonials exige dados de foto que podem não existir | Alta | Baixo | Implementar fallback gracioso: inicial do nome em círculo amber quando não há foto |

---

## Architecture Decision Records

- [ADR-001: Abordagem de Produto — Premium Polish (Evolução Refinada)](adrs/adr-001.md) — Escolha da abordagem de evolução refinada em vez de token lift ou redesign editorial, com adição de campo `badge` dinâmico no modelo Product.

---

## Questões em Aberto

- **Foto de avatar nos testimonials:** o modelo de dados atual para testimonials suporta URL de foto? Se não, qual é o campo preferido para armazenar essa URL — ou usar iniciais como padrão permanente?
- **Pill badges da hero:** os textos ("Frete Grátis", "Qualidade Premium") são fixos no código ou devem vir de `SiteConfig` no BD para edição pelo admin?
- **Número de estrelas nos testimonials:** o campo de avaliação (1–5) já existe no modelo de depoimento, ou precisa ser adicionado junto com o campo `badge` do produto?
