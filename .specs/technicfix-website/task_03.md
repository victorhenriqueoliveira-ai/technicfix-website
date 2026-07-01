---
status: pending
title: "Auth.js v5: configuração, middleware de rotas e página de login"
type: backend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 03: Auth.js v5 — autenticação do admin

## Overview

Configura o Auth.js v5 com o provider Credentials (e-mail + senha + bcrypt), cria o middleware que protege todas as rotas `/admin/*` exceto `/admin/login`, e implementa a página de login do painel. Sem esta tarefa, nenhuma rota do admin pode ser acessada com segurança.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE usar Auth.js v5 (`next-auth@beta`) com `CredentialsProvider`
- DEVE verificar a senha usando `bcryptjs.compare` contra o hash armazenado no `AdminUser`
- DEVE usar sessão JWT (não database sessions) com `maxAge: 8 * 60 * 60` (8 horas)
- DEVE criar `middleware.ts` na raiz do projeto com matcher para `/admin/:path*`, excluindo `/admin/login`
- DEVE redirecionar para `/admin/login` quando não autenticado e para `/admin` quando já autenticado tentando acessar `/admin/login`
- DEVE criar `auth.ts` na raiz com a configuração do Auth.js exportando `{ handlers, auth, signIn, signOut }`
- DEVE criar `app/api/auth/[...nextauth]/route.ts` com os handlers GET e POST
- A página de login DEVE exibir mensagem de erro clara quando as credenciais forem inválidas
- DEVE usar a variável `AUTH_SECRET` para assinar os tokens JWT
</requirements>

## Subtasks

- [ ] 3.1 Instalar `next-auth@beta` e criar `auth.ts` com `CredentialsProvider` validando contra `AdminUser` no banco
- [ ] 3.2 Criar `app/api/auth/[...nextauth]/route.ts` expondo os handlers do Auth.js
- [ ] 3.3 Criar `middleware.ts` com matcher para `/admin/:path*` (exceto `/admin/login`) e lógica de redirect bidirecional
- [ ] 3.4 Criar `app/admin/login/page.tsx` com formulário (e-mail + senha) e exibição de erro de autenticação
- [ ] 3.5 Testar fluxo completo: login com credenciais válidas redireciona para `/admin`; inválidas mostram erro; acesso direto a `/admin/produtos` sem sessão redireciona para `/admin/login`

## Implementation Details

Referencie as seções "Integration Points — Auth.js v5" e "ADR-004" do TechSpec para configuração detalhada.

O `middleware.ts` deve usar a função `auth` exportada do `auth.ts` para verificar a sessão sem consultar o banco a cada request — o JWT é verificado via `AUTH_SECRET`.

A página de login usa um `<form>` com Server Action que chama `signIn('credentials', ...)` — não `useFormState` no MVP.

### Relevant Files

- `auth.ts` — configuração central do Auth.js
- `middleware.ts` — proteção de rotas
- `app/api/auth/[...nextauth]/route.ts` — handlers HTTP do Auth.js
- `app/admin/login/page.tsx` — página de login
- `lib/prisma.ts` — usado para buscar o `AdminUser` no Credentials provider

### Dependent Files

- `task_09` (admin layout) depende desta task para verificar sessão no layout
- Todas as tasks de admin (10–14) dependem indiretamente desta proteção de rota

### Related ADRs

- [ADR-004: Autenticação Admin — Auth.js v5](adrs/adr-004.md) — decisão completa de autenticação

## Deliverables

- `auth.ts` configurado com Credentials provider
- `middleware.ts` protegendo `/admin/*`
- `app/api/auth/[...nextauth]/route.ts`
- `app/admin/login/page.tsx` funcional
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração do fluxo de autenticação **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Credentials provider retorna `null` quando a senha não confere com o hash bcrypt
  - [ ] Credentials provider retorna o objeto de usuário quando e-mail e senha são válidos
  - [ ] Credentials provider retorna `null` quando o e-mail não existe no banco
- Testes de integração:
  - [ ] GET `/admin/produtos` sem sessão retorna redirect 302 para `/admin/login`
  - [ ] POST para `/admin/login` com credenciais válidas cria sessão e redireciona para `/admin`
  - [ ] POST para `/admin/login` com senha errada permanece em `/admin/login` com mensagem de erro
  - [ ] GET `/admin/login` com sessão ativa redireciona para `/admin`
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Rotas `/admin/*` inacessíveis sem sessão (retornam redirect, não 200)
- Login funcional com o AdminUser criado pelo seed da task 02
- Logout invalida a sessão e redireciona para `/admin/login`
