---
status: completed
title: "Admin: gestão de leads — listagem, filtros, detalhe, status e notas"
type: frontend
complexity: medium
dependencies:
  - task_07
  - task_09
---

# Task 13: Admin — gestão de leads

## Overview

Implementa o painel de visualização e gerenciamento de leads recebidos: listagem com filtros por tipo (varejo/atacado/geral) e status, página de detalhe de cada lead, atualização de status e campo de anotações internas. Esta é a interface principal de trabalho do dono para converter leads em clientes.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/leads/page.tsx` com tabela de leads (nome, tipo, produto, status, data) e filtros por tipo e status via query params
- DEVE criar `app/admin/leads/[id]/page.tsx` com todos os dados do lead e formulários inline para atualizar status e notas
- DEVE criar `actions/leads-admin.ts` com `updateLeadStatus(id, status)` e `updateLeadNotes(id, notes)`
- A tabela de listagem DEVE ter badge colorido por status: Novo (azul), Em Atendimento (amarelo), Convertido (verde), Perdido (vermelho)
- O detalhe do lead DEVE mostrar: tipo de lead, todos os campos preenchidos, produto associado (com link para o produto), data de criação e histórico de status
- A atualização de status DEVE fazer `revalidatePath` da listagem e do detalhe
- A listagem DEVE ser paginada (20 leads por página) e ordenada por data de criação decrescente
</requirements>

## Subtasks

- [x] 13.1 Criar `actions/leads-admin.ts` com `updateLeadStatus` e `updateLeadNotes`
- [x] 13.2 Criar `app/admin/leads/page.tsx` com tabela paginada, filtros por tipo e status
- [x] 13.3 Criar componente de badge de status com cores por valor
- [x] 13.4 Criar `app/admin/leads/[id]/page.tsx` com dados completos e formulários de atualização

## Implementation Details

Referencie a seção "Features Principais — Painel Administrativo (Leads)" do PRD.

`app/admin/leads/page.tsx` recebe `searchParams` e usa `where` dinâmico no Prisma: `{ type: searchParams.tipo, status: searchParams.status }` (omite o filtro quando o valor for `'todos'` ou ausente).

`app/admin/leads/[id]/page.tsx` inclui `product: { select: { name: true, slug: true } }` no `include` do Prisma para exibir o produto associado com link clicável.

`updateLeadStatus` e `updateLeadNotes` são Server Actions separadas para minimizar o payload e a superfície de mutação.

### Relevant Files

- `app/admin/leads/page.tsx`
- `app/admin/leads/[id]/page.tsx`
- `actions/leads-admin.ts`
- `lib/prisma.ts`
- `lib/types.ts` — tipos `LeadStatus`, `LeadType`

### Dependent Files

- `task_09` (dashboard) usa count de leads com `status: 'novo'` — refletirá automaticamente após atualização

### Related ADRs

Nenhum ADR específico para gestão de leads.

## Deliverables

- `app/admin/leads/page.tsx` com tabela, filtros e paginação
- `app/admin/leads/[id]/page.tsx` com detalhe completo e atualização inline
- `actions/leads-admin.ts`
- Badge de status com cores
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Badge de status renderiza cor azul para `novo`, amarela para `em_atendimento`, verde para `convertido`, vermelha para `perdido`
  - [ ] Tabela de leads renderiza filtro de tipo com opção "Todos" selecionada por padrão
- Testes de integração:
  - [ ] GET `/admin/leads` com sessão retorna 200 e lista leads ordenados por `createdAt DESC`
  - [ ] GET `/admin/leads?tipo=atacado` retorna apenas leads com `type: 'atacado'`
  - [ ] GET `/admin/leads?status=novo` retorna apenas leads com `status: 'novo'`
  - [ ] `updateLeadStatus(id, 'convertido')` atualiza o status no banco e revalida as rotas
  - [ ] `updateLeadNotes(id, 'Ligou dia 05')` salva a anotação no campo `notes`
  - [ ] GET `/admin/leads/id-inexistente` retorna 404
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Filtros por tipo e status funcionam individualmente e combinados
- Atualização de status reflete imediatamente na listagem
- Anotações internas são salvas e visíveis no detalhe do lead
