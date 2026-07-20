---
status: completed
title: Retry automático no Resend em actions/leads.ts
type: backend
complexity: low
dependencies:
  - task_02
---

# Task 03: Retry automático no Resend em `actions/leads.ts`

## Overview

Substitui o `console.error` silencioso de falha de email por um helper de retry com backoff exponencial (3 tentativas, delays 1s/2s). O lead continua sendo salvo independentemente do resultado; o retry ocorre de forma assíncrona sem bloquear a resposta ao visitante.

<critical>
- SEMPRE LEIA o PRD (F2) e o TechSpec (seção "Integration Points" e "Core Interfaces") antes de começar
- REFERENCIE O TECHSPEC para o código exato do helper `sendEmailWithRetry`
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `sendEmailWithRetry` DEVE tentar o envio até 3 vezes em caso de exceção do Resend
- O delay entre tentativas DEVE ser exponencial: 1000ms antes da tentativa 2, 2000ms antes da tentativa 3
- Após esgotar as 3 tentativas, DEVE logar `{ event: 'resend_exhausted', leadId, error }` via `console.error`
- Cada tentativa fracassada (exceto a última) DEVE logar `{ event: 'resend_retry', attempt: N, leadId }` via `console.error`
- O retry DEVE ser chamado de forma não-bloqueante (fire-and-forget) para não atrasar a resposta ao visitante
- NÃO retentar quando o Resend retornar status 2xx — somente em caso de exceção
- O lead DEVE ser salvo no banco antes de qualquer tentativa de envio de email
</requirements>

## Subtasks

- [x] 3.1 Criar a função `sendEmailWithRetry` como helper interno em `actions/leads.ts` (ver TechSpec "Core Interfaces")
- [x] 3.2 Substituir o bloco `try/catch` ou `.catch()` de envio de email por chamada a `sendEmailWithRetry` sem `await`
- [x] 3.3 Incluir `leadId` no payload de log para rastreabilidade
- [x] 3.4 Verificar que `db.lead.create` ocorre antes de qualquer envio de email no fluxo
- [x] 3.5 Testar manualmente desligando o serviço Resend e confirmando que o lead é salvo e o log aparece após 3 tentativas

## Implementation Details

O arquivo `actions/leads.ts` atualmente:
- Valida `leadSchema`, persiste o lead, e em seguida tenta enviar email via `resend.emails.send()`
- Verifica `if (env.RESEND_API_KEY && config.contactEmail)` antes de tentar o envio (após task_02)

O helper `sendEmailWithRetry` deve ser inserido como função interna (não exportada) neste mesmo arquivo. Ver TechSpec seção "Core Interfaces" para o código exato do helper.

O tipo `EmailPayload` pode ser tipado como `Parameters<typeof resend.emails.send>[0]` para evitar definição duplicada.

### Relevant Files

- `actions/leads.ts` — arquivo a modificar; contém `submitLead` Server Action
- `lib/env.ts` — fonte de `env.RESEND_API_KEY` (disponível após task_01+task_02)

### Dependent Files

- Nenhum arquivo downstream depende de `sendEmailWithRetry`

### Related ADRs

Nenhum ADR específico para esta task. Ver TechSpec seção "Integration Points — Resend" para decisões de retry.

## Deliverables

- `actions/leads.ts` com helper `sendEmailWithRetry` implementado
- Chamada fire-and-forget substituindo o envio direto anterior
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `sendEmailWithRetry` com Resend mockado para sucesso na 1ª tentativa: não retenta, nenhum log de erro emitido
  - [ ] `sendEmailWithRetry` com Resend mockado para falha nas 3 tentativas: emite log `resend_retry` nas tentativas 1 e 2, emite log `resend_exhausted` na tentativa 3
  - [ ] `sendEmailWithRetry` com Resend mockado para falha nas 2 primeiras e sucesso na 3ª: retorna sem log `resend_exhausted`
  - [ ] Delays entre tentativas: mock de `setTimeout` confirma delays de 1000ms e 2000ms
  - [ ] `submitLead` persiste o lead no banco mesmo quando todas as 3 tentativas de email falham
- Testes de integração:
  - [ ] Submissão de lead com `RESEND_API_KEY` válida: lead salvo + email enviado sem erros
  - [ ] Submissão de lead com Resend retornando erro HTTP: lead salvo + log de exhausted após 3 tentativas
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Lead é sempre salvo no banco independente do resultado do email
- Em caso de falha do Resend, o log estruturado aparece no terminal após 3 tentativas (~3s de delay total)
- A resposta ao visitante não é atrasada pelo retry (operação fire-and-forget confirmada)
