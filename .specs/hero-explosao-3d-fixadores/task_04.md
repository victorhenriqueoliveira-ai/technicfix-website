---
status: pending
title: "Reescrever Hero.tsx: substituir IndustrialDecor pela ExplodingScene com peças animadas"
type: feature
complexity: high
dependencies: [task_03]
---

# Task 04: Hero Rewrite — ExplodingScene

## Overview

Reescrever `components/home/Hero.tsx` substituindo o carousel estático e `IndustrialDecor` pela nova cena animada (`ExplodingScene`) com os 5 SVGs de fixadores. Manter a interface `BannerData`, os `data-testid` obrigatórios, o `whatsappHref` e a compatibilidade com `FALLBACK_BANNER`.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- A interface `BannerData` exportada NÃO pode ser alterada
- Manter TODOS os `data-testid`: hero-section, hero-title, hero-subtitle, hero-cta
- O `whatsappHref` calculado a partir de `NEXT_PUBLIC_WHATSAPP_NUMBER` NÃO pode ser removido nem alterado
- `pointer-events: none` em todos os SVGs/container da cena animada
- A `ExplodingScene` deve ter `aria-hidden="true"`
</critical>

<requirements>
- DEVE remover: `IndustrialDecor`, lógica de carousel (indicadores de slide, `setCurrent`, `setInterval`)
- DEVE criar: componente `ExplodingScene` com os 5 SVGs posicionados absolutamente
- DEVE aplicar: classes de animação `animate-explode-*` e delays nos SVGs da cena
- DEVE manter: `BannerData` interface, `FALLBACK_BANNER`, `whatsappHref`, todos `data-testid`
- DEVE manter: fundo navy, overlay escuro, faixa amber `h-1` na base
- DEVE adicionar: radial gradient focal âmbar ao centro (camada `aria-hidden`)
- NÃO DEVE: alterar a tipagem de `BannerData`
- NÃO DEVE: remover ou mover o CTA de WhatsApp
- NUNCA: colocar `pointer-events` habilitado nos elementos decorativos
</requirements>

## Subtasks

- [ ] 4.1 Remover `IndustrialDecor` e a lógica de `setCurrent`/`setInterval` do carousel
- [ ] 4.2 Criar `ExplodingScene` com os 5 SVGs posicionados absolutamente (posições conforme TechSpec)
- [ ] 4.3 Aplicar classes de animação e `animation-delay` em cada SVG da cena
- [ ] 4.4 Adicionar camada de radial gradient focal (`brand-amber/20`, `aria-hidden`)
- [ ] 4.5 Garantir que texto/CTAs têm `z-10` e são visíveis sobre a cena
- [ ] 4.6 Preservar `data-testid="hero-section"`, `"hero-title"`, `"hero-subtitle"`, `"hero-cta"`
- [ ] 4.7 Rodar `npx jest __tests__/components/home/Hero.test.tsx` — pode falhar por texto; não é blocker nesta task (será resolvido na task_08)
- [ ] 4.8 Abrir `http://localhost:3000` e validar visualmente a cena completa

## Implementation Details

Consultar o TechSpec seções "Estrutura do componente Hero.tsx", "SVG Components", "Estrutura do JSX" para o layout exato.

O novo Hero não terá mais a lógica de múltiplos banners com carousel. O componente exibirá sempre o primeiro banner ativo (ou o fallback), com a cena animada como fundo.

Remover também a importação de `isValidUrl` se não for mais necessária (a nova hero não exibe imagem de banner no background — apenas o gradiente navy com as peças SVG).

### Relevant Files

- `components/home/Hero.tsx` — arquivo principal desta task (reescrever)
- `app/globals.css` — keyframes já definidas na task_03
- `__tests__/components/home/Hero.test.tsx` — NÃO alterar nesta task (task_08)
- `app/(public)/page.tsx` — NÃO alterar (consumidor sem mudança)

### Dependent Files

- `__tests__/components/home/Hero.test.tsx` — será atualizado na task_08

## Deliverables

- `components/home/Hero.tsx` reescrito com a nova cena animada
- `ExplodingScene` renderizando os 5 SVGs com animações aplicadas
- Interface `BannerData` preservada e exportada
- Todos os `data-testid` preservados
- Fundo navy + radial gradient focal + faixa amber

## Tests

- `npx tsc --noEmit` sem erros
- Validação visual no browser: cena animada visível, texto legível, CTAs clicáveis

## Success Criteria

- Hero.tsx renderiza a nova cena
- `BannerData` não alterada
- `data-testid` obrigatórios presentes
- TypeScript sem erros
- CTAs funcionais e com `pointer-events` habilitado (peças decorativas com `pointer-events: none`)
