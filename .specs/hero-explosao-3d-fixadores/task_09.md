---
status: pending
title: "Revisão final: validar visualmente, todos os testes verdes, abrir PR"
type: release
complexity: small
dependencies: [task_05, task_06, task_07, task_08]
---

# Task 09: Revisão Final e PR

## Overview

Validação final da feature completa: checklist visual no browser, todos os testes passando, TypeScript sem erros, e abertura do Pull Request para `main`.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- Não criar o PR se houver algum teste falhando ou erro TypeScript
- O PR deve ser aberto de `feat/hero-explosao-3d` para `main`
</critical>

<requirements>
- DEVE rodar `npx jest` e confirmar que todos os testes do projeto passam
- DEVE rodar `npx tsc --noEmit` e confirmar 0 erros
- DEVE validar visualmente no browser: animação, mobile, prefers-reduced-motion, CTAs
- DEVE abrir PR com título e descrição adequados usando `gh pr create`
</requirements>

## Subtasks

- [ ] 9.1 Rodar `npx jest` — todos os testes passando
- [ ] 9.2 Rodar `npx tsc --noEmit` — 0 erros
- [ ] 9.3 Abrir `http://localhost:3000` — validar animação de explosão em loop
- [ ] 9.4 DevTools → 375px → validar legibilidade mobile
- [ ] 9.5 DevTools → Emular `prefers-reduced-motion: reduce` → validar estado estático
- [ ] 9.6 Clicar no CTA de WhatsApp — confirmar que abre link correto
- [ ] 9.7 Abrir PR: `gh pr create --base main --head feat/hero-explosao-3d --title "feat(hero): explosão 3D de fixadores com animação CSS" --body "..."`

## Implementation Details

Checklist do PR body sugerido:

```md
## Summary
- Substitui carousel estático por cena animada com vista explodida de fixadores (parafuso, porca, âncora, bucha, arruela)
- Animação CSS pura (zero dependências novas): explosão radial na entrada, remontagem em loop
- Acessibilidade: `prefers-reduced-motion`, `aria-hidden`, `pointer-events: none` na cena decorativa
- Compatibilidade total com `BannerData` existente

## Test plan
- [ ] `npx jest` — todos verdes
- [ ] `npx tsc --noEmit` — 0 erros
- [ ] Hero animada visível em desktop e mobile (375px)
- [ ] `prefers-reduced-motion: reduce` → cena estática
- [ ] CTAs de WhatsApp e "Ver Produtos" clicáveis

🤖 Generated with Claude Code
```

### Relevant Files

- Todos os arquivos alterados pela feature

## Deliverables

- PR aberto com CI passando
- URL do PR retornada

## Tests

- `npx jest` — 100% passando
- `npx tsc --noEmit` — 0 erros
- Validação visual completa

## Success Criteria

- PR criado e URL retornada
- Todos os checks passando
- Feature completa e funcional
