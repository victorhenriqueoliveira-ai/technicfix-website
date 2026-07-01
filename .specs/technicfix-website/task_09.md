---
status: completed
title: "Admin: layout, sidebar, header e dashboard com métricas"
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_03
---

# Task 09: Admin — layout, sidebar e dashboard

## Overview

Implementa a estrutura visual do painel administrativo: layout com sidebar de navegação, header com botão de logout e a página de dashboard com métricas resumidas (total de leads novos, produtos cadastrados e categorias ativas). Esta task é a base para todas as páginas do admin (tasks 10–14).

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/layout.tsx` que verifica a sessão via `auth()` do Auth.js e redireciona para `/admin/login` se ausente
- DEVE criar `components/admin/Sidebar.tsx` com links de navegação: Dashboard, Produtos, Categorias, Banners, Leads, Configurações
- DEVE criar `components/admin/AdminHeader.tsx` com nome do usuário logado e botão de logout (chama `signOut`)
- DEVE criar `app/admin/page.tsx` como Server Component que busca do banco: count de leads com `status: 'novo'`, count total de produtos ativos, count de categorias ativas
- O dashboard DEVE exibir esses 3 contadores em cards de resumo
- A sidebar DEVE destacar o link ativo com base no pathname atual
- O layout DEVE ser responsivo: sidebar como drawer em mobile, fixa em desktop
</requirements>

## Subtasks

- [x] 9.1 Criar `app/admin/layout.tsx` com verificação de sessão e import de Sidebar + AdminHeader
- [x] 9.2 Criar `components/admin/Sidebar.tsx` com navegação e highlight de link ativo
- [x] 9.3 Criar `components/admin/AdminHeader.tsx` com nome do usuário e botão de logout
- [x] 9.4 Criar `app/admin/page.tsx` com queries paralelas para as 3 métricas do dashboard
- [x] 9.5 Criar componente `components/admin/MetricCard.tsx` para os cards de resumo do dashboard

## Implementation Details

Referencie a seção "System Architecture" do TechSpec para o padrão de verificação de sessão no layout.

`app/admin/layout.tsx` usa `const session = await auth()` e faz `redirect('/admin/login')` se `session` for `null`. Esta verificação é redundante com o middleware mas funciona como segunda camada de segurança.

`app/admin/page.tsx` usa `Promise.all` para buscar as 3 métricas em paralelo com Prisma.

### Relevant Files

- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `components/admin/Sidebar.tsx`
- `components/admin/AdminHeader.tsx`
- `components/admin/MetricCard.tsx`
- `auth.ts` — importa `auth()` para verificação de sessão
- `lib/prisma.ts` — queries de métricas

### Dependent Files

- Todas as tasks de admin (10–14) dependem deste layout

### Related ADRs

- [ADR-004: Autenticação Admin — Auth.js v5](adrs/adr-004.md) — uso de `auth()` no layout

## Deliverables

- `app/admin/layout.tsx` com proteção de sessão
- `app/admin/page.tsx` com dashboard de métricas
- `components/admin/Sidebar.tsx`
- `components/admin/AdminHeader.tsx`
- `components/admin/MetricCard.tsx`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração do layout admin **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `Sidebar` renderiza todos os 6 links de navegação
  - [x] `Sidebar` aplica classe de ativo ao link correspondente ao pathname atual
  - [x] `MetricCard` renderiza título e valor numérico passados como props
  - [x] `AdminHeader` renderiza o e-mail do usuário da sessão
- Testes de integração:
  - [x] GET `/admin` sem sessão retorna redirect 302 para `/admin/login`
  - [x] GET `/admin` com sessão válida retorna 200 com os 3 cards de métrica no HTML
  - [x] Dashboard mostra 0 leads novos quando o banco está vazio
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Painel admin inacessível sem sessão
- Dashboard carrega métricas reais do banco
- Sidebar responsiva: drawer em mobile, fixa em desktop
