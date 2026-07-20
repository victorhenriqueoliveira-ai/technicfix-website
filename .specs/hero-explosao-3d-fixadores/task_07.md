---
status: pending
title: "Ajustar SVGs para mobile (<640px): reduzir tamanhos sem sobrepor texto"
type: responsive
complexity: small
dependencies: [task_04]
---

# Task 07: Responsividade Mobile — SVGs em Telas Pequenas

## Overview

Em viewports menores que 640px, as peças SVG animadas devem ser reduzidas para não sobrepor o texto central (badge, título, subtítulo, CTAs). A hero deve ser igualmente impactante em mobile, mas garantir legibilidade total do conteúdo.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- Testar em viewport de 375px (iPhone) e 414px (Android médio)
- Texto e CTAs devem ser totalmente legíveis sem sobreposição das peças SVG
- Não ocultar a cena animada completamente em mobile — apenas reduzir
</critical>

<requirements>
- DEVE reduzir o tamanho dos SVGs para `~32px` em viewports `< 640px` (de `~60px` no desktop)
- DEVE garantir que nenhuma peça SVG sobrepõe visualmente o texto central em 375px
- DEVE manter as animações funcionando em mobile (apenas tamanho menor)
- PODE usar Tailwind responsive prefixes (`w-8 sm:w-14`) ou media query no CSS
</requirements>

## Subtasks

- [ ] 7.1 Redimensionar os SVGs da `ExplodingScene` para mobile via Tailwind (`w-8 h-8 sm:w-14 sm:h-14`) ou CSS
- [ ] 7.2 Ajustar posicionamento das peças se necessário para viewport < 640px
- [ ] 7.3 Testar em 375px no browser (DevTools device emulation) — texto legível, CTAs clicáveis
- [ ] 7.4 Testar em 414px no browser — resultado satisfatório

## Implementation Details

A forma mais simples é adicionar classes responsivas Tailwind aos SVGs no `ExplodingScene`:

```tsx
<BoltSvg className="w-8 h-8 sm:w-14 sm:h-14 text-brand-amber/60 animate-explode-bolt" style={{ animationDelay: '0s' }} />
```

Se as peças ainda sobreporem o texto em mobile mesmo com tamanho reduzido, adicionar uma camada de opacidade menor em mobile:

```tsx
className="opacity-30 sm:opacity-100"
```

### Relevant Files

- `components/home/Hero.tsx` — ajustar classes dos SVGs na `ExplodingScene`

## Deliverables

- SVGs visíveis porém reduzidos em mobile
- Texto e CTAs legíveis em 375px

## Tests

- DevTools → device emulation → 375px: texto legível, peças animadas menores sem sobreposição
- DevTools → device emulation → 414px: mesmo resultado

## Success Criteria

- Nenhuma sobreposição de SVG sobre texto em 375px
- Animações funcionais em mobile
- `npx tsc --noEmit` sem erros
