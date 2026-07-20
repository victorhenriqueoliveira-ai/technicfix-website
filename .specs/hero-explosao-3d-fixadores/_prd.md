# PRD — Hero Explosão 3D: Parafusos e Fixadores

## Objetivo

Redesenhar a seção hero do site TechnicFix com uma experiência visual inédita: uma vista explodida animada de parafusos, porcas, buchas e âncoras que explode na entrada da página e se remonta em loop, transmitindo precisão, força e a identidade industrial da marca. O objetivo é transformar o primeiro contato do visitante em um momento memorável, diferenciando o site de concorrentes com layout genérico.

## Contexto de negócio

- A TechnicFix vende parafusos, fixadores e materiais para obra.
- A hero atual é um carousel estático com engrenagens SVG decorativas e fundo navy — funcional, mas genérica.
- O redesign deve impactar na primeira impressão sem comprometer conversão (CTAs visíveis e clicáveis).

## Requisitos de negócio

- Substituir o carousel estático atual por uma hero de tela cheia com animação de explosão 3D dos produtos principais (parafusos, porcas, buchas, âncoras, fixadores).
- Manter o CTA primário de WhatsApp e o CTA secundário "Ver Produtos" com visibilidade garantida sobre a animação.
- Preservar o badge da marca ("TechnicFix — Parafusos e Fixadores") e headline dinâmica via `BannerData`.
- A nova hero deve continuar compatível com a interface `BannerData` já existente no componente.

## Requisitos de arquitetura

- Implementar como `'use client'` React Client Component em `components/home/Hero.tsx`.
- Animação pura em CSS `@keyframes` ou Web Animations API — sem Framer Motion ou GSAP.
- SVGs dos fixadores desenhados inline como componentes React com props `className` e `style`.
- Manter suporte ao `FALLBACK_BANNER` quando não houver banners cadastrados.
- Não alterar a tipagem da interface `BannerData`.

## Requisitos de UI/UX

- Fundo: gradiente `from-brand-navy via-brand-navy to-brand-navy-dark`.
- Cena animada: 5 peças SVG (parafuso, porca, âncora, bucha, arruela) partem do centro em trajetórias radiais, explodem para fora, gravitam de volta se montando, em loop contínuo.
- Iluminação focal: radial gradient `brand-amber/20` ao centro da cena.
- Texto e CTAs com `z-index` superior à cena (z-10), legíveis em todos os viewports.
- Badge da marca e headline mantêm o estilo atual (text-brand-amber para destaque).
- Faixa amber `h-1` na base da hero preservada.
- Mobile (`< 640px`): peças reduzidas para não sobrepor texto.
- Acessibilidade: cena com `aria-hidden="true"`; `prefers-reduced-motion` desativa animação mostrando estado estático.

## Critérios de aceitação

- Dado que o usuário acessa a página inicial, quando a hero carregar, então as peças SVG explodem radialmente do centro e se remontam em loop.
- Dado que a animação completou a primeira remontagem, quando o loop recomeçar, a transição é suave sem salto visual.
- Dado que o usuário usa `prefers-reduced-motion`, quando a hero renderizar, a animação é desabilitada e as peças aparecem no estado final estático.
- Dado que há banners cadastrados, quando a hero renderizar, título e subtítulo refletem o `BannerData` ativo.
- Dado que não há banners, quando a hero renderizar, o `FALLBACK_BANNER` é exibido com headline e badge padrão.
- Dado que o usuário está em mobile (< 640px), as peças animadas são visíveis porém reduzidas, sem sobrepor o texto.
- Dado que o CTA de WhatsApp está visível, quando o usuário clicar, abre o link de `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Constraints

- FAÇA: usar apenas CSS keyframes ou Web Animations API.
- FAÇA: SVGs inline com `aria-hidden="true"` na camada decorativa.
- FAÇA: respeitar `prefers-reduced-motion: reduce`.
- FAÇA: manter compatibilidade com interface `BannerData`.
- NÃO FAÇA: remover ou alterar o `whatsappHref`.
- NÃO FAÇA: usar imagens externas para os ícones — apenas SVG inline.
- NUNCA: bloquear interação com CTAs com `pointer-events`.
