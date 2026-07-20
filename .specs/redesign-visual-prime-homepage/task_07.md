---
status: completed
title: "DiferenciaisSection.tsx: fundo off-white + ícones maiores"
type: frontend
complexity: low
dependencies:
  - task_03
---

# Task 07: DiferenciaisSection.tsx: fundo off-white + ícones maiores

## Overview

Redesenha `components/home/DiferenciaisSection.tsx` alterando o fundo da seção de `bg-brand-navy` para `bg-brand-off-white` (token adicionado na task_03), adaptando as cores de texto e cards para o novo fundo claro, e aumentando os ícones de `h-8 w-8` para `h-10 w-10`. O conteúdo textual e a estrutura de grid permanecem intactos.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "DiferenciaisSection.tsx" para as substituições de classe exatas
- FOQUE NO "QUÊ" — adaptar paleta do fundo escuro para claro; não alterar conteúdo nem grid
- MINIMIZE CÓDIGO — substituir classes; não reorganizar a estrutura do componente
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE substituir `bg-brand-navy` da `<section>` por `bg-brand-off-white`.
- DEVE substituir `text-white` do heading principal por `text-brand-navy`.
- DEVE substituir `text-white` do eyebrow label por `text-brand-amber` (já correto, verificar).
- DEVE substituir `bg-brand-navy-light border-white/10` dos cards por `bg-white border-brand-navy/8 shadow-sm`.
- DEVE adicionar `hover:shadow-md hover:-translate-y-1 transition-all` aos cards.
- DEVE substituir `text-white` dos títulos dos cards (`<h3>`) por `text-brand-navy`.
- DEVE substituir `text-white/60` das descrições dos cards por `text-brand-navy/60`.
- DEVE aumentar os SVGs internos dos ícones de `h-8 w-8` para `h-10 w-10`.
- NÃO DEVE alterar o array `DIFERENCIAIS` (textos e SVGs dos ícones permanecem os mesmos).
- NÃO DEVE alterar o container do ícone (`h-16 w-16 rounded-xl bg-brand-amber/10 text-brand-amber`).
- NÃO DEVE alterar o grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).
- Toda alteração DEVE usar tokens do design system — zero hex hardcoded.
</requirements>

## Subtasks

- [x] 7.1 Substituir `bg-brand-navy` da seção por `bg-brand-off-white`
- [x] 7.2 Atualizar cores do heading e eyebrow label para o novo fundo claro
- [x] 7.3 Atualizar estilo dos cards: fundo branco, borda sutil, sombra base e hover
- [x] 7.4 Atualizar cores de texto (`<h3>` e `<p>`) dos cards para navy
- [x] 7.5 Aumentar SVGs dos ícones de `h-8 w-8` para `h-10 w-10`
- [x] 7.6 Verificar contraste dos textos navy sobre fundo off-white (≥ 4.5:1)

## Implementation Details

Ver TechSpec seção "DiferenciaisSection.tsx" para a sequência completa de substituições de classe.

**Sequência de fundos na homepage após a mudança:**
- Hero → `bg-brand-navy` (dark)
- DiferenciaisSection → `bg-brand-off-white` (claro) ← esta task
- CategoryGrid → `bg-white` (branco puro)
- FeaturedProducts → `bg-gray-50` (cinza leve)
- TechnocalhasSection → `bg-brand-amber` (amber)
- LeadGeneralForm → `bg-brand-navy-dark` (dark) ← task_08

Este ritmo alternado (dark → claro → branco → cinza → amber → dark) é o que o TechSpec descreve como "respiração visual".

O `hover:border-brand-amber/40` que estava no card original pode ser mantido ou substituído por `hover:border-brand-navy/20` — o TechSpec não especifica o hover de borda para o fundo claro; use `hover:border-brand-amber/40` para manter consistência com o padrão do site.

### Relevant Files

- `components/home/DiferenciaisSection.tsx` — único arquivo a modificar
- `app/globals.css` — token `--brand-off-white` (adicionado na task_03) deve existir antes desta task

### Dependent Files

- Nenhum arquivo depende das saídas desta tarefa

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — fundo alternado como parte do ritmo visual premium

## Deliverables

- `components/home/DiferenciaisSection.tsx` com fundo off-white, cards brancos e ícones maiores
- Seção visualmente diferenciada das seções adjacentes (navy antes, branco depois) **(OBRIGATÓRIO)**
- Textos legíveis sobre fundo claro com contraste ≥ 4.5:1 **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `<section>` possui classe `bg-brand-off-white` (não `bg-brand-navy`)
  - [ ] Heading `<h2>` possui classe `text-brand-navy` (não `text-white`)
  - [ ] Card `<div>` possui `bg-white` e `shadow-sm` como classes base
  - [ ] Cada `<h3>` de card possui `text-brand-navy` (não `text-white`)
  - [ ] Cada `<p>` de descrição possui `text-brand-navy/60` (não `text-white/60`)
  - [ ] SVGs dos ícones possuem `h-10 w-10` (não `h-8 w-8`)
  - [ ] Exatamente 4 cards são renderizados (correspondendo ao array `DIFERENCIAIS`)
- Testes de integração:
  - [ ] Seção renderiza sem erro em 375px sem overflow horizontal
  - [ ] Grid de 4 cards colapsa para 1 coluna em mobile e 4 em desktop
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Seção com fundo off-white visualmente distinta das seções vizinhas
- Ícones maiores (`h-10 w-10`) mais impactantes visualmente
- Textos navy sobre fundo claro com contraste adequado para acessibilidade
