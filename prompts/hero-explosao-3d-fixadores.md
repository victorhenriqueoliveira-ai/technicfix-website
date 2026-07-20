<task>
Hero Explosão 3D — Parafusos e Fixadores
</task>

<goal>
Redesenhar a seção hero do site TechnicFix com uma experiência visual inédita: uma vista explodida animada de parafusos, porcas, buchas e âncoras que explode na entrada da página e se remonta em loop, transmitindo precisão, força e a identidade industrial da marca. O objetivo é transformar o primeiro contato do visitante em um momento memorável, diferenciando o site de concorrentes com layout genérico.
</goal>

<requirements>
Negocio:
- Substituir o carousel estático atual por uma hero de tela cheia com animação de explosão 3D dos produtos principais da TechnicFix (parafusos, porcas, buchas, âncoras, fixadores).
- Manter o CTA primário de WhatsApp e o CTA secundário "Ver Produtos" com visibilidade garantida sobre a animação.
- Preservar o badge da marca ("TechnicFix — Parafusos e Fixadores") e a linha de headline, que podem ser editadas via admin (título e subtítulo dinâmicos pelo BannerData existente).
- A nova hero deve continuar compatível com a interface BannerData já existente no componente.

Arquitetura:
- Implementar a hero como componente React Client Component (`'use client'`) dentro de `components/home/Hero.tsx`, substituindo a implementação atual.
- A animação deve ser pura CSS + SVG (sem biblioteca de animação externa obrigatória); se necessário usar Framer Motion, confirmar com o responsável antes de adicionar dependência.
- Os SVGs dos fixadores (parafuso, porca, bucha, âncora, arruela) devem ser desenhados inline como elementos `<svg>` estilizados, posicionados via CSS absolutamente dentro da cena hero.
- A lógica de explosão/remontagem deve usar `@keyframes` CSS ou a Web Animations API — carrega na montagem do componente e entra em loop contínuo após a primeira montagem.
- Manter suporte ao fallback BannerData: se não houver banners, usar o FALLBACK_BANNER com headline padrão.

UI/UX:
- Fundo: gradiente escuro `from-brand-navy via-brand-navy to-brand-navy-dark` como base; profundidade criada por camadas de opacidade.
- Cena 3D: peças (SVGs de parafusos, porcas, âncoras, buchas) iniciam centralizadas sobrepostas, explodem para fora em trajetórias radiais diferentes na entrada da página, depois gravitam de volta ao centro se encaixando numa composição final estática/levemente animada em loop.
- Iluminação focal: adicionar um radial gradient de `brand-amber/20` ao centro da cena para simular foco de luz sobre as peças.
- Texto e CTAs flutuam acima da cena (`z-10`) com fundo semitransparente ou text-shadow para garantir legibilidade.
- Badge da marca e headline mantém o padrão atual (text-brand-amber para destaque).
- Faixa amber `h-1` na base da hero, preservando o detalhe visual atual.
- Layout responsivo: em mobile as peças animadas são reduzidas ou simplificadas para não poluir a leitura do texto.
- Acessibilidade: toda a cena animada deve ter `aria-hidden="true"` e `prefers-reduced-motion` deve desativar a explosão (mostrar estado final estático).
</requirements>

<acceptance_criteria>
- Dado que o usuário acessa a página inicial, quando a hero carregar, então as peças (SVGs de fixadores) devem partir do centro e explodir radialmente para fora, depois retornar se montando, em loop.
- Dado que a animação completou a primeira remontagem, quando o loop recomeçar, então a transição entre o estado montado e a nova explosão deve ser suave e contínua, sem salto visual.
- Dado que o usuário usa `prefers-reduced-motion`, quando a hero renderizar, então a animação deve ser desativada e a cena deve aparecer no estado final estático.
- Dado que há banners cadastrados via admin, quando a hero renderizar, então o título e o subtítulo devem refletir o BannerData ativo atual.
- Dado que não há banners cadastrados, quando a hero renderizar, então o FALLBACK_BANNER deve ser exibido com headline e badge padrão.
- Dado que o usuário está em mobile (viewport < 640px), quando a hero renderizar, então as peças animadas devem ser visíveis porém reduzidas, sem sobrepor o texto principal.
- Dado que o CTA de WhatsApp está visível, quando o usuário clicar, então deve abrir o link configurado via `NEXT_PUBLIC_WHATSAPP_NUMBER`.
</acceptance_criteria>

<constraints>
- FAÇA: usar apenas CSS keyframes ou Web Animations API para as animações; evitar adicionar Framer Motion ou GSAP sem validação prévia.
- FAÇA: desenhar os SVGs dos fixadores como elementos inline reutilizáveis (componentes React pequenos) dentro do mesmo arquivo ou importados de `components/icons/`.
- FAÇA: garantir `aria-hidden="true"` em toda a camada animada decorativa.
- FAÇA: respeitar `prefers-reduced-motion: reduce` desativando a animação de explosão.
- FAÇA: manter compatibilidade com a interface `BannerData` existente sem alterar sua tipagem.
- NÃO FAÇA: remover o CTA de WhatsApp ou alterar o `whatsappHref` já calculado.
- NÃO FAÇA: usar imagens externas ou assets de terceiros para os ícones dos fixadores — apenas SVG inline.
- NUNCA: bloquear interação com CTAs por camadas animadas sobrepostas com `pointer-events`.
</constraints>
