---
status: completed
title: Adicionar ProductNavItem a lib/types.ts
type: refactor
complexity: low
dependencies: []
---

# Task 1: Adicionar ProductNavItem a lib/types.ts

## Overview

Adiciona a interface `ProductNavItem` ao arquivo central de tipos do projeto (`lib/types.ts`), fornecendo a tipagem compartilhada que `ProductsDropdown`, `MobileMenu` e `lib/nav-data.ts` irão consumir. Sem este tipo centralizado, cada arquivo precisaria redefini-lo localmente, gerando divergências.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE exportar a interface `ProductNavItem` com os campos `name: string` e `slug: string` — veja a seção "Core Interfaces" do TechSpec
- DEVE ser adicionada ao `lib/types.ts` existente, sem criar um novo arquivo
- NÃO DEVE alterar nenhuma interface já existente no arquivo (ex.: `CategorySummary`)
- DEVE ser uma `export interface` (não `type`) para consistência com as demais interfaces do arquivo
</requirements>

## Subtasks

- [x] 1.1 Ler `lib/types.ts` e identificar onde inserir a nova interface sem quebrar a estrutura existente
- [x] 1.2 Adicionar a interface `ProductNavItem` exportada com `name` e `slug`
- [x] 1.3 Verificar que o arquivo continua compilando sem erros (`tsc --noEmit`)

## Implementation Details

Modificar `lib/types.ts` inserindo a nova interface. Veja a seção "Core Interfaces" do TechSpec para a definição exata.

O arquivo já contém `CategorySummary` — inserir `ProductNavItem` logo após, mantendo agrupamento semântico.

### Relevant Files

- `lib/types.ts` — arquivo a ser modificado; já exporta `CategorySummary` e outros tipos centrais

### Dependent Files

- `lib/nav-data.ts` (task_02) — usará `ProductNavItem` como tipo de retorno de `getProductsForNav()`
- `components/layout/ProductsDropdown.tsx` (task_05) — props tipadas com `ProductNavItem[]`
- `components/layout/MobileMenu.tsx` (task_06) — props tipadas com `ProductNavItem[]`

### Related ADRs

Nenhum ADR diretamente associado a esta tarefa.

## Deliverables

- `lib/types.ts` atualizado com `ProductNavItem` exportada
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Verificação de compilação TypeScript limpa **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Importar `ProductNavItem` de `lib/types.ts` em um arquivo de teste compila sem erro TypeScript
  - [ ] Objeto `{ name: 'Parafuso', slug: 'parafuso' }` satisfaz `ProductNavItem` sem cast
  - [ ] Objeto sem `slug` falha na verificação de tipos (teste de tipo negativo com `@ts-expect-error`)
- Testes de integração:
  - [ ] `tsc --noEmit` na raiz do projeto retorna exit code 0 após a alteração
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `ProductNavItem` importável de `lib/types.ts` sem erros de compilação
- Nenhuma interface existente em `lib/types.ts` foi alterada ou removida
