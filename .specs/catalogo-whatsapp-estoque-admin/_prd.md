# PRD — Catálogo Público orientado a WhatsApp com Controle de Estoque e Admin Enriquecido

## Visão Geral

O TechnicFix possui hoje um catálogo de produtos funcional, mas os CTAs da página de produto levam apenas a modais de formulário — sem nenhum link para WhatsApp, o canal de venda mais direto da empresa. O admin tem dashboard básico sem visibilidade de vendas ou estoque.

Este PRD define a transformação do catálogo público em um canal de conversão via WhatsApp (sem checkout) e a criação do módulo de Vendas no admin, com controle de estoque integrado e dashboard enriquecido com gráficos.

**Para quem:** visitantes varejistas e atacadistas que chegam ao catálogo; equipe interna que opera o admin.

**Por que é valioso:** WhatsApp B2B converte 15–25% contra 1,5–4% de e-commerces tradicionais no Brasil. A mudança elimina o atrito entre interesse e contato, e dá à equipe visibilidade real de vendas e estoque sem adicionar ferramentas externas.

---

## Objetivos

- Tornar o WhatsApp o canal primário de conversão da página de produto, reduzindo o número de cliques entre "ver produto" e "iniciar contato".
- Capturar leads alternativos via formulário inline (sem modal) como segundo canal de conversão.
- Dar ao admin visibilidade de vendas realizadas e estoque disponível em uma única interface enxuta.
- Eliminar a dependência de planilhas externas para controle de estoque — cada venda registrada desconta automaticamente.

**Métricas-alvo:**
- Aumento de contatos via WhatsApp mensuráveis nos primeiros 30 dias após o lançamento.
- Zero descrepância entre estoque registrado no admin e estoque físico após adoção do módulo de vendas.
- Dashboard com pelo menos 2 gráficos ativos e dados reais de vendas do mês.

---

## Histórias de Usuário

### Visitante Varejista
- Como varejista, quero ver um botão de WhatsApp destacado na página do produto para entrar em contato rapidamente sem precisar preencher formulário.
- Como varejista, quero que a mensagem do WhatsApp já venha pré-preenchida com o nome do produto para não precisar digitar nada.
- Como varejista, quero ver o preço do produto na página para decidir antes de entrar em contato.

### Visitante Atacadista
- Como atacadista, quero indicar meu perfil na página do produto para receber um CTA de orçamento em vez de compra direta.
- Como atacadista, quero preencher um formulário com meus dados de empresa para solicitar orçamento quando o WhatsApp não for conveniente.
- Como atacadista, quero ver "Sob consulta" no lugar do preço quando o produto não exibe valor público.

### Visitante (produto esgotado)
- Como visitante de produto indisponível, quero registrar meu interesse via formulário para ser avisado quando o produto voltar ao estoque.

### Comprador (qualquer perfil)
- Como visitante, quero ver produtos relacionados no final da página para descobrir itens complementares sem precisar navegar de volta ao catálogo.

### Operador do Admin
- Como operador, quero registrar uma venda informando produto e quantidade para que o estoque seja descontado automaticamente.
- Como operador, quero ver no dashboard quantas vendas foram feitas no mês e quais produtos mais saíram.
- Como operador, quero ser alertado visualmente quando o estoque de um produto estiver baixo para repor antes de zerar.
- Como operador, quero que o formulário de lead que o visitante preencheu apareça no admin e me notifique por e-mail para não perder nenhum contato.

---

## Features Principais

### F1 — CTA de WhatsApp na Página de Produto (primário)

Substitui os modais atuais por uma seção de CTA unificada.

- Seletor de perfil visível na página: "Sou varejista" / "Sou atacadista" — altera o CTA em tempo real sem recarregar a página.
- Botão WhatsApp Varejo: texto "Comprar via WhatsApp", mensagem pré-preenchida com nome do produto.
- Botão WhatsApp Atacado: texto "Pedir Orçamento via WhatsApp", mensagem pré-preenchida solicitando orçamento com nome do produto.
- O número de WhatsApp é sempre lido de `SiteConfig.whatsappNumber` — nunca fixo no código.
- Produto com `productType = varejo`: exibe só o CTA varejista por padrão; seletor oculta opção atacado.
- Produto com `productType = atacado`: exibe só o CTA atacadista por padrão; seletor oculta opção varejo.
- Produto com `productType = ambos`: exibe seletor completo; visitante escolhe o perfil.

### F2 — Exibição de Preço Configurável

- Por padrão, o produto exibe o preço cadastrado.
- Admin pode marcar o produto como "Sob consulta" — nesse caso, o preço é substituído pelo texto "Sob consulta" na página pública.
- Essa configuração é por produto, independente do tipo (varejo/atacado/ambos).

### F3 — Produto Esgotado (stock = 0)

- Página exibe badge "Indisponível" próximo ao título ou preço.
- CTAs de WhatsApp ficam desabilitados visualmente.
- Formulário de lead permanece ativo com campo de mensagem sugestivo ("Avise-me quando disponível").

### F4 — Formulário de Lead Inline (secundário)

- Seção abaixo dos CTAs de WhatsApp, expansível (não modal).
- Campos mínimos para varejo: nome, e-mail, telefone, mensagem (opcional).
- Campos adicionais para atacado (aparecem ao selecionar tipo atacado): empresa, CNPJ, volume estimado, prazo desejado — todos opcionais para não travar a conversão.
- Máximo 5 campos obrigatórios em qualquer cenário.
- Formulário multi-etapa para atacado (dados pessoais → dados da empresa) para aumentar taxa de conclusão.
- Ao enviar: lead salvo no admin + e-mail de notificação enviado para o endereço configurado em SiteConfig.

### F5 — Produtos Relacionados

- Seção ao final da página de produto com título "Produtos Relacionados".
- Exibe automaticamente produtos da mesma categoria (excluindo o produto atual).
- Admin pode fixar produtos relacionados manualmente no cadastro do produto — esses aparecem primeiro; os automáticos completam até o limite.
- Exibe entre 3 e 8 produtos em grid responsivo, reaproveitando o `ProductCard` existente.

### F6 — Módulo de Vendas no Admin

- Nova página "Vendas" acessível pelo menu lateral do admin.
- Listagem de vendas com colunas: produto, quantidade, tipo de comprador (varejo/atacado), data, notas.
- Botão "Registrar Venda" abre drawer lateral com: busca de produto por nome, quantidade vendida, tipo de comprador, notas (opcional).
- Ao confirmar: venda é registrada e `stock` do produto é decrementado automaticamente pela quantidade informada.
- Sistema bloqueia o registro se `quantity > stock atual`, exibindo mensagem de erro clara.
- Listagem de vendas tem filtro por período (últimos 7 dias, 30 dias, mês atual).

### F7 — Alerta de Estoque Baixo no Admin

- Na listagem de Produtos do admin, produtos com `stock ≤ 5` recebem destaque visual (badge ou cor) na coluna "Estoque".
- Sem tela separada de estoque — o controle fica integrado à listagem de produtos existente.

### F8 — Dashboard Enriquecido

- Mantém as 3 métricas existentes (Total Produtos, Categorias, Leads Novos).
- Adiciona métrica "Vendas este mês" (contagem de registros de venda no mês corrente).
- Gráfico de vendas por dia nos últimos 30 dias (com seletor: 7 dias / 30 dias / mês atual).
- Lista "Top 5 produtos mais vendidos" com nome do produto e quantidade total vendida, com barra de progresso relativa ao maior valor.
- Layout em grid enxuto sem poluição visual — informação densa mas legível.

---

## Experiência do Usuário

### Jornada do Visitante Varejista

1. Acessa a página de um produto via catálogo ou busca.
2. Vê preço (ou "Sob consulta"), descrição e galeria de imagens.
3. O seletor de perfil está visível com "Sou varejista" pré-selecionado.
4. Clica em "Comprar via WhatsApp" — abre WhatsApp com mensagem pré-preenchida.
5. Se preferir formulário: expande a seção "Ou envie uma mensagem", preenche nome/e-mail/telefone e envia.
6. Ao rolar a página, vê "Produtos Relacionados" e pode navegar para outros itens.

### Jornada do Visitante Atacadista

1. Acessa a página de um produto.
2. Clica em "Sou atacadista" no seletor de perfil.
3. O CTA muda para "Pedir Orçamento via WhatsApp" com mensagem de orçamento.
4. Se preferir formulário: expande a seção, seleciona tipo "atacado" — campos de empresa aparecem progressivamente.
5. Envia formulário em dois passos (dados pessoais → dados da empresa).

### Jornada do Visitante em Produto Esgotado

1. Acessa a página — vê badge "Indisponível" e CTAs de WhatsApp desabilitados.
2. Expande o formulário de lead (ainda ativo) com sugestão "Me avise quando disponível".
3. Preenche e-mail e envia — lead registrado no admin.

### Jornada do Operador Admin — Registrar Venda

1. Acessa "Vendas" no menu lateral.
2. Clica em "Registrar Venda".
3. Busca o produto pelo nome no drawer lateral.
4. Informa quantidade e tipo de comprador.
5. Confirma — sistema valida estoque, registra a venda e exibe o estoque atualizado.

### Considerações de UX

- CTA WhatsApp deve ter ícone reconhecível do WhatsApp e cor que contraste com a paleta já definida.
- Formulário inline não empurra o conteúdo principal — começa colapsado, expande ao clique.
- Drawer de registro de venda fecha ao confirmar e exibe toast de sucesso com novo saldo de estoque.
- Mobile-first em todas as telas novas.

---

## Restrições Técnicas de Alto Nível

- O número de WhatsApp deve ser sempre lido de `SiteConfig` — nunca hardcodado.
- O e-mail de notificação de lead deve ser enviado pelo servidor — nunca pelo browser.
- Nenhum gateway de pagamento, carrinho ou checkout deve ser implementado agora ou preparado para futuro.
- A identidade visual (paleta de cores, tipografia) já definida na branch `feature/redesign-visual-publico` deve ser mantida.
- Os dados de leads existentes no banco não devem ser afetados pela mudança de UI dos CTAs.

---

## Não-Objetivos (Fora de Escopo)

- **Checkout ou pagamento:** nenhuma forma de compra online — todo pedido fecha via WhatsApp ou lead.
- **Integração com WhatsApp Business API:** o link `wa.me` é suficiente; sem chatbot, sem fluxo automatizado.
- **Portal do cliente:** atacadistas não têm login ou área restrita.
- **Tabela de preços por cliente:** preço é único por produto; desconto é negociado via WhatsApp.
- **Notificação automática ao cliente quando produto volta ao estoque:** lead fica salvo, mas disparo automático de e-mail para o visitante fica fora deste PRD.
- **Relatórios exportáveis (PDF/CSV):** visibilidade via dashboard é suficiente para este PRD.
- **Multi-usuário no admin:** um único acesso de admin, sem permissões por papel.

---

## Plano de Lançamento em Fases

### MVP (Fase 1) — Canal WhatsApp + Formulário Inline

- F1: CTA de WhatsApp na página de produto com seletor de perfil
- F2: Exibição de preço configurável (preço vs. "Sob consulta")
- F3: Comportamento de produto esgotado
- F4: Formulário de lead inline substituindo os modais atuais

**Critério para avançar:** pelo menos um contato via WhatsApp registrado nos primeiros 7 dias; formulário de lead funcionando sem regressão.

### Fase 2 — Relacionados + Módulo de Vendas

- F5: Produtos relacionados na página de produto
- F6: Módulo de Vendas no admin (registro manual + desconto de estoque)
- F7: Alerta de estoque baixo na listagem de produtos

**Critério para avançar:** pelo menos 3 vendas registradas manualmente; sem divergência entre estoque admin e físico.

### Fase 3 — Dashboard Enriquecido

- F8: Dashboard com gráficos de vendas e ranking de produtos

**Critério de sucesso de longo prazo:** equipe consulta o dashboard semanalmente como fonte primária de visibilidade de vendas; sem uso de planilha paralela.

---

## Métricas de Sucesso

- **Conversão via WhatsApp:** número de cliques no botão WhatsApp por semana (medido via evento de analytics ou log de WhatsApp).
- **Leads capturados:** contagem de leads com origem no formulário inline vs. meta anterior com modais.
- **Acurácia de estoque:** zero divergências entre `Product.stock` e estoque físico após 30 dias de uso do módulo de vendas.
- **Engajamento com produtos relacionados:** taxa de clique nos produtos relacionados (pelo menos 10% dos visitantes da página de produto).
- **Uso do dashboard:** equipe abre o dashboard pelo menos 3x por semana.

---

## Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Visitantes não entendem o seletor varejista/atacadista | Testar copy e posicionamento do seletor antes do lançamento; usar labels claros e ícones |
| Equipe não adota o módulo de vendas e continua na planilha | Treinamento simples + mostrar que o dashboard fica vazio sem registros — incentivo visual |
| Formulário inline reduz a conversão vs. modal (mudança de padrão) | Monitorar leads nos primeiros 14 dias; ter o formulário modal como fallback no código se necessário |
| Estoque negativo por erro de registro de venda | Bloquear registro quando quantity > stock; exibir saldo atual no drawer de venda |
| Número de WhatsApp não configurado em SiteConfig | Exibir aviso no admin quando `whatsappNumber` estiver vazio; não renderizar botão WhatsApp sem número |

---

## Architecture Decision Records

- [ADR-001: Redesign dos CTAs com Admin Integrado](adrs/adr-001.md) — Substituir modais de lead por CTA unificado WhatsApp + form inline; stock alert integrado em Produtos; módulo Vendas como página própria; dashboard com gráficos substituindo métricas estáticas.

---

## Questões em Aberto

- **Biblioteca de gráficos:** nenhuma dependência de gráficos existe hoje no projeto. A escolha da biblioteca fica para o TechSpec.
- **E-mail de notificação de lead:** o provider de e-mail (SMTP, Resend, SendGrid etc.) ainda não está definido — precisa ser configurado no ambiente antes da Fase 1.
- **Ordem padrão do seletor varejista/atacadista:** deve o seletor iniciar em "varejista" (padrão) ou sem seleção (usuário escolhe)? Sugestão: iniciar em varejista para produtos tipo `varejo` ou `ambos`.
- **Limite de relacionados automáticos vs. manuais:** se o admin fixar 8 manualmente, os automáticos não aparecem. Confirmar se isso é o comportamento esperado.
