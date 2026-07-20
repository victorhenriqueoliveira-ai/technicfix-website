---
status: pending
title: "Adicionar iluminação focal (radial gradient âmbar central) e preservar faixa amber na base"
type: polish
complexity: small
dependencies: [task_04]
---

# Task 05: Polimento Visual — Iluminação Focal e Faixa Amber

## Overview

Garantir que a iluminação focal (radial gradient âmbar ao centro da cena) está implementada corretamente e que a faixa amber `h-1` na base da hero está preservada. Ajustar opacidades e posicionamento se necessário para o efeito visual desejado.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- A camada de gradient deve ter `aria-hidden="true"`
- O gradient focal deve ficar entre o fundo navy e a cena animada (z-index correto)
- A faixa amber `h-1` deve estar no bottom da hero, acima de todos os outros elementos
</critical>

<requirements>
- DEVE confirmar que a camada `radial-gradient(ellipse_at_center, brand-amber/20, transparent)` está renderizada
- DEVE confirmar que a faixa amber `h-1` está no `absolute bottom-0 left-0 right-0`
- DEVE ajustar opacidade do gradient focal se o efeito parecer muito fraco ou muito forte
- DEVE garantir z-index correto: fundo → overlay escuro → gradient focal → cena SVG → texto/CTAs → faixa amber
</requirements>

## Subtasks

- [ ] 5.1 Confirmar visualmente no browser que o gradient âmbar focal está visível ao centro
- [ ] 5.2 Confirmar que a faixa amber `h-1` aparece na base da hero
- [ ] 5.3 Ajustar opacidade do gradient focal se necessário (entre `/10` e `/30`)
- [ ] 5.4 Verificar que o z-index da faixa amber está acima da cena animada

## Implementation Details

Se a task_04 já implementou os dois elementos, esta task é de verificação e ajuste fino. Alterações esperadas são mínimas (ajuste de valor de opacidade via CSS variable ou classe Tailwind).

O radial gradient focal pode ser implementado como:

```tsx
<div
  aria-hidden="true"
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse 60% 50% at center, color-mix(in srgb, var(--color-brand-amber) 20%, transparent) 0%, transparent 70%)'
  }}
/>
```

### Relevant Files

- `components/home/Hero.tsx` — ajustes de opacidade/z-index se necessário

## Deliverables

- Gradient focal âmbar visível e com opacidade adequada
- Faixa amber na base confirmada

## Tests

- Validação visual no browser em desktop e mobile

## Success Criteria

- Gradient focal visível ao centro da hero
- Faixa amber `h-1` visível na base
- Nenhuma quebra de z-index (texto sempre legível sobre as camadas)
