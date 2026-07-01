# PRD — Technicfix Website

**Versão:** 1.0  
**Data:** 2026-07-01  
**Status:** Rascunho

---

## Visão Geral

A Technicfix é uma loja de parafusos, itens de segurança de obra, cintos e utensílios para construção civil, que atende tanto o consumidor final (varejo) quanto empresas e construtoras (atacado) com o mesmo peso de importância. O objetivo deste projeto é criar a presença digital da Technicfix: um site institucional e de catálogo que converta visitantes em leads qualificados, seja gerenciado pelo próprio dono via painel administrativo, e esteja arquiteturalmente preparado para evoluir para vendas online sem grandes refatorações.

O site também deve destacar a **Technocalhas**, empresa irmã do mesmo dono, em uma seção visualmente chamativa na homepage.

---

## Objetivos

1. **Gerar leads qualificados** de varejo e atacado por meio de formulários segmentados acessíveis diretamente nas páginas de produto
2. **Apresentar o catálogo completo** de produtos com filtros técnicos (categoria, especificação), gerenciado pelo admin sem intervenção de desenvolvedor
3. **Dar visibilidade à Technocalhas** com seção institucional destacada na homepage
4. **Estabelecer credibilidade** com design sólido, responsivo e voltado ao setor de construção civil
5. **Preparar a base tecnológica** para evolução futura para e-commerce completo sem refatoração de arquitetura

---

## Histórias de Usuário

### Visitante (Varejo)
- Como pessoa física interessada em parafusos ou materiais de obra, quero navegar pelo catálogo por categoria para encontrar o produto que preciso sem saber o nome técnico exato
- Como visitante de varejo, quero informar meu interesse em um produto e deixar meu contato para ser atendido pela loja
- Como visitante, quero ver o site funcionando bem no celular, pois acesso durante a obra

### Visitante (Atacado / B2B)
- Como responsável de compras de uma construtora, quero solicitar orçamento de grande volume diretamente na página do produto informando meu CNPJ e quantidade estimada
- Como comprador B2B, quero identificar rapidamente que a Technicfix atende pessoa jurídica e que há um canal específico para meu perfil

### Dono / Administrador
- Como dono da loja, quero adicionar, editar e remover produtos do catálogo sem precisar chamar um desenvolvedor
- Como administrador, quero gerenciar categorias de produtos e banners da homepage para destacar promoções e novidades
- Como administrador, quero ver todos os leads recebidos e atualizar o status de cada um (novo, em atendimento, convertido, perdido)
- Como administrador, quero fazer login seguro no painel com e-mail e senha

---

## Features Principais

### 1. Homepage
- **Hero / Banner rotativo:** imagens ou slides configuráveis pelo admin com título, subtítulo e CTA. Primeiro banner deve transmitir identidade do setor (construção, solidez)
- **Seção de Categorias:** grade visual com as principais categorias de produtos (ex.: Parafusos, Segurança de Obra, Cintos, Fixações, Ferramentas) linkando para o catálogo filtrado
- **Produtos em Destaque:** grade configurável de produtos marcados como destaque pelo admin
- **Seção Technocalhas:** bloco visualmente distinto (fundo diferenciado, logo da Technocalhas, descrição curta da empresa e botão de contato/link externo) — deve ser chamativo e comunicar a relação entre as duas marcas
- **Depoimentos / Diferenciais:** seção com texto sobre os diferenciais da Technicfix (ex.: atendimento, variedade, entrega)
- **Formulário de Lead Geral:** formulário simples na homepage para captura de contato (nome, telefone, e-mail, mensagem livre)
- **CTA de WhatsApp:** botão fixo flutuante em todas as telas linkando para WhatsApp da loja

### 2. Catálogo de Produtos
- Listagem paginada de produtos com filtro por categoria e busca por nome/especificação
- Card de produto com imagem, nome, categoria e botões de ação ("Tenho interesse" para varejo / "Solicitar orçamento" para atacado)
- Página de detalhe do produto com galeria de imagens, descrição completa, especificações técnicas e os dois CTAs de lead
- URL amigável por produto e categoria (para SEO)

### 3. Formulários de Lead Segmentados
- **Lead Varejo:** nome, e-mail, telefone, produto de interesse (preenchido automaticamente quando vindo da página de produto), mensagem opcional
- **Lead Atacado:** razão social, CNPJ, nome do responsável, e-mail, telefone, produto/categoria de interesse, volume estimado, prazo desejado
- Confirmação visual após envio ("Entraremos em contato em breve")
- Dados salvos no banco e acessíveis no painel admin

### 4. Páginas Institucionais
- **Sobre nós:** história da Technicfix, missão, localização
- **Contato:** endereço, telefone, e-mail, mapa (embed Google Maps), formulário de contato
- **Technocalhas (página própria):** detalhamento da empresa irmã com serviços, contato e CTA — linkada a partir da seção da homepage

### 5. Painel Administrativo (Área Privada)
- **Login:** tela de autenticação com e-mail e senha, proteção de todas as rotas `/admin/*`
- **Dashboard:** resumo de leads recebidos (por status), produtos cadastrados, categorias ativas
- **Produtos:**
  - Listagem com busca e filtro por categoria e status (ativo/inativo)
  - Criação e edição: nome, slug, descrição, descrição técnica, preço (opcional/exibição), SKU, estoque (campo preparado, não exibido publicamente no MVP), categoria, imagens (upload múltiplo), destaque (sim/não), ativo (sim/não)
  - Exclusão com confirmação
- **Categorias:** CRUD de categorias com nome, slug e imagem representativa
- **Banners:** CRUD de banners da homepage com imagem, título, subtítulo, texto do CTA e URL de destino, e ordenação por drag-and-drop
- **Leads:**
  - Listagem de todos os leads com filtro por tipo (varejo/atacado/geral), status e data
  - Visualização do detalhe de cada lead
  - Atualização de status: Novo → Em Atendimento → Convertido / Perdido
  - Campo de anotações internas por lead
- **Configurações:** nome da loja, WhatsApp, e-mail de contato, links da Technocalhas

---

## Experiência do Usuário

### Público Varejo
O visitante chega pela homepage, vê os produtos em destaque ou navega pelas categorias. Ao encontrar o produto desejado, clica em "Tenho interesse" e um modal ou formulário inline é exibido com os dados pré-populados. Após envio, recebe confirmação e sabe que será contatado.

### Público Atacado
O comprador B2B chega pelo catálogo (possivelmente via busca Google por especificação técnica). Na página do produto, vê claramente o botão "Solicitar orçamento" ao lado do botão de varejo. Preenche o formulário com CNPJ e volume. O admin recebe o lead categorizado como "atacado" e pode priorizar o atendimento.

### Administrador
Acessa `/admin/login`, autentica com e-mail e senha. Navega pelo dashboard e gerencia produtos, categorias e banners de forma visual e intuitiva. Visualiza leads recebidos em tempo real e atualiza o status de cada atendimento.

### Identidade Visual
Design sólido, profissional, com paleta voltada ao setor de construção (tons de laranja/amarelo de alerta de obra, cinza industrial, branco). Tipografia clara e legível em mobile. A seção Technocalhas deve usar identidade própria (cor/logo da Technocalhas) contrastando visualmente com o restante da página.

---

## Não-Objetivos (fora do MVP)

- Carrinho de compras e checkout online
- Integração com gateway de pagamento
- Área do cliente (histórico de pedidos)
- Tabela de preços por perfil de cliente (atacado vs varejo)
- Calculadora de quantidade de produtos por M²
- Integração com ERP ou sistema de estoque externo
- Autenticação por OAuth (Google, Facebook)
- Multi-idioma
- Blog ou área de conteúdo editorial
- App mobile nativo

---

## Plano de Lançamento em Fases

### Fase 1 — MVP (lançamento)
- Homepage completa com todas as seções (incluindo Technocalhas)
- Catálogo de produtos com filtro e busca
- Página de detalhe de produto com formulários de lead varejo e atacado
- Páginas institucionais (Sobre, Contato, Technocalhas)
- Painel admin: autenticação, CRUD de produtos, categorias, banners e gestão de leads
- SEO básico: metadados, sitemap, robots.txt
- CTA de WhatsApp flutuante
- Responsividade mobile-first

### Fase 2 — Pós-lançamento
- Dashboard com métricas de leads (gráficos de conversão por período)
- Exportação de leads em CSV
- Integração de e-mail automático para notificar o admin ao receber lead
- Depoimentos gerenciáveis pelo admin (hoje estáticos)
- Calculadora de quantidade integrada ao produto

### Fase 3 — Evolução para E-commerce
- Carrinho e checkout
- Integração com gateway de pagamento
- Área do cliente com histórico de pedidos
- Tabela de preços por perfil (B2B / B2C)

---

## Métricas de Sucesso

| Métrica | Meta MVP |
|---|---|
| Taxa de envio de lead (visitantes que preenchem formulário) | ≥ 3% das sessões |
| Tempo de carregamento da homepage (LCP) | ≤ 3s em 4G |
| Leads de atacado recebidos nos primeiros 30 dias | ≥ 10 |
| Produtos cadastrados pelo admin sem suporte técnico | 100% feito pelo dono |
| Site funcional em mobile (sem erros de layout) | 100% das páginas |

---

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Dono não adota o painel admin por complexidade | Média | Interface admin simples, com onboarding guiado e poucos campos obrigatórios |
| Leads de atacado sem qualidade (volume irreal informado) | Média | Campo de CNPJ obrigatório filtra curiosos; admin pode marcar lead como "perdido" rapidamente |
| Site lento por imagens de produto sem otimização | Alta | Usar `next/image` com compressão automática e limitar upload a formatos modernos (WebP) |
| Confusão do visitante entre os dois CTAs (varejo vs atacado) | Baixa | Botões com texto claro e diferenciação visual (cor/ícone) |
| Seção Technocalhas competindo visualmente com a identidade da Technicfix | Baixa | Definir bloco com borda/fundo próprio e introdução textual que contextualiza a relação entre as marcas |

---

## Architecture Decision Records

| ADR | Título | Resumo |
|---|---|---|
| [ADR-001](adrs/adr-001.md) | Abordagem de Produto: Catálogo Central | Homepage com catálogo imediato; diferenciação varejo/atacado por CTAs dentro do produto |

---

## Questões em Aberto

1. **Cores e logo:** A identidade visual da Technicfix (logo, paleta oficial) precisa ser fornecida pelo dono para aplicação no site
2. **Logo da Technocalhas:** Necessário para a seção da homepage e página própria
3. **WhatsApp:** Número oficial da Technicfix para o botão flutuante e formulário de contato
4. **Endereço e horário de funcionamento:** Para a página de Contato
5. **Número inicial de produtos:** Quantos produtos o dono pretende cadastrar no lançamento? (Impacta estrutura de categorias e paginação padrão)
6. **E-mail do admin:** Endereço para receber notificações de lead (Fase 2) e para a conta inicial de acesso ao painel
