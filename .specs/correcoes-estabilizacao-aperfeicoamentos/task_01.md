---
status: completed
title: Criar lib/env.ts + app/instrumentation.ts
type: infra
complexity: medium
dependencies: []
---

# Task 01: Criar `lib/env.ts` + `app/instrumentation.ts`

## Overview

Cria o módulo centralizado de validação de variáveis de ambiente usando Zod e registra o hook de boot do Next.js 15 que força essa validação antes de qualquer rota ser aceita. Esta task desbloqueia as tasks 02, 12 e 13, que dependem do objeto `env` tipado.

<critical>
- SEMPRE LEIA o PRD (F1) e o TechSpec (seção "Core Interfaces" e ADR-002) antes de começar
- REFERENCIE O TECHSPEC para o schema Zod exato e o fluxo de dados de boot
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `lib/env.ts` DEVE validar todas as variáveis listadas no TechSpec (seção "Core Interfaces") usando `z.safeParse(process.env)`
- Se qualquer variável obrigatória estiver ausente ou inválida, DEVE lançar `Error` com mensagem descritiva e logar `parsed.error.flatten().fieldErrors` antes de lançar
- `lib/env.ts` DEVE exportar `env` (objeto tipado) e `Env` (tipo inferido do schema)
- `app/instrumentation.ts` DEVE exportar `register()` que importa `../lib/env` somente quando `process.env.NEXT_RUNTIME === 'nodejs'`
- Variáveis `NEXT_PUBLIC_*` DEVEM constar no schema para validação server-side, mas não devem ser importadas via `env` em Client Components
- `next.config.ts` NÃO precisa de alteração (hook habilitado por padrão no Next.js 15)
</requirements>

## Subtasks

- [x] 1.1 Verificar todas as variáveis de ambiente atualmente usadas no codebase (`grep -r "process.env\." --include="*.ts" --include="*.tsx"`) para garantir que o schema cobre todas
- [x] 1.2 Criar `lib/env.ts` com schema Zod conforme TechSpec seção "Core Interfaces"
- [x] 1.3 Criar `app/instrumentation.ts` com guard `NEXT_RUNTIME === 'nodejs'`
- [x] 1.4 Verificar que o servidor sobe normalmente com todas as vars presentes
- [x] 1.5 Verificar que o servidor falha com mensagem descritiva ao remover uma var obrigatória do `.env`

## Implementation Details

Dois arquivos novos a criar. Ver TechSpec seção "Core Interfaces" para o schema Zod exato e seção "System Architecture" para o fluxo de dados de boot.

O `next.config.ts` atual contém apenas `images.remotePatterns` — sem `experimental` ou `instrumentationHook` — o hook já está habilitado por padrão.

### Relevant Files

- `lib/env.ts` — arquivo novo a criar (não existe)
- `app/instrumentation.ts` — arquivo novo a criar (não existe)
- `next.config.ts` — verificar ausência de `instrumentationHook: false`
- `.env` / `.env.local` — referência para listar todas as vars existentes

### Dependent Files

- `actions/products.ts` — usa `process.env.R2_*` (migrado em task_02)
- `actions/leads.ts` — usa `process.env.RESEND_API_KEY` (migrado em task_02)
- `app/sitemap.ts` — usa `process.env.NEXT_PUBLIC_SITE_URL` (migrado em task_02)
- `components/layout/Header.tsx` — usa `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` (migrado em task_02)

### Related ADRs

- [ADR-002: Validação de env vars via instrumentation.ts + lib/env.ts](adrs/adr-002.md) — define a escolha de `instrumentation.ts` sobre `next.config.ts` e as razões para validação no boot

## Deliverables

- `lib/env.ts` criado com schema Zod completo e export de `env` e `Env`
- `app/instrumentation.ts` criado com guard de runtime
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Verificação manual: servidor não sobe com var ausente, sobe normalmente com todas presentes

## Tests

- Testes unitários:
  - [x] `safeParse` com todas as vars presentes retorna objeto com todos os campos tipados corretamente
  - [x] `safeParse` com `DATABASE_URL` ausente lança `Error` contendo o nome da variável no log
  - [x] `safeParse` com `RESEND_API_KEY` vazia (string vazia) lança `Error` (schema usa `min(1)`)
  - [x] `safeParse` com `NEXT_PUBLIC_SITE_URL` com valor que não é URL lança `Error`
  - [x] `env` exportado é o mesmo objeto retornado por `schema.parse(process.env)` quando válido
- Testes de integração:
  - [ ] Servidor Next.js sobe sem erros quando todas as vars do schema estão definidas no ambiente
  - [ ] Servidor Next.js falha com mensagem `[Technicfix] Configuração de ambiente incompleta` quando uma var crítica é removida
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `lib/env.ts` e `app/instrumentation.ts` existem e passam em TypeScript sem erros (`tsc --noEmit`)
- Remover qualquer var do `.env.local` impede o servidor de aceitar tráfego e exibe mensagem descritiva no log
