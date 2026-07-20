---
status: completed
title: Adicionar prop onSearch ao HeaderSearchBar
type: frontend
complexity: low
dependencies: []
---

# Task 4: Adicionar prop onSearch ao HeaderSearchBar

## Overview

Adiciona a prop opcional `onSearch?: () => void` ao `HeaderSearchBar`, chamada imediatamente antes de qualquer navegação via `router.push`. Isso permite que o `MobileMenu` (task_06) feche o Sheet automaticamente quando o visitante confirma uma busca — sem quebrar os usos existentes do componente, pois a prop é opcional.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `onSearch?: () => void` à interface de props de `HeaderSearchBar` — veja a seção "Core Interfaces" do TechSpec
- DEVE chamar `onSearch?.()` antes de cada `router.push(...)` presente no componente
- NÃO DEVE tornar `onSearch` obrigatória — usos existentes sem a prop não devem quebrar
- NÃO DEVE alterar a lógica de navegação (`router.push`) nem o comportamento visual do campo de busca
- DEVE manter retrocompatibilidade: o componente renderiza e funciona normalmente quando `onSearch` não é fornecida
</requirements>

## Subtasks

- [x] 4.1 Ler `components/layout/HeaderSearchBar.tsx` e identificar todos os pontos de chamada a `router.push`
- [x] 4.2 Adicionar `onSearch?: () => void` à interface de props do componente
- [x] 4.3 Inserir `onSearch?.()` antes de cada `router.push` identificado
- [x] 4.4 Verificar que nenhum uso existente do `HeaderSearchBar` (sem a prop) quebra

## Implementation Details

Apenas `components/layout/HeaderSearchBar.tsx` precisa ser modificado. Verificar quantas vezes `router.push` é chamado — podem ser múltiplos pontos (submit do form, clique no botão, etc.). Veja a seção "Core Interfaces" do TechSpec para a assinatura exata da prop.

### Relevant Files

- `components/layout/HeaderSearchBar.tsx` — único arquivo a ser alterado

### Dependent Files

- `components/layout/Header.tsx` (task_07) — usa `HeaderSearchBar` no MainBar desktop; sem mudança necessária pois prop é opcional
- `components/layout/MobileMenu.tsx` (task_06) — passará `onSearch={() => setOpen(false)}` para `HeaderSearchBar`

### Related ADRs

- [ADR-002: Extrair MobileMenu como Client Component](../adrs/adr-002.md) — Define a necessidade desta prop para o fechamento do Sheet

## Deliverables

- `components/layout/HeaderSearchBar.tsx` com prop `onSearch` adicionada
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `HeaderSearchBar` renderiza sem erros quando `onSearch` não é fornecida (retrocompatibilidade)
  - [x] `HeaderSearchBar` renderiza sem erros quando `onSearch` é uma função mock
  - [x] Ao submeter o formulário de busca com texto preenchido, `onSearch` é chamada exatamente uma vez antes da navegação
  - [x] Ao submeter com campo vazio, `onSearch` não é chamada (se o componente já ignorava busca vazia — verificar comportamento atual)
  - [x] `router.push` é chamado com a URL correta após `onSearch` ser chamada
- Testes de integração:
  - [x] `HeaderSearchBar` inserido em `Header` (sem prop `onSearch`) continua funcionando sem erro
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Prop `onSearch` chamada exatamente uma vez antes de `router.push` em cada ponto de navegação
- Usos existentes de `HeaderSearchBar` sem a prop não quebram
- Nenhum comportamento visual do campo de busca foi alterado
