---
status: completed
title: Adicionar overflow-x-auto nas tabelas admin de produtos
type: frontend
complexity: low
dependencies: []
---

# Task 08: Adicionar `overflow-x-auto` nas tabelas admin de produtos

## Overview

Envolve a tabela da página `/admin/produtos` em um container `<div className="overflow-x-auto">` para permitir scroll horizontal em telas menores que 768px. Nota: a página `/admin/categorias` foi excluída do git (`D` no git status) e não requer alteração.

<critical>
- SEMPRE LEIA o PRD (F7) e o TechSpec (seção "Impact Analysis") antes de começar
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- O elemento `<table>` em `app/(admin)/admin/produtos/page.tsx` DEVE ser envolvido por `<div className="overflow-x-auto">`
- Em viewport de 375px (mobile), todas as colunas da tabela (Nome, Categoria, SKU, Estoque, Status, Destaque, Ações) DEVEM ser acessíveis via scroll horizontal
- Nenhuma coluna DEVE ser cortada ou ocultada por padrão em nenhum viewport
- O comportamento da tabela em desktop (>= 1024px) DEVE permanecer idêntico — sem scroll horizontal desnecessário
- `app/(admin)/admin/categorias/page.tsx` NÃO deve ser modificado (arquivo excluído do repositório)
</requirements>

## Subtasks

- [x] 8.1 Localizar o elemento `<table>` em `app/(admin)/admin/produtos/page.tsx`
- [x] 8.2 Envolver o `<table>` em `<div className="overflow-x-auto">`
- [x] 8.3 Verificar em viewport 375px que todas as colunas são acessíveis via scroll horizontal
- [x] 8.4 Verificar em viewport desktop que o layout não foi alterado

## Implementation Details

A tabela de produtos tem 7 colunas: Nome, Categoria, SKU, Estoque, Status, Destaque, Ações. A página usa `searchParams` como `Promise<{...}>`, paginação de 20 itens por página, e filtros via form GET nativo.

A mudança é mínima: apenas adicionar um `<div>` wrapper — nenhuma lógica, nenhuma query, nenhum componente novo.

### Relevant Files

- `app/(admin)/admin/produtos/page.tsx` — único arquivo a modificar

### Dependent Files

Nenhum arquivo downstream depende da estrutura da tabela.

### Related ADRs

Nenhum ADR se aplica a esta task.

## Deliverables

- `app/(admin)/admin/produtos/page.tsx` com `<table>` envolvida em `<div className="overflow-x-auto">`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `app/(admin)/admin/produtos/page.tsx` renderiza um elemento `<div>` com classe `overflow-x-auto` contendo o `<table>`
  - [ ] O `<table>` é filho direto do `<div className="overflow-x-auto">`
- Testes de integração:
  - [ ] Em viewport 375px, a tabela de produtos não apresenta conteúdo cortado (todas as 7 colunas visíveis via scroll)
  - [ ] Em viewport 1280px, a tabela de produtos ocupa a largura disponível normalmente sem scroll horizontal
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Em dispositivo mobile real ou DevTools em 375px, todas as colunas são acessíveis
- Build sem erros TypeScript
