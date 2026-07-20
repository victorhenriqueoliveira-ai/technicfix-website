---
status: completed
title: "LeadGeneralForm.tsx: dark band navy + inputs + CTA"
type: frontend
complexity: low
dependencies: []
---

# Task 08: LeadGeneralForm.tsx: dark band navy + inputs + CTA

## Overview

Transforma `components/home/LeadGeneralForm.tsx` no padrão "dark band de conversão": fundo `bg-brand-navy-dark`, textos e labels em branco, inputs com aparência de glass sobre o fundo escuro e CTA amber com sombra expandida. A lógica de estado do formulário (`idle`, `loading`, `success`, `error`) e a action `submitLead` permanecem intocadas.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC seção "LeadGeneralForm.tsx" para as substituições de classe exatas
- FOQUE NO "QUÊ" — dark band visual; não alterar lógica de formulário, validação ou server action
- MINIMIZE CÓDIGO — substituir classes de cor; não reorganizar a estrutura do formulário
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE substituir `bg-white` da `<section>` wrapper por `bg-brand-navy-dark` (para ambos os estados: idle e success).
- DEVE substituir `text-gray-800` do heading por `text-white`.
- DEVE substituir `text-gray-600` do subtexto por `text-white/70`.
- DEVE substituir `text-gray-700` dos `<label>` por `text-white/80`.
- DEVE substituir `border-gray-300 text-gray-900` dos inputs por `border-white/20 bg-white/10 text-white placeholder:text-white/40`.
- DEVE manter `focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20` nos inputs (já existente).
- DEVE adicionar `shadow-lg shadow-brand-amber/20 hover:shadow-xl hover:shadow-brand-amber/30` ao botão de submissão.
- DEVE substituir o estado de sucesso: `bg-green-50 border-green-200` → `bg-white/10 border-white/20`; textos green → `text-white` / `text-white/80`; botão "Enviar outra mensagem" → `text-brand-amber hover:text-brand-amber-dark`.
- DEVE substituir o estado de erro: `bg-red-50 border-red-200 text-red-600` → `bg-red-900/30 border-red-400/40 text-red-300`.
- NÃO DEVE alterar a função `handleSubmit`, o `useState<FormState>`, a chamada a `submitLead` nem a lógica de reset do form.
- NÃO DEVE alterar os `name`, `id`, `type`, `required`, `placeholder` dos inputs.
- NÃO DEVE alterar `data-testid` de nenhum elemento.
- Toda alteração DEVE usar tokens do design system — zero hex hardcoded.
</requirements>

## Subtasks

- [x] 8.1 Substituir `bg-white` por `bg-brand-navy-dark` na `<section>` (estado idle e success)
- [x] 8.2 Atualizar heading, subtexto e labels para branco/white
- [x] 8.3 Atualizar inputs: borda, fundo glass, texto branco, placeholder branco/40
- [x] 8.4 Adicionar sombra expansível ao botão de submissão
- [x] 8.5 Atualizar estado de sucesso para aparência dark (fundo white/10, textos brancos)
- [x] 8.6 Atualizar estado de erro para aparência dark (fundo red-900/30, texto red-300)
- [x] 8.7 Verificar que o formulário ainda submete e exibe success/error corretamente

## Implementation Details

Ver TechSpec seção "LeadGeneralForm.tsx" para a lista completa de substituições de classe.

O componente tem dois caminhos de renderização: o estado `success` renderiza uma `<section>` separada e o estado normal (idle/loading/error) renderiza outra `<section>`. Ambas compartilham o mesmo fundo `bg-white` que precisa ser atualizado para `bg-brand-navy-dark`.

O `<textarea>` de mensagem segue as mesmas classes dos `<input>` — não esquecer de atualizar suas classes junto com os inputs.

O `<span className="text-red-500">*</span>` nos labels obrigatórios pode ser mantido como `text-red-400` (levemente mais claro para o fundo escuro) ou como está — o TechSpec não especifica; manter `text-red-500` é aceitável.

O `data-testid="lead-form-section"` e demais `data-testid` NUNCA devem ser removidos — são usados em testes e2e existentes.

### Relevant Files

- `components/home/LeadGeneralForm.tsx` — único arquivo a modificar
- `actions/leads.ts` — server action `submitLead`; NÃO modificar

### Dependent Files

- Nenhum arquivo depende das saídas desta tarefa

### Related ADRs

- [ADR-001: Abordagem Premium Polish](adrs/adr-001.md) — dark band como padrão de conversão premium

## Deliverables

- `components/home/LeadGeneralForm.tsx` com dark band navy-dark, inputs glass e CTA amber com sombra
- Formulário ainda submete com sucesso (happy path funcional) **(OBRIGATÓRIO)**
- Estado de erro visível e legível sobre fundo navy-dark **(OBRIGATÓRIO)**
- Estado de sucesso visível e coerente com o fundo navy-dark **(OBRIGATÓRIO)**
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `<section>` no estado idle possui classe `bg-brand-navy-dark`
  - [x] `<section>` no estado success possui classe `bg-brand-navy-dark`
  - [x] Heading possui classe `text-white`
  - [x] Subtexto possui classe `text-white/70`
  - [x] Todos os `<label>` possuem `text-white/80`
  - [x] Inputs possuem `border-white/20`, `bg-white/10`, `text-white`
  - [x] `<textarea>` possui as mesmas classes dos inputs
  - [x] Botão de submit possui `shadow-lg shadow-brand-amber/20`
  - [x] Estado de sucesso: container possui `bg-white/10 border-white/20`
  - [x] Estado de erro: `<p>` de erro possui `bg-red-900/30 text-red-300`
  - [x] `data-testid="lead-form-section"` ainda presente no DOM
  - [x] `data-testid="submit-button"` ainda presente no DOM
- Testes de integração:
  - [x] Formulário renderiza sem erro em 375px
  - [x] Placeholder dos inputs visível sobre fundo escuro (contraste aceitável)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Formulário com aparência "dark band" premium e coerente com o design system
- Happy path de submissão funcional (sem regressão na lógica)
- Todos os `data-testid` preservados
- Placeholders e textos legíveis sobre fundo navy-dark
