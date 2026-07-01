---
status: completed
title: "Setup do projeto: Next.js, Tailwind, shadcn/ui, Prisma, variáveis de ambiente"
type: infra
complexity: low
dependencies: []
---

# Task 01: Setup do projeto

## Overview

Inicializa o repositório com toda a infraestrutura de desenvolvimento: Next.js 15 com App Router, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM e as variáveis de ambiente necessárias. Esta tarefa não produz nenhuma página visível, mas é a base bloqueante para todas as demais tarefas.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE usar Next.js 15 com App Router (sem Pages Router)
- DEVE configurar TypeScript em modo strict
- DEVE configurar Tailwind CSS com o plugin de tipografia
- DEVE instalar e inicializar shadcn/ui com tema "default" e modo CSS variables
- DEVE instalar Prisma CLI e `@prisma/client` com provider `postgresql`
- DEVE criar `.env.example` com todas as variáveis necessárias documentadas (sem valores reais)
- DEVE criar `.env.local` (git-ignored) para desenvolvimento local
- DEVE configurar `@` como alias de importação para `./src` ou raiz do projeto
- DEVE criar a estrutura de pastas base conforme o TechSpec (seção "Estrutura de Rotas")
- DEVE instalar `@neondatabase/serverless` para connection pooling serverless
</requirements>

## Subtasks

- [x] 1.1 Inicializar projeto com `create-next-app` (TypeScript, Tailwind, App Router, sem src/, com alias `@`)
- [x] 1.2 Instalar e inicializar shadcn/ui (`npx shadcn@latest init`)
- [x] 1.3 Instalar Prisma, `@prisma/client` e `@neondatabase/serverless`; inicializar com `npx prisma init`
- [x] 1.4 Criar `.env.example` com todas as variáveis: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [x] 1.5 Criar estrutura de pastas vazia conforme TechSpec: `app/(public)/`, `app/admin/`, `app/api/`, `lib/`, `actions/`, `components/`
- [x] 1.6 Criar `lib/types.ts` com os tipos centrais definidos na seção "Core Interfaces" do TechSpec

## Implementation Details

Referencie a seção "System Architecture" e "Core Interfaces" do TechSpec para a estrutura de pastas e tipos base.

A estrutura de grupos de rotas `(public)` e `admin` deve ser criada vazia agora para que as tarefas subsequentes adicionem apenas seus próprios arquivos sem conflito.

O `lib/types.ts` exporta `LeadType`, `LeadStatus`, `ProductStatus`, `ProductSummary`, `LeadPayload` e `SiteConfig` conforme definido no TechSpec.

### Relevant Files

- `package.json` — dependências do projeto
- `next.config.ts` — configuração base do Next.js (remotePatterns do R2 virá na task 16)
- `tailwind.config.ts` — configuração do Tailwind
- `tsconfig.json` — configuração TypeScript strict
- `prisma/schema.prisma` — arquivo de schema criado pelo `prisma init` (schema completo vem na task 02)
- `lib/types.ts` — tipos centrais compartilhados
- `.env.example` — template de variáveis de ambiente
- `components.json` — configuração do shadcn/ui

### Dependent Files

- Todas as tasks subsequentes dependem desta estrutura base

### Related ADRs

- [ADR-002: Banco de Dados — PostgreSQL + Prisma](adrs/adr-002.md) — define o uso do Prisma e variáveis de conexão
- [ADR-003: Storage de Imagens — Cloudflare R2](adrs/adr-003.md) — define as variáveis de ambiente do R2
- [ADR-004: Autenticação Admin — Auth.js v5](adrs/adr-004.md) — define a variável `AUTH_SECRET`

## Deliverables

- Projeto Next.js 15 inicializado com TypeScript e Tailwind
- shadcn/ui configurado e funcional
- Prisma inicializado (sem schema completo — vem na task 02)
- `.env.example` com todas as variáveis documentadas
- `lib/types.ts` com os tipos centrais
- Estrutura de pastas base criada
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `lib/types.ts` exporta todos os tipos esperados: `LeadType`, `LeadStatus`, `ProductStatus`, `ProductSummary`, `LeadPayload`, `SiteConfig`
  - [x] TypeScript compila sem erros (`tsc --noEmit` retorna 0)
  - [ ] `next build` completa sem erros com o projeto base vazio
- Testes de integração:
  - [ ] `next dev` sobe sem erros e a rota `/` retorna 200
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `npm run dev` sobe sem erros
- `npm run build` completa sem warnings de TypeScript
- Estrutura de pastas corresponde ao diagrama do TechSpec
