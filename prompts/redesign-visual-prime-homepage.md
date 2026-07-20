<task>
Redesign Visual Prime da Homepage
</task>

<goal>
Elevar a aparência da homepage do technicfix-website para um nível premium e profissional, inspirado em lojas de ferramentas de referência (ToolShop, Jofepar), sem quebrar a identidade de marca existente (navy + amber). O resultado deve transmitir credibilidade e confiança ao visitante logo no primeiro acesso, aumentando a percepção de valor da loja e incentivando a conversão.
</goal>

<requirements>
Negocio:
- Tornar a homepage visualmente mais premium sem alterar a estrutura de dados ou rotas existentes.
- Manter todos os componentes da homepage: Hero, DiferenciaisSection, CategoryGrid, FeaturedProducts, TechnocalhasSection, TestimonialsSection, LeadGeneralForm.
- Não remover nem adicionar seções — apenas redesenhar o visual de cada uma.

Arquitetura:
- Escopo exclusivo de frontend: componentes em `components/home/` e estilos em `app/globals.css`.
- A lógica de dados em `app/(public)/page.tsx` não deve ser alterada.
- Usar apenas os tokens de design já definidos em `globals.css` (`--brand-navy`, `--brand-amber`, etc.), refinando seus valores se necessário para maior contraste e impacto.
- Não introduzir novas dependências de biblioteca para o redesign visual.

UI/UX:
- **Paleta:** Manter navy (#0D1B3E) + amber (#F5A623) como identidade, porém com mais contraste, saturação e uso intencional de espaço negativo para aparência sofisticada.
- **Tipografia:** Aumentar peso e tamanho dos headings principais (bold/extrabold). Usar hierarquia clara: headline > subheadline > corpo. Letras maiúsculas com letter-spacing em labels de categoria e badges.
- **Hero Section:** Refinar overlay dos banners do BD com gradiente navy mais definido. Melhorar tipografia e posicionamento do headline. Adicionar badge/pill de destaque ("Frete Grátis", "Qualidade Premium") e CTA com hover de impacto em amber.
- **CategoryGrid:** Cards com borda sutil, hover com elevação (shadow + scale leve) e ícone/imagem com fundo navy-light. Label em uppercase com letter-spacing.
- **FeaturedProducts:** Cards com sombra profissional, badge de destaque em amber para produtos em foco. Preço com tipografia bold e destaque de cor. Botão de ação com estilo consistente ao CTA da hero.
- **DiferenciaisSection:** Ícones maiores, background alternado (navy ou off-white) para contraste com o restante da página. Texto mais conciso e impactante.
- **TestimonialsSection:** Cards com borda esquerda em amber, avatar, nome e estrelas visíveis. Fundo levemente diferenciado do branco puro.
- **LeadGeneralForm:** Seção com fundo navy escuro, texto branco e CTA em amber — padrão "dark band" de conversão usado em e-commerces premium.
- Layout responsivo mantido: mobile-first, sem quebras em telas < 375px.
- Aplicar espaçamento generoso entre seções (section padding maior) para respiração visual.
</requirements>

<acceptance_criteria>
- Dado que o visitante acessa a homepage, quando a página carrega, então o Hero exibe o banner com overlay navy, headline bold e CTA em amber visivelmente destacado.
- Dado que o Hero contém banners cadastrados no BD, quando esses banners são exibidos, então o layout ao redor (tipografia, badges, CTA) segue o novo padrão visual sem alterar a lógica de busca dos dados.
- Dado que a CategoryGrid é renderizada, quando o usuário passa o mouse em um card, então o card exibe elevação (shadow + scale) e a label está em uppercase com letter-spacing.
- Dado que os FeaturedProducts são exibidos, quando um produto tem `featured: true`, então o card exibe badge amber de destaque e o preço está em tipografia bold com cor de destaque.
- Dado que a DiferenciaisSection é renderizada, quando visualizada em desktop, então usa fundo alternado (navy ou off-white) com ícones maiores e texto impactante.
- Dado que a TestimonialsSection é renderizada, então cada card exibe borda esquerda em amber, avatar, nome e avaliação por estrelas.
- Dado que a LeadGeneralForm é renderizada, então a seção usa fundo navy escuro com texto branco e botão de ação em amber.
- Dado qualquer viewport >= 375px, quando a página é carregada, então nenhuma seção apresenta quebra de layout, overflow horizontal ou elementos sobrepostos.
- Dado que o redesign é aplicado, quando comparado ao estado anterior, então os tokens `--brand-navy`, `--brand-amber` continuam sendo a única fonte de cores de marca no CSS (sem hardcode de hex fora do `:root`).
</acceptance_criteria>

<constraints>
- FAÇA: usar exclusivamente os tokens CSS de marca já definidos em `globals.css`; ajustar os valores em `:root` se precisar de mais contraste.
- FAÇA: manter todos os componentes e a ordem das seções na homepage exatamente como estão em `page.tsx`.
- FAÇA: aplicar estilo mobile-first e garantir responsividade em todas as seções.
- NÃO FAÇA: alterar `app/(public)/page.tsx` nem a lógica de fetch de dados.
- NÃO FAÇA: adicionar novas bibliotecas de UI ou CSS apenas para o redesign.
- NÃO FAÇA: remover, renomear ou reordenar seções da homepage.
- NUNCA: usar valores hex ou rgb hardcoded fora das variáveis `:root` em `globals.css`.
- NUNCA: alterar o schema do banco de dados, models Prisma ou actions do servidor.
</constraints>
