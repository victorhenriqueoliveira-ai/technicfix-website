---
status: pending
title: "Baseline: rodar testes existentes e documentar estado atual do Hero"
type: infra
complexity: low
dependencies: []
---

# Task 01: Baseline — Estado atual do Hero

## Overview

Antes de qualquer alteração, rodar os testes existentes do Hero para documentar quais passam e quais falham no estado atual. Isso garante visibilidade sobre regressões introduzidas pelas tasks seguintes.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- Esta task não altera nenhum arquivo de código — apenas lê e documenta
- O resultado deve ser registrado nos subtasks abaixo
</critical>

<requirements>
- DEVE rodar `npx jest __tests__/components/home/Hero.test.tsx --no-coverage` e registrar quais testes passam/falham
- DEVE confirmar que `next build` ou `next dev` não tem erros de TypeScript no Hero.tsx atual
- DEVE listar os `data-testid` presentes no Hero.tsx atual para referência da task_04
</requirements>

## Subtasks

- [ ] 1.1 Rodar `npx jest __tests__/components/home/Hero.test.tsx --no-coverage` e anotar resultado
- [ ] 1.2 Rodar `npx tsc --noEmit` e confirmar 0 erros relacionados ao Hero
- [ ] 1.3 Confirmar quais `data-testid` existem no Hero.tsx atual: hero-section, hero-title, hero-subtitle, hero-cta

## Implementation Details

Esta task é de leitura e verificação apenas. Nenhum arquivo de código é alterado.

Resultado esperado do jest: alguns testes podem falhar por textos de fallback desalinhados (ex.: o teste espera "Technicfix — Parafusos e Materiais de Obra" mas o componente exibe "TechnicFix — Parafusos e Fixadores"). Isso é esperado e será corrigido na task_08.

### Relevant Files

- `components/home/Hero.tsx` — apenas leitura
- `__tests__/components/home/Hero.test.tsx` — apenas leitura

## Deliverables

- Subtasks marcadas com resultado documentado nos checkboxes
- Nenhum arquivo de código alterado

## Tests

- Esta task não produz código — a "validação" é o registro do estado baseline nos subtasks

## Success Criteria

- Subtasks 1.1, 1.2 e 1.3 preenchidas com resultado real
- Nenhuma alteração em arquivos de código
