---
status: pending
title: "Definir @keyframes CSS: explode-piece e assemble-piece com trajetórias radiais"
type: feature
complexity: medium
dependencies: [task_02]
---

# Task 03: Animação CSS — Keyframes de Explosão e Remontagem

## Overview

Definir as animações CSS que controlam o comportamento de cada peça SVG. Cada peça tem sua própria keyframe com trajetória radial única, delay individual e um ciclo completo de 6s (explosão → pausa → remontagem → pausa → loop).

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- As keyframes devem ser definidas em `app/globals.css` para reutilização global
- O estado 0% e 100% das keyframes deve ser IDÊNTICO (peça no centro) para garantir loop suave sem salto
- Usar `transform: translate() rotate() scale()` — não alterar `top/left` durante animação (performance)
- `pointer-events: none` deve ser aplicado a todos os elementos animados
</critical>

<requirements>
- DEVE criar 5 keyframes nomeadas: `explode-bolt`, `explode-nut`, `explode-anchor`, `explode-bushing`, `explode-washer`
- DEVE cada keyframe ter 0%/83%/100% no estado "centro" e 33%/50% no estado "explodido"
- DEVE adicionar regra `@media (prefers-reduced-motion: reduce)` que neutraliza todas as animações explode-*
- DEVE garantir que `pointer-events: none` é aplicado ao container da cena animada
- DEVE testar visualmente o ciclo completo em dev antes de concluir a task
</requirements>

## Subtasks

- [ ] 3.1 Adicionar keyframes `explode-bolt`, `explode-nut`, `explode-anchor`, `explode-bushing`, `explode-washer` em `app/globals.css`
- [ ] 3.2 Adicionar classes utilitárias (ou usar `style=""` inline) para aplicar `animation: explode-X 6s ease-in-out infinite` com delays 0s, 0.15s, 0.3s, 0.45s, 0.6s
- [ ] 3.3 Adicionar `@media (prefers-reduced-motion: reduce)` neutralizando as animações
- [ ] 3.4 Criar um componente temporário de teste (`ExplodingScene` simples) para validar visualmente no browser

## Implementation Details

Consultar o TechSpec seção "Animação CSS" para os vetores de explosão de cada peça.

Estrutura das keyframes em `app/globals.css`:

```css
/* Hero: explosão de peças */
@keyframes explode-bolt {
  0%, 83%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  33%, 50% {
    transform: translate(0px, -120px) rotate(-15deg) scale(0.8);
    opacity: 0.7;
  }
}

/* ... demais keyframes conforme TechSpec ... */

@media (prefers-reduced-motion: reduce) {
  .animate-explode-bolt,
  .animate-explode-nut,
  .animate-explode-anchor,
  .animate-explode-bushing,
  .animate-explode-washer {
    animation: none !important;
    transform: translate(0, 0) !important;
    opacity: 1 !important;
  }
}
```

### Relevant Files

- `app/globals.css` — adicionar keyframes e media query
- `components/home/Hero.tsx` — onde as classes serão aplicadas nos SVGs

## Deliverables

- 5 keyframes em `app/globals.css`
- Regra `prefers-reduced-motion` funcional
- Ciclo de animação validado visualmente

## Tests

- Abrir `http://localhost:3000` (ou equivalente) e confirmar que as peças animam em ciclo de ~6s
- DevTools → Emular `prefers-reduced-motion: reduce` → peças fixas
- `npx tsc --noEmit` sem erros

## Success Criteria

- Keyframes definidas e ciclo visual correto
- `prefers-reduced-motion` desabilita a animação
- TypeScript sem erros
