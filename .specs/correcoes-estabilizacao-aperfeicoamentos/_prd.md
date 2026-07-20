# PRD — Correções, Estabilização e Aperfeiçoamentos do Technicfix

## Visão Geral

O Technicfix é um e-commerce B2B/B2C de fixadores e ferramentas industriais. Este PRD consolida 13 itens identificados em auditoria técnica que, juntos, elevam a confiabilidade operacional, a qualidade da base de código e a capacidade de geração de tráfego orgânico da plataforma.

Os itens cobrem três dimensões:

- **Confiabilidade**: o sistema deve falhar ruidosamente quando mal configurado e garantir que notificações críticas de negócio (novos leads) cheguem ao destino.
- **Qualidade de código**: eliminar débito acumulado que aumenta o custo de manutenção e o risco de regressões.
- **Experiência e SEO**: features que aumentam a capacidade de descoberta do catálogo (filtro de preço, landing pages de categoria, carrossel de relacionados) e a visibilidade orgânica (auditoria de sitemap, dashboard de inteligência de leads).

Os beneficiários diretos são dois: **visitantes do catálogo público** (clientes varejo e compradores atacado) e **administradores da plataforma** (equipe Technicfix que gerencia produtos, leads e vendas).

---

## Objetivos

1. **Zero falhas silenciosas de configuração** — qualquer variável de ambiente ausente deve impedir a inicialização do servidor com mensagem descritiva, antes de qualquer requisição ser aceita.
2. **Taxa de entrega de email de lead ≥ 99%** — com retry automático, a notificação de novo lead deve chegar ao admin mesmo que a primeira tentativa ao Resend falhe.
3. **Admin funcional em mobile** — nenhuma coluna de tabela deve ser cortada em telas com largura < 768px nas páginas de gestão de produtos e categorias.
4. **Carrossel de relacionados presente em 100% das páginas de produto** que possuam ao menos 3 produtos relacionados ou da mesma categoria.
5. **Landing pages de categoria indexáveis** — cada categoria deve ter URL própria com conteúdo renderizado, substituindo o redirect atual.
6. **Filtro de preço ativo no catálogo** — visitantes conseguem restringir resultados por faixa de preço sem recarregar a página manualmente.
7. **Sitemap correto e atualizado** — apenas produtos com `status=ativo` aparecem no sitemap; `lastModified` reflete a data real de atualização do banco.
8. **Dashboard de leads útil** — administrador vê volume, composição por tipo e taxa de conversão de leads nos últimos 30 dias em uma única seção.

---

## Histórias de Usuário

### Persona: Administrador da Plataforma (equipe Technicfix)

- Como administrador, quero que o sistema me avise claramente quando uma variável de ambiente estiver faltando ao iniciar o servidor, para que eu identifique erros de configuração antes de a aplicação aceitar tráfego.
- Como administrador, quero receber o email de notificação de novo lead mesmo que o primeiro envio falhe, para não perder oportunidades de negócio por falhas transitórias.
- Como administrador, quero visualizar a lista de produtos em celular e tablet sem precisar fazer scroll horizontal cego, para acompanhar o estoque em campo.
- Como administrador, quero ver no dashboard quantos leads foram gerados por dia, separados por tipo (varejo/atacado), e quantos converteram nos últimos 30 dias, para tomar decisões sobre ações de marketing e prospecção.
- Como administrador, quero que o risco da versão beta do NextAuth esteja documentado com critérios claros de quando agir, para não ser pego de surpresa por uma breaking change.

### Persona: Visitante do Catálogo (cliente varejo e comprador atacado)

- Como visitante, quero filtrar produtos por faixa de preço usando um controle deslizante, para encontrar opções dentro do meu orçamento sem analisar cada item individualmente.
- Como visitante, quero ver produtos relacionados em um carrossel horizontal na página de produto, para descobrir itens complementares sem voltar ao catálogo.
- Como visitante, quero acessar a URL de uma categoria (ex.: `/categorias/parafusos`) e ver uma página com informações da categoria e seus produtos, para compartilhar e salvar links de categorias específicas.

### Persona: Mecanismo de Busca (SEO)

- Como Googlebot, quero acessar um sitemap que liste apenas produtos ativos com data de modificação real, para priorizar o crawl de páginas relevantes e atuais.
- Como Googlebot, quero encontrar conteúdo real na URL de cada categoria, para indexar aquelas páginas como landing pages com autoridade sobre os produtos daquela categoria.

---

## Features Principais

As features estão organizadas na sequência de implementação definida na ADR-001: Confiabilidade → Qualidade de código → Features novas.

---

### Grupo 1 — Confiabilidade

#### F1: Validação centralizada de variáveis de ambiente

O sistema valida todas as variáveis de ambiente críticas no momento de inicialização do servidor. Se qualquer variável obrigatória estiver ausente ou com valor inválido, o servidor encerra com mensagem de erro que identifica exatamente qual variável está faltando e qual valor é esperado. Nenhuma requisição HTTP é aceita enquanto a configuração estiver incompleta.

Todas as partes do código que hoje acessam `process.env.*` diretamente passam a importar as variáveis do módulo de configuração centralizado, que é o único ponto onde o ambiente é lido e validado.

#### F2: Retry automático de notificação de lead por email

Quando a notificação de novo lead falha ao ser enviada pelo Resend, o sistema tenta o reenvio automaticamente até 3 vezes, com intervalos que dobram a cada tentativa (backoff exponencial). O comportamento de retry ocorre de forma assíncrona, sem atrasar ou bloquear a resposta de confirmação ao visitante que preencheu o formulário. Somente após esgotar as 3 tentativas o erro é registrado em log estruturado para análise posterior. O lead permanece salvo no banco independentemente do resultado do envio de email.

#### F3: Documentação de risco do NextAuth beta

Um arquivo de registro de decisão arquitetural (ADR) é criado no repositório documentando: a versão atual do NextAuth em uso (`5.0.0-beta.31`), os riscos identificados de uso em produção de uma versão beta, e os critérios objetivos que devem ser atendidos para executar o upgrade quando a versão estável for publicada.

---

### Grupo 2 — Qualidade de código

#### F4: Remoção de código morto comentado

Dois blocos de código comentado são removidos definitivamente:
- Navegação de categorias (`CategoryNav`) no menu mobile do `Header.tsx`
- Item de benefício "Frete para Todo o Brasil" no `BenefitsBar.tsx`

Nenhuma funcionalidade é alterada; o código comentado não estava sendo utilizado.

#### F5: Centralização do tipo `ProductWithCategory`

O tipo `ProductWithCategory`, hoje definido localmente em `app/(public)/produtos/page.tsx`, é movido para `lib/types.ts`. Todos os arquivos que precisarem desse tipo importam de `lib/types.ts`. Isso elimina a duplicação e o risco de divergência entre definições.

#### F6: Substituição de inline style no Hero

A declaração `style={{ height: '650px' }}` no componente `Hero.tsx` é substituída por classe Tailwind equivalente. O comportamento visual permanece idêntico; apenas a forma de expressão do estilo muda.

#### F7: Scroll horizontal nas tabelas admin

As tabelas das páginas `/admin/produtos` e `/admin/categorias` ganham scroll horizontal em telas pequenas. Em dispositivos mobile e tablet, todas as colunas permanecem acessíveis através de gesto de scroll horizontal, sem que nenhuma coluna seja cortada ou ocultada.

---

### Grupo 3 — Features novas

#### F8: Carrossel de produtos relacionados na página de produto

A página de cada produto exibe uma seção "Produtos Relacionados" com um carrossel de scroll horizontal contendo até 6 produtos. Cada card no carrossel mostra imagem, nome, preço (ou "Sob consulta") e botão de interesse. A seção só aparece quando há ao menos 3 produtos disponíveis (relacionados manualmente ou da mesma categoria). O componente de card reutiliza o `ProductCard` existente.

#### F9: Landing page dedicada por categoria

Cada categoria passa a ter uma página própria em `/categorias/[slug]` com:
- Cabeçalho com o nome da categoria e imagem (quando cadastrada)
- Grid de produtos daquela categoria com paginação
- Os mesmos filtros de busca disponíveis na página `/produtos`

A URL de categoria deixa de redirecionar e passa a renderizar conteúdo indexável. Uma tag canonical é incluída para preservar o valor de SEO acumulado no padrão `/produtos?categoria=[slug]` durante o período de transição.

#### F10: Filtro de preço por slider no catálogo

A sidebar da página `/produtos` ganha um controle de faixa de preço com dois handles deslizantes (mínimo e máximo). Os valores selecionados são exibidos em tempo real formatados em BRL. Ao soltar qualquer um dos handles, o catálogo é atualizado exibindo apenas produtos com preço dentro da faixa. O filtro é compatível com os filtros de categoria e busca já existentes e respeita produtos com "preço sob consulta" (exibidos separadamente ou no final da listagem).

#### F11: Auditoria e correção do sitemap

O sitemap dinâmico existente (`app/sitemap.ts`) é revisado para garantir:
- Apenas produtos com `status=ativo` são incluídos
- O campo `lastModified` usa a data real de `updatedAt` do banco de dados, não uma data estática
- O intervalo de revalidação (atualmente 3600s) é adequado ao ritmo de atualização do catálogo

#### F12: Seção de análise de leads no dashboard admin

Uma nova seção "Análise de Leads" é adicionada abaixo dos gráficos de vendas existentes no dashboard admin, com três visualizações:

1. **Volume ao longo do tempo**: gráfico de linha com total de leads por dia nos últimos 30 dias — identifica picos e quedas de interesse.
2. **Composição por tipo**: gráfico de barras empilhadas mostrando quantos leads varejo vs. atacado foram gerados por período — guia alocação de esforço comercial.
3. **Funil de conversão**: barras horizontais mostrando quantos leads passaram por cada status (Novo → Em atendimento → Convertido / Perdido) — mede eficácia do processo comercial.

---

## Experiência do Usuário

### Administrador — configuração e inicialização

Quando o servidor sobe com configuração incompleta, o administrador recebe no terminal ou log de deploy uma mensagem clara como: `[Technicfix] Variável de ambiente ausente: RESEND_API_KEY. Defina esta variável antes de iniciar o servidor.` O servidor não aceita tráfego até a configuração estar correta.

### Administrador — gestão em mobile

Em celular, as tabelas de produtos e categorias são envolvidas por uma área com scroll horizontal. O administrador faz gesto de deslize lateral para ver colunas como SKU, Estoque, Status e Ações. Nenhuma coluna é cortada ou oculta por padrão.

### Administrador — dashboard de leads

Abaixo dos gráficos de vendas existentes, aparece uma seção "Análise de Leads" com três cards de gráfico lado a lado (ou empilhados em mobile). O período padrão é os últimos 30 dias. O administrador lê rapidamente: quantos leads recebeu por dia, de que tipo, e quantos converteram.

### Visitante do catálogo — filtro de preço

Na sidebar de `/produtos`, abaixo do filtro de categorias, aparece um controle de faixa de preço. O visitante arrasta os dois handles para definir mínimo e máximo. Os valores aparecem como `R$ 25,00 — R$ 350,00` em tempo real. Ao soltar o handle, a lista de produtos atualiza automaticamente. O estado do filtro é preservado na URL para que o visitante possa compartilhar ou voltar ao resultado.

### Visitante — página de produto

Ao rolar a página de um produto até a seção de detalhes técnicos, o visitante encontra um carrossel intitulado "Produtos Relacionados". Cards de produtos deslizam horizontalmente ao toque ou clique nas setas. Cada card mostra imagem, nome, preço e botão "Tenho interesse".

### Visitante — landing page de categoria

Ao acessar `/categorias/parafusos`, o visitante vê um cabeçalho com o nome e imagem da categoria (se cadastrada), seguido de um grid de produtos com campo de busca e paginação — sem ser redirecionado para outra URL. A URL permanece `/categorias/parafusos`, tornando-a compartilhável e indexável.

---

## Restrições Técnicas de Alto Nível

- A validação de variáveis de ambiente deve ocorrer antes de qualquer conexão com banco de dados ou serviço externo ser estabelecida.
- O retry do Resend não deve introduzir latência perceptível na resposta ao visitante que preencheu o formulário de lead — a operação de reenvio é assíncrona.
- O filtro de preço deve preservar o estado na URL (via `searchParams`) para suportar compartilhamento e navegação com botão voltar do navegador.
- A landing page de categoria deve incluir tag canonical apontando para `/produtos?categoria=[slug]` enquanto ambas as URLs coexistirem.
- As variáveis de ambiente do lado servidor (tokens, API keys, secrets) nunca devem ser expostas em componentes client-side.
- O sitemap deve respeitar o limite de 50.000 URLs por arquivo; se o catálogo ultrapassar esse volume, deve ser fatiado automaticamente.

---

## Não-Objetivos (Fora de Escopo)

- **Upgrade do NextAuth para v5 stable**: documentar o risco está no escopo; executar o upgrade não está.
- **Fila de email persistente**: o retry de 3 tentativas é suficiente; construir infraestrutura de fila (ex.: tabela de jobs no banco) não está no escopo deste PRD.
- **Alteração do schema do Prisma**: nenhuma migração de banco de dados é necessária para nenhum dos 13 itens.
- **Redesign visual**: nenhum item altera o design system, paleta ou tipografia da plataforma.
- **Internacionalização (i18n)**: não está no escopo.
- **Avaliações e comentários de produto**: feature de "Clientes também compraram" baseada em comportamento de compra não está no escopo; os relacionados são definidos manualmente pelo admin.
- **Novo sistema de analytics**: o dashboard usa Recharts já instalado; não há integração com ferramentas externas de analytics neste PRD.
- **Versão progressiva do sitemap (generateSitemaps)**: auditoria e correção do sitemap existente estão no escopo; reescrever a infraestrutura de sitemap para suportar > 50k URLs não está, a menos que o catálogo atinja esse volume.

---

## Plano de Lançamento em Fases

### Fase 1 — Confiabilidade (prioridade máxima)

**Itens**: F1 (env vars), F2 (retry Resend), F3 (ADR NextAuth)

**Critérios para avançar à Fase 2:**
- Servidor não sobe se qualquer env var crítica estiver ausente, com mensagem descritiva no log
- Testes manuais confirmam que email de lead é enviado com retry em caso de falha do Resend
- Arquivo `docs/adr/001-nextauth-beta.md` existe e está acessível no repositório

### Fase 2 — Qualidade de código

**Itens**: F4 (dead code), F5 (tipos), F6 (inline style), F7 (tabelas mobile)

**Critérios para avançar à Fase 3:**
- `Header.tsx` e `BenefitsBar.tsx` sem blocos comentados
- `ProductWithCategory` importado de `lib/types.ts` em todos os arquivos
- Hero sem `style=` inline
- Tabelas de produtos e categorias com scroll horizontal verificado em viewport 375px

### Fase 3 — Features novas

**Itens**: F8 (carrossel), F9 (landing de categoria), F10 (filtro de preço), F11 (sitemap audit), F12 (dashboard de leads)

**Critérios de conclusão:**
- Carrossel presente em página de produto com ≥ 3 relacionados/categoria
- `/categorias/[slug]` renderiza conteúdo sem redirect; canonical tag presente
- Filtro de preço funciona combinado com filtros de categoria e busca; estado preservado na URL
- Sitemap contém apenas produtos `status=ativo`; `lastModified` dinâmico
- Dashboard exibe 3 gráficos de leads com dados reais dos últimos 30 dias

---

## Métricas de Sucesso

| Métrica | Situação Atual | Meta |
|---|---|---|
| Erros de config detectados em boot | Nunca (falha em runtime) | 100% detectados antes de aceitar tráfego |
| Taxa de entrega de email de lead | Desconhecida (falha silenciosa) | ≥ 99% (confirmado por log de retry) |
| Colunas cortadas em tabelas admin em mobile | Ocorre em telas < 768px | Zero colunas cortadas em 375px |
| Produtos com preço filtráveis por faixa | 0% | 100% dos produtos com preço |
| URLs de categoria com conteúdo indexável | 0 (todas redirecionam) | 100% das categorias com landing page |
| Produtos no sitemap com `lastModified` real | Desconhecido | 100% |
| Visibilidade de leads por período no dashboard | Nenhuma | 3 visualizações disponíveis |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Filtro de preço em slider pode não funcionar bem em touch em mobile | Média | Médio | Testar em dispositivos reais iOS e Android antes de lançar; fallback com inputs numéricos se o slider travar |
| Landing page de categoria duplicar conteúdo com `/produtos?categoria=` e prejudicar SEO | Baixa | Alto | Canonical tag obrigatória na landing page apontando para a URL canônica estabelecida |
| Retry do Resend pode gerar emails duplicados em cenários de falha parcial | Baixa | Médio | Verificar se o Resend retorna erro claro em falhas transientes vs. entrega confirmada; não retentar em status 2xx |
| ADR do NextAuth pode ser ignorado quando a versão stable sair | Alta | Baixo | Adicionar verificação de versão como item de checklist de deploy ou revisão semestral |
| Scope creep de itens novos descobertos durante a implementação | Média | Médio | Qualquer item novo vai para Questões em Aberto e é avaliado no próximo ciclo |

---

## Architecture Decision Records

- [ADR-001: Estrutura de entrega como PRD único com prioridade interna](adrs/adr-001.md) — PRD único com três grupos sequenciais (Confiabilidade → Qualidade → Features) em vez de dois PRDs separados ou releases versionados.

---

## Questões em Aberto

1. **Componente de slider de preço**: verificar se Radix UI ou shadcn/ui (já instalados no projeto) proveem um componente `Slider` antes de adicionar dependência externa — a decisão de implementação fica para o TechSpec.
2. **Imagem de categoria na landing page**: o schema atual tem campo `imageUrl` na tabela `Category`, mas não há interface admin para cadastrá-lo. A landing page deve exibir placeholder quando não houver imagem, ou a interface admin de categorias deve ser expandida? A definir antes da implementação de F9.
3. **Período do filtro de leads no dashboard**: os 3 gráficos de leads foram definidos com janela de 30 dias. Um seletor de período (7d, 30d, 90d) agrega valor sem complexidade excessiva? A avaliar durante o TechSpec.
4. **Canonical da landing de categoria**: definir se a canonical aponta para `/produtos?categoria=[slug]` ou se `/categorias/[slug]` passa a ser a URL canônica e `/produtos?categoria=[slug]` recebe a canonical reversa — decisão afeta SEO de longo prazo.
