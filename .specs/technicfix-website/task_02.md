---
status: completed
title: Schema Prisma + migrations + seed do AdminUser
type: backend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Schema Prisma + migrations + seed do AdminUser

## Overview

Define o schema completo do banco de dados no Prisma, executa a migration inicial e cria o script de seed que popula o `AdminUser` inicial. Esta tarefa estabelece toda a estrutura de dados do projeto — sem ela, nenhuma outra tarefa pode persistir ou ler dados.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE implementar o schema Prisma exatamente conforme definido na seção "Data Models" do TechSpec: modelos `Category`, `Product`, `Lead`, `Banner`, `SiteConfig` e `AdminUser`
- DEVE usar os enums `ProductStatus`, `LeadType` e `LeadStatus` definidos no TechSpec
- DEVE criar `lib/prisma.ts` com instância singleton do Prisma Client (evitar múltiplas instâncias em dev com hot reload)
- DEVE criar `prisma/seed.ts` que cria um `AdminUser` com e-mail e senha configuráveis via variáveis de ambiente, com hash bcrypt
- O campo `SiteConfig` DEVE usar `id: "singleton"` para garantir registro único
- DEVE criar a migration inicial com `prisma migrate dev --name init`
- O seed DEVE ser idempotente (executar duas vezes não duplica dados)
- DEVE instalar `bcryptjs` e `@types/bcryptjs`
</requirements>

## Subtasks

- [x] 2.1 Escrever o schema completo em `prisma/schema.prisma` conforme a seção "Data Models" do TechSpec
- [x] 2.2 Criar `lib/prisma.ts` com padrão singleton para o Prisma Client
- [x] 2.3 Criar `prisma/seed.ts` com criação idempotente do `AdminUser` (upsert por e-mail) e do `SiteConfig` singleton
- [x] 2.4 Configurar `package.json` com `"prisma": { "seed": "tsx prisma/seed.ts" }`
- [ ] 2.5 Executar `prisma migrate dev --name init` para gerar a migration inicial (requer banco configurado — não executado no CI)
- [ ] 2.6 Executar `npx prisma db seed` e confirmar que o AdminUser foi criado (requer banco configurado — não executado no CI)

## Implementation Details

Referencie a seção "Data Models" do TechSpec para o schema Prisma completo — não reproduza o schema aqui.

O singleton do Prisma Client em `lib/prisma.ts` usa `globalThis` para evitar múltiplas instâncias durante o hot reload do Next.js em desenvolvimento.

O seed deve ler `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` das variáveis de ambiente, com fallback para valores de desenvolvimento (`admin@technicfix.com.br` / `admin123`). Em produção, essas variáveis DEVEM ser definidas no Vercel antes do primeiro deploy.

### Relevant Files

- `prisma/schema.prisma` — schema completo do banco
- `prisma/seed.ts` — script de seed
- `lib/prisma.ts` — singleton do Prisma Client
- `package.json` — configuração do script de seed

### Dependent Files

- Todas as tasks que fazem queries ao banco dependem de `lib/prisma.ts`
- `task_03` (Auth.js) usa `AdminUser` para autenticação
- `task_05` até `task_14` (todas as features) dependem dos modelos definidos aqui

### Related ADRs

- [ADR-002: Banco de Dados — PostgreSQL + Prisma](adrs/adr-002.md) — detalha configuração do Neon e variáveis de conexão

## Deliverables

- `prisma/schema.prisma` com todos os modelos e enums
- Migration inicial aplicada no banco
- `lib/prisma.ts` com singleton
- `prisma/seed.ts` idempotente
- AdminUser criado no banco após seed
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração para queries básicas **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `prisma/seed.ts` executado duas vezes não duplica o `AdminUser` (upsert idempotente)
  - [ ] Hash de senha gerado pelo seed não é igual ao texto plano (bcrypt aplicado)
  - [ ] `SiteConfig` singleton criado com `id: "singleton"` após seed
- Testes de integração:
  - [ ] `db.adminUser.findFirst()` retorna o usuário criado pelo seed
  - [ ] `db.product.create()` e `db.product.findMany()` funcionam com schema validado
  - [ ] `db.lead.create()` com `type: 'varejo'` persiste e retorna com status `novo`
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `npx prisma migrate dev` retorna sem erros
- `npx prisma db seed` retorna sem erros e AdminUser existe no banco
- `npx prisma studio` mostra todos os modelos com a estrutura correta
