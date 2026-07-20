---
status: completed
title: "globals.css: refinamento de tokens amber e off-white"
type: frontend
complexity: low
dependencies: []
---

# Task 03: globals.css: refinamento de tokens amber e off-white

## Overview

Ajusta os valores oklch de `--brand-amber` e `--brand-amber-dark` em `app/globals.css` para maior saturação e impacto visual, e adiciona o token `--brand-off-white` necessário para o fundo alternado da `DiferenciaisSection`. Todas as demais variáveis e regras CSS permanecem intocadas.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "globals.css" para os valores oklch exatos
- FOQUE NO "QUÊ" — 3 linhas de CSS; não alterar outros tokens ou regras
- MINIMIZE CÓDIGO — nenhum novo seletor, classe utilitária ou regra além do especificado
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE atualizar `--brand-amber` de `oklch(0.75 0.17 75)` para `oklch(0.78 0.20 72)` no bloco `:root`.
- DEVE atualizar `--brand-amber-dark` de `oklch(0.65 0.17 68)` para `oklch(0.67 0.19 68)` no bloco `:root`.
- DEVE adicionar `--brand-off-white: oklch(0.97 0.005 255)` ao bloco `:root`.
- DEVE registrar `--color-brand-off-white: var(--brand-off-white)` no bloco `@theme inline`.
- NÃO DEVE alterar nenhum outro token de cor (`--brand-navy`, `--brand-navy-dark`, `--brand-navy-light`, `--brand-white`).
- NÃO DEVE alterar tokens do sistema shadcn/ui (`--background`, `--foreground`, `--primary`, etc.).
- NÃO DEVE adicionar novas regras CSS além do token e seu registro em `@theme`.
- Os valores oklch ajustados DEVEM permanecer dentro do gamut sRGB para compatibilidade ampla de monitor.
</requirements>

## Subtasks

- [x] 3.1 Atualizar `--brand-amber` para `oklch(0.78 0.20 72)` no bloco `:root`
- [x] 3.2 Atualizar `--brand-amber-dark` para `oklch(0.67 0.19 68)` no bloco `:root`
- [x] 3.3 Adicionar `--brand-off-white: oklch(0.97 0.005 255)` ao bloco `:root`
- [x] 3.4 Registrar `--color-brand-off-white: var(--brand-off-white)` no bloco `@theme inline`
- [x] 3.5 Verificar visualmente no browser que o amber está mais vibrante sem parecer neon

## Implementation Details

Ver TechSpec seção "globals.css" para os valores exatos e a posição correta de cada declaração.

O bloco `@theme inline` já contém registros para os outros tokens `--color-brand-*`. O novo token `--brand-off-white` deve ser adicionado logo após `--color-brand-white: var(--brand-white)` para manter a organização.

No bloco `:root`, os tokens de marca ficam no topo (comentário `/* TechnicFix brand palette */`). O novo `--brand-off-white` deve ser adicionado ao final desse grupo, antes de `--background`.

O valor `oklch(0.97 0.005 255)` produz um branco quente-frio levemente azulado que complementa o navy sem competir com o branco puro `--brand-white`.

### Relevant Files

- `app/globals.css` — único arquivo a modificar; blocos `:root` e `@theme inline`

### Dependent Files

- `components/home/DiferenciaisSection.tsx` — usará `bg-brand-off-white` como fundo; task_07
- Qualquer componente que use `bg-brand-amber` ou `text-brand-amber` será afetado pelo amber mais saturado (Hero, buttons, labels)

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — refinamento de tokens como parte da evolução da identidade

## Deliverables

- `app/globals.css` com `--brand-amber` e `--brand-amber-dark` atualizados e `--brand-off-white` adicionado
- Verificação visual: amber mais vibrante em botões e badges (no browser) **(OBRIGATÓRIO)**
- `bg-brand-off-white` funcional como classe Tailwind em qualquer componente **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `--brand-amber: oklch(0.78 0.20 72)` presente no `:root` do CSS compilado
  - [ ] `--brand-amber-dark: oklch(0.67 0.19 68)` presente no `:root` do CSS compilado
  - [ ] `--brand-off-white: oklch(0.97 0.005 255)` presente no `:root`
  - [ ] `--color-brand-off-white` registrado no `@theme inline`
- Testes de integração:
  - [ ] Classe Tailwind `bg-brand-off-white` aplicável em um `<div>` sem erro de build
  - [ ] Classe Tailwind `bg-brand-amber` usa o novo valor oklch após rebuild do CSS
  - [ ] Nenhum outro token foi alterado (inspecionar `:root` no DevTools do browser)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `bg-brand-off-white` funciona como classe Tailwind
- Amber visualmente mais saturado sem parecer neon em monitor sRGB
- Nenhum outro token do design system foi alterado
