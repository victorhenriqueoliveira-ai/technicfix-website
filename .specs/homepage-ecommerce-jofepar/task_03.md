---
status: completed
title: HeaderSearchBar — campo de busca com redirect
type: frontend
complexity: low
dependencies: []
---

# Task 03: HeaderSearchBar — campo de busca com redirect

## Overview

Cria o componente Client Component `components/layout/HeaderSearchBar.tsx` — um input de busca com ícone de lupa que, ao pressionar Enter ou clicar no botão de submit, redireciona para `/produtos?busca=<termo>` usando `router.push`. Componente isolado, sem dependências de outras tasks, e pode ser desenvolvido em paralelo com task_01 e task_04.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Client Component (`'use client'`) em `components/layout/HeaderSearchBar.tsx`
- DEVE aceitar a prop `className?: string` para posicionamento pelo Header pai
- DEVE redirecionar para `/produtos?busca=<termo>` ao pressionar Enter ou clicar no botão de lupa
- NÃO DEVE usar debounce — o redirect acontece apenas no submit (diferente do `SearchBar` existente em `components/catalog/SearchBar.tsx`, que usa debounce para filtro em tempo real)
- DEVE limpar o input após o redirect
- DEVE usar o ícone `Search` do Lucide icons (já presente no projeto)
- DEVE aplicar as classes Tailwind descritas na seção "HeaderSearchBar" do TechSpec: border `brand-amber` no focus, ícone text-gray-400 hover:text-brand-amber
- DEVE tratar o caso de value vazio (sem trim) — não redirecionar se o campo estiver em branco
</requirements>

## Subtasks

- [x] 3.1 Criar `components/layout/HeaderSearchBar.tsx` como Client Component
- [x] 3.2 Implementar o formulário com input controlado e handler de submit
- [x] 3.3 Aplicar estilos Tailwind conforme o TechSpec
- [x] 3.4 Escrever testes unitários cobrindo submit, redirect e limpeza do input

## Implementation Details

Veja a seção "HeaderSearchBar.tsx (NOVO)" do TechSpec para a estrutura exata do componente, incluindo classes Tailwind e lógica de submit.

O `SearchBar` existente em `components/catalog/SearchBar.tsx` usa debounce de 300ms e `router.replace` para manter o filtro na página atual — comportamento diferente do `HeaderSearchBar`, que sempre redireciona via `router.push`. Não reutilizar o `SearchBar` existente — criar componente separado conforme o TechSpec.

### Relevant Files

- `components/layout/HeaderSearchBar.tsx` — arquivo a ser criado
- `components/catalog/SearchBar.tsx` — referência de padrões Tailwind e estrutura, mas NÃO reutilizar diretamente

### Dependent Files

- `components/layout/Header.tsx` (task_05) — importa `HeaderSearchBar`

### Related ADRs

Nenhum ADR específico se aplica a esta tarefa.

## Deliverables

- `components/layout/HeaderSearchBar.tsx` implementado e compilando
- Testes unitários com mock de `useRouter` **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Renderiza o input e o botão de lupa corretamente
  - [x] Digitar "parafuso" e submeter o form: `router.push` chamado com `/produtos?busca=parafuso`
  - [x] Submeter com input vazio (string `""`): `router.push` NÃO é chamado
  - [x] Submeter com input contendo apenas espaços (`"   "`): `router.push` NÃO é chamado (trim)
  - [x] Após submit com valor válido, o input é limpo (value volta para `""`)
  - [x] Termo com caracteres especiais ("parafuso M8 inox"): URL encodada corretamente (`encodeURIComponent`)
  - [x] A prop `className` é aplicada ao elemento `<form>`
- Testes de integração:
  - [x] Componente renderiza sem erros dentro do contexto do Header (sem crashes de `useRouter` fora de provider)

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Componente compilando sem erros TypeScript
- Redirect para `/produtos?busca=<termo>` funcionando corretamente no browser
- Input limpo após redirect
