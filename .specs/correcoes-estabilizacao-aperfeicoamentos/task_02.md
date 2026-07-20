---
status: completed
title: Migrar process.env.* → env.* nos arquivos de servidor
type: refactor
complexity: medium
dependencies:
  - task_01
---

# Task 02: Migrar `process.env.*` → `env.*` nos arquivos de servidor

## Overview

Substitui todos os acessos diretos a `process.env.*` em código de servidor pelo objeto `env` tipado exportado de `lib/env.ts`. Elimina non-null assertions (`!`) e verificações manuais de presença de variáveis dispersas no código.

<critical>
- SEMPRE LEIA o PRD (F1) e o TechSpec (seção "Impact Analysis") antes de começar
- REFERENCIE O TECHSPEC para a lista completa de arquivos afetados
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- Todo `process.env.R2_ACCOUNT_ID`, `process.env.R2_ACCESS_KEY_ID`, `process.env.R2_SECRET_ACCESS_KEY`, `process.env.R2_BUCKET_NAME` em `actions/products.ts` DEVE ser substituído por `env.*` importado de `@/lib/env`
- O acesso a `process.env.RESEND_API_KEY` em `actions/leads.ts` DEVE ser substituído por `env.RESEND_API_KEY`
- O acesso a `process.env.NEXT_PUBLIC_SITE_URL` em `app/sitemap.ts` DEVE ser substituído por `env.NEXT_PUBLIC_SITE_URL`
- NUNCA importar `env` de `lib/env.ts` em Client Components — variáveis `NEXT_PUBLIC_*` em componentes client continuam usando `process.env.NEXT_PUBLIC_*` diretamente
- As non-null assertions (`!`) nos acessos de env var DEVEM ser removidas (o objeto `env` já garante que os valores existem via Zod)
- O comportamento funcional de todos os arquivos afetados DEVE permanecer idêntico após a migração
</requirements>

## Subtasks

- [x] 2.1 Executar `grep -rn "process\.env\." --include="*.ts" --include="*.tsx" app/ actions/ lib/ components/` para mapear todos os pontos de acesso
- [x] 2.2 Migrar `actions/products.ts` — substituir 4 vars R2 e remover non-null assertions
- [x] 2.3 Migrar `actions/leads.ts` — substituir verificação de `RESEND_API_KEY`
- [x] 2.4 Migrar `app/sitemap.ts` — substituir `NEXT_PUBLIC_SITE_URL` com fallback
- [x] 2.5 Verificar se há outros arquivos server-side com `process.env.*` não listados e migrá-los
- [x] 2.6 Confirmar que Client Components que usam `NEXT_PUBLIC_*` continuam com `process.env.NEXT_PUBLIC_*`

## Implementation Details

Pontos confirmados pela exploração do código-base:

- `actions/products.ts` usa `process.env.R2_ACCOUNT_ID`, `process.env.R2_ACCESS_KEY_ID`, `process.env.R2_SECRET_ACCESS_KEY`, `process.env.R2_BUCKET_NAME` para instanciar o S3Client em `getPresignedUploadUrl`
- `actions/leads.ts` verifica `if (process.env.RESEND_API_KEY && config.contactEmail)` antes de enviar email
- `app/sitemap.ts` usa `process.env.NEXT_PUBLIC_SITE_URL` com fallback hardcoded para `https://technicfix.com.br`
- `components/layout/Header.tsx` usa `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` — este é um Client Component ou acesso em Server Component? Verificar; se Client Component, NÃO migrar para `env`

Ver TechSpec seção "Impact Analysis" para a lista completa de arquivos afetados.

### Relevant Files

- `actions/products.ts` — 4 vars R2 com non-null assertions (linhas ~200-216)
- `actions/leads.ts` — verificação de `RESEND_API_KEY` antes do envio
- `app/sitemap.ts` — `NEXT_PUBLIC_SITE_URL` com fallback hardcoded
- `lib/env.ts` — fonte do objeto `env` tipado (criado em task_01)

### Dependent Files

- `actions/leads.ts` — task_03 (retry Resend) depende desta migração concluída
- `app/sitemap.ts` — task_12 (auditoria sitemap) opera sobre este arquivo

### Related ADRs

- [ADR-002: Validação de env vars via instrumentation.ts + lib/env.ts](adrs/adr-002.md) — contexto da decisão de migração global

## Deliverables

- `actions/products.ts` sem `process.env.R2_*` e sem non-null assertions
- `actions/leads.ts` usando `env.RESEND_API_KEY`
- `app/sitemap.ts` usando `env.NEXT_PUBLIC_SITE_URL` sem fallback hardcoded
- Todos os demais arquivos server-side migrados
- Build TypeScript sem erros (`tsc --noEmit`)
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `getPresignedUploadUrl` em `actions/products.ts` instancia S3Client com as credenciais corretas vindas de `env`
  - [ ] Nenhum `process.env.R2_*` restante em `actions/products.ts` (verificado por grep)
  - [ ] `submitLead` em `actions/leads.ts` usa `env.RESEND_API_KEY` para a condição de envio de email
- Testes de integração:
  - [ ] Upload de imagem de produto funciona end-to-end com credenciais R2 lidas de `env`
  - [ ] Submissão de lead funciona normalmente; email de notificação é disparado quando `env.RESEND_API_KEY` está presente
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `grep -rn "process\.env\." actions/ app/ lib/` retorna apenas referências em Client Components ou em `lib/env.ts` (que é o ponto de leitura legítimo)
- Build passa sem erros TypeScript após a migração
