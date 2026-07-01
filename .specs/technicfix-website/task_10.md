---
status: pending
title: Admin — CRUD de categorias
type: frontend
complexity: medium
dependencies:
  - task_09
---

# Task 10: Admin — CRUD de categorias

## Overview

Implementa o gerenciamento completo de categorias no painel admin: listagem, criação, edição e exclusão. As categorias alimentam os filtros do catálogo público e o dropdown de categoria no formulário de produto (task 11). É uma task de baixa dependência que desbloqueia a task 11.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/categorias/page.tsx` com tabela listando todas as categorias (nome, slug, número de produtos, ações)
- DEVE criar `actions/categories.ts` com Server Actions: `createCategory`, `updateCategory`, `deleteCategory`
- DEVE criar `components/admin/categories/CategoryForm.tsx` com campos: nome (gera slug automaticamente), imagem (URL por ora — upload de imagem virá como melhoria futura)
- O slug DEVE ser gerado automaticamente a partir do nome (lowercase, sem acentos, hífens em vez de espaços) mas editável pelo admin
- A exclusão de categoria com produtos associados DEVE ser bloqueada com mensagem de erro clara
- As Server Actions DEVEM fazer `revalidatePath` das rotas relevantes após mutações
- DEVE criar a função utilitária `lib/utils/slugify.ts` se não existir
</requirements>

## Subtasks

- [ ] 10.1 Criar `actions/categories.ts` com `createCategory`, `updateCategory`, `deleteCategory` (com validação Zod básica)
- [ ] 10.2 Criar `app/admin/categorias/page.tsx` com tabela de categorias e botões de ação
- [ ] 10.3 Criar `components/admin/categories/CategoryForm.tsx` com campos nome e slug (slug gerado automaticamente)
- [ ] 10.4 Implementar dialog de confirmação de exclusão (usando AlertDialog do shadcn/ui)
- [ ] 10.5 Verificar que exclusão de categoria com produtos associados retorna erro descritivo

## Implementation Details

Referencie a seção "API Endpoints — Server Actions" do TechSpec para o padrão de mutação.

`deleteCategory` verifica `_count.products` antes de excluir. Se houver produtos vinculados, retorna `{ success: false, error: 'Categoria possui X produtos. Remova ou mova os produtos antes de excluir.' }`.

`createCategory` e `updateCategory` fazem `revalidatePath('/produtos')` e `revalidatePath('/admin/categorias')` para atualizar o cache do catálogo público.

`lib/utils/slugify.ts` usa normalização Unicode (NFD + remoção de diacríticos) para gerar slugs corretos com caracteres PT-BR.

### Relevant Files

- `app/admin/categorias/page.tsx`
- `actions/categories.ts`
- `components/admin/categories/CategoryForm.tsx`
- `lib/utils/slugify.ts`
- `lib/prisma.ts`

### Dependent Files

- `task_11` (admin de produtos) usa o dropdown de categorias
- `task_06` (catálogo) é revalidado quando categorias são criadas/editadas

### Related ADRs

Nenhum ADR específico para CRUD de categorias.

## Deliverables

- `app/admin/categorias/page.tsx`
- `actions/categories.ts`
- `components/admin/categories/CategoryForm.tsx`
- `lib/utils/slugify.ts`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração das Server Actions **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `slugify('Parafuso M8 Inox')` retorna `'parafuso-m8-inox'`
  - [ ] `slugify('Fixação & Âncoras')` retorna `'fixacao-ancoras'`
  - [ ] `CategoryForm` gera slug automaticamente ao digitar o nome
  - [ ] `CategoryForm` permite edição manual do slug após geração automática
- Testes de integração:
  - [ ] `createCategory({ name: 'Parafusos', slug: 'parafusos' })` cria categoria no banco
  - [ ] `createCategory` com slug duplicado retorna erro sem criar categoria
  - [ ] `updateCategory` atualiza nome e slug corretamente
  - [ ] `deleteCategory` com produtos associados retorna `success: false` sem excluir
  - [ ] `deleteCategory` sem produtos associados remove a categoria do banco
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- CRUD completo funciona via painel admin
- Slugs únicos são garantidos pelo banco (constraint unique)
- Exclusão segura: categorias com produtos não podem ser excluídas
