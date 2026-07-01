<task>
Redesign visual das páginas públicas — TechnicFix
</task>

<goal>
Reformular a identidade visual de todas as páginas públicas do site da TechnicFix (parafusos e fixadores) para que o layout seja marcante, moderno e fiel à marca: azul marinho escuro, amarelo/âmbar de destaque, tipografia bold e estética industrial. O site deve prender a atenção do visitante imediatamente, transmitir credibilidade e direcioná-lo a entrar em contato via WhatsApp como ação principal.
</goal>

<requirements>
Negocio:
- Aplicar a identidade visual oficial da TechnicFix em todas as páginas públicas: home (`/`), categorias (`/categorias/[slug]`), contato (`/contato`), listagem de produtos (`/produtos`), detalhe de produto (`/produtos/[slug]`), sobre (`/sobre`) e technocalhas (`/technocalhas`).
- A ação principal (CTA) em todas as páginas deve ser o contato via WhatsApp — botão fixo ou em destaque em todos os pontos de conversão.
- O slogan "Fixação que não Falha" e o subtítulo "Parafusos e Fixadores" devem aparecer de forma proeminente nas áreas de alto impacto (hero, banners, rodapé).
- Manter as seções essenciais existentes (hero, listagem de produtos/categorias, sobre, contato), com liberdade para enriquecer seções, adicionar blocos de destaque, banners ou indicadores de confiança.

Arquitetura:
- A mudança é exclusivamente de frontend (componentes React/Next.js dentro de `app/(public)/` e seus componentes compartilhados).
- Criar ou atualizar tokens de design (cores, fontes, sombras) no Tailwind ou CSS global para refletir a nova identidade — evitar valores hardcoded espalhados.
- Layout responsivo com abordagem mobile-first em todas as páginas.

UI/UX:
- **Paleta de cores:** azul marinho escuro como fundo/base (`#0D1B3E` ou similar), amarelo/âmbar como cor de destaque e CTA (`#F5A623` ou similar), branco para textos e elementos sobre fundo escuro.
- **Tipografia:** fonte bold, grande hierarquia visual; títulos com peso extra-bold para impacto.
- **Hero (homepage):** seção de tela cheia com fundo azul marinho, título grande em branco e âmbar, botão WhatsApp em destaque e elementos gráficos industriais (engrenagem, parafusos) ou foto real de produto como pano de fundo com overlay escuro.
- **Botão WhatsApp:** fixo no canto inferior da tela em todas as páginas, com ícone do WhatsApp e cor verde contrastando sobre o azul marinho; adicionalmente como CTA primário em seções de conversão.
- **Mix de assets visuais:** fotos reais de produtos em cards de categorias e destaque de produtos; elementos gráficos vetoriais (ícones de parafusos, engrenagens, texturas metálicas) em banners, hero e seções de fundo escuro.
- **Seção de diferenciais/confiança:** bloco com ícones industriais destacando pontos como variedade de estoque, entrega rápida, atendimento especializado.
- **Páginas de produto e categoria:** cards com fundo branco/cinza claro, borda ou detalhe em âmbar, foto do produto proeminente, nome e botão de ação em destaque.
- **Página de contato:** formulário limpo sobre fundo azul marinho ou branco com botão WhatsApp como alternativa direta.
- **Rodapé:** fundo azul marinho muito escuro, logo TechnicFix, slogan, links de navegação e ícone/link WhatsApp.
- **Navbar:** fundo azul marinho, logo à esquerda, navegação em branco, botão CTA "Fale pelo WhatsApp" em âmbar.
- Garantir acessibilidade básica: contraste adequado, foco visível em elementos interativos, textos alternativos em imagens.
- Exibir estados de carregamento e estado vazio nas listagens de produtos e categorias.
</requirements>

<acceptance_criteria>
- Dado que o visitante acessa qualquer página pública, quando a página carregar, então a paleta azul marinho + amarelo/âmbar deve ser a identidade dominante, coerente entre todas as páginas.
- Dado que o visitante está em qualquer página pública, quando rolar a página, então o botão flutuante do WhatsApp deve permanecer visível e acessível.
- Dado que o visitante está na homepage, quando visualizar o hero, então deve ver o slogan "Fixação que não Falha" em destaque, com CTA WhatsApp proeminente.
- Dado que o visitante acessa a listagem de produtos ou categorias, quando a página carregar, então os cards devem exibir foto do produto (quando disponível) com detalhe em âmbar e botão de ação visível.
- Dado que o visitante acessa a página de contato, quando visualizar a seção principal, então deve encontrar o botão WhatsApp como ação primária de contato.
- Dado que o visitante acessa o site em dispositivo móvel, quando a página carregar, então o layout deve ser responsivo e a experiência mobile-first deve ser preservada sem quebras visuais.
- Dado que o visitante acessa qualquer página, quando visualizar a navbar e o rodapé, então a marca TechnicFix (logo + slogan) deve estar presente com identidade visual consistente.
- Dado que uma seção usa foto real de produto, quando o asset não estiver disponível, então um placeholder com elemento gráfico industrial (ícone/engrenagem) deve ser exibido sem quebrar o layout.
</acceptance_criteria>

<constraints>
- FAÇA: centralizar os tokens de design (cores, fontes, espaçamentos) em um único lugar (Tailwind config ou CSS custom properties) antes de aplicar nas páginas.
- FAÇA: usar a paleta oficial — azul marinho escuro como base, amarelo/âmbar como destaque, branco para texto sobre escuro.
- FAÇA: manter o botão WhatsApp fixo e visível em todas as páginas públicas.
- FAÇA: aplicar o redesign em todas as 7 páginas públicas: `/`, `/categorias/[slug]`, `/contato`, `/produtos`, `/produtos/[slug]`, `/sobre`, `/technocalhas`.
- FAÇA: preservar a estrutura de rotas e o funcionamento das funcionalidades existentes (catálogo, filtros, formulário de contato).
- FAÇA: garantir responsividade mobile-first em todos os componentes alterados ou criados.
- NÃO FAÇA: alterar rotas, lógica de backend, APIs ou área administrativa.
- NÃO FAÇA: remover seções essenciais existentes — enriquecer, não substituir destrutivamente.
- NUNCA: usar o nome "TechnoFix" — o nome correto da marca é sempre "TechnicFix".
- NUNCA: hardcodar valores de cor fora dos tokens de design centralizados.
</constraints>
