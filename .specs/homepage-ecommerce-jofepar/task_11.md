---
status: completed
title: actions/categories.ts + admin de categorias com pai/filho
type: backend
complexity: medium
dependencies:
  - task_01
---

# Task 11: actions/categories.ts + admin de categorias com pai/filho

## Overview

Atualiza `actions/categories.ts` para suportar `parentId` opcional no schema Zod de criação/edição de categoria e adiciona validação de deleção quando a categoria tem filhos. Cria ou atualiza as páginas do admin de categorias (`app/admin/categorias/`) adicionando um campo `<select>` de categoria-pai ao formulário existente. Pode ser desenvolvida em paralelo com as tasks 06–09.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE adicionar `parentId: z.string().cuid().optional().nullable()` ao schema Zod de `createCategory` e `updateCategory` em `actions/categories.ts`
- DEVE passar `parentId` ao `db.category.create` e `db.category.update` quando fornecido
- DEVE atualizar `deleteCategory` para verificar `children.length > 0` antes de deletar — retornar `{ success: false, error: 'Categoria possui subcategorias. Remova os filhos antes de deletar.' }` se tiver filhos
- DEVE criar o diretório `app/admin/categorias/` com `page.tsx` de listagem e formulário de criação/edição se não existir (verificar — a exploração indicou que não existe)
- O formulário de categoria DEVE incluir um campo `<select>` para "Categoria-pai (opcional)" carregando a lista de categorias sem parentId (raízes)
- Valor vazio no select DEVE resultar em `parentId: null` (categoria raiz)
- A UI do admin NÃO deve ser redesenhada — adicionar o campo ao formulário existente ou criar um formulário mínimo funcional seguindo o padrão visual do admin atual
- DEVE verificar o padrão das outras páginas admin (ex: `app/admin/login/`) para manter consistência
</requirements>

## Subtasks

- [x] 11.1 Adicionar `parentId` ao schema Zod em `actions/categories.ts`
- [x] 11.2 Passar `parentId` nas operações `create` e `update` do Prisma
- [x] 11.3 Atualizar `deleteCategory` para bloquear deleção com filhos
- [x] 11.4 Criar `app/admin/categorias/page.tsx` com listagem de categorias
- [x] 11.5 Criar formulário de criação/edição com o campo select de categoria-pai
- [x] 11.6 Carregar lista de categorias-raiz para o select do formulário
- [x] 11.7 Escrever testes unitários para as server actions e testes de integração do formulário

## Implementation Details

Veja as seções "actions/categories.ts (MODIFICADO)" e "app/admin/categorias/ (MODIFICADO)" do TechSpec para os detalhes de implementação.

O `actions/categories.ts` atual (117 linhas) já tem `createCategory`, `updateCategory` e `deleteCategory` com Zod — adicionar `parentId` ao schema existente sem reescrever a lógica.

O diretório `app/admin/categorias/` não existe — criá-lo do zero. Verificar os padrões visuais do admin no diretório `app/admin/` (ex: `app/admin/login/`) antes de criar o formulário.

O select de categoria-pai deve buscar apenas categorias com `parentId: null` (raízes) para evitar hierarquia de 3+ níveis (limitação explícita no ADR-002).

### Relevant Files

- `actions/categories.ts` — adicionar parentId ao Zod e bloquear deleção com filhos
- `app/admin/categorias/` — criar diretório e páginas
- `app/admin/login/` — referência visual para o padrão do admin
- `prisma/schema.prisma` — model `Category` com parentId (task_01)
- `lib/types.ts` — verificar se CategorySummary é útil aqui

### Dependent Files

Nenhuma outra task depende desta. É uma task terminal na sua cadeia.

### Related ADRs

- [ADR-002: Hierarquia de Categorias via parentId Auto-referencial](../adrs/adr-002.md) — define a limitação a 2 níveis e a validação na deleção

## Deliverables

- `actions/categories.ts` com `parentId` no Zod e validação de deleção
- `app/admin/categorias/page.tsx` com listagem e formulário com select de categoria-pai
- Testes unitários das server actions **(OBRIGATÓRIO)**
- Testes de integração do formulário admin **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `createCategory` com `parentId: "cuid_valido"`: chama `db.category.create` com `parentId` correto
  - [ ] `createCategory` sem `parentId` (omitido): chama `db.category.create` com `parentId: undefined` ou null
  - [ ] `createCategory` com `parentId: ""` (string vazia): Zod rejeita (não é cuid válido)
  - [ ] `updateCategory` com `parentId` novo: atualiza o campo corretamente
  - [ ] `deleteCategory` com categoria que tem 1 filho: retorna `{ success: false, error: '...' }` sem deletar
  - [ ] `deleteCategory` com categoria sem filhos e sem produtos: deleta com sucesso
  - [ ] `deleteCategory` com categoria com produtos: retorna erro (comportamento já existente — verificar e manter)
- Testes de integração:
  - [ ] Formulário admin: submeter com categoria-pai selecionada → categoria criada com parentId correto
  - [ ] Formulário admin: submeter sem categoria-pai → categoria criada com parentId null (raiz)
  - [ ] Select de categoria-pai exibe apenas categorias sem parentId (raízes)
  - [ ] `npx tsc --noEmit` passa após as mudanças

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `createCategory` e `updateCategory` aceitam e persistem `parentId`
- `deleteCategory` bloqueia deleção de categoria com filhos
- Admin de categorias funcional com campo de categoria-pai
- Nenhuma regressão nas actions existentes
