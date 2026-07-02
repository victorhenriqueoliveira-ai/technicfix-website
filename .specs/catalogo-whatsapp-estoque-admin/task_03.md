---
status: completed
title: Notificação de lead por e-mail via Resend
type: backend
complexity: low
dependencies:
  - task_01
---

# Task 03: Notificação de lead por e-mail via Resend

## Overview

Estende a Server Action `submitLead` existente em `actions/leads.ts` para, após persistir o lead no banco, enviar um e-mail de notificação ao endereço configurado em `SiteConfig.contactEmail` usando o SDK Resend. A falha no envio do e-mail deve ser silenciosa — o lead já foi salvo e o retorno de sucesso ao usuário não deve ser bloqueado por problemas de e-mail.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE instalar o pacote `resend` como dependência do projeto.
- DEVE ler `SiteConfig.contactEmail` via `db.siteConfig.findUnique({ where: { id: 'singleton' } })` dentro de `submitLead`, após criar o lead.
- DEVE enviar e-mail via `resend.emails.send()` com: `from` fixo (`noreply@technicfix.com.br` ou domínio verificado), `to` igual a `SiteConfig.contactEmail`, `subject` com nome e tipo do lead, corpo com nome, e-mail, telefone e tipo.
- DEVE usar `RESEND_API_KEY` da variável de ambiente para inicializar o SDK Resend.
- DEVE tratar falha de envio com `.catch(() => {})` — sem lançar erro, sem alterar o retorno de `submitLead`.
- NÃO DEVE enviar e-mail se `RESEND_API_KEY` estiver ausente ou `contactEmail` estiver vazio — verificar antes de chamar o SDK.
- DEVE logar erros de envio com `console.error('[submitLead] Resend error:', err)`.
</requirements>

## Subtasks

- [x] 3.1 Instalar `resend` via `npm install resend` e verificar que não há conflitos de peer dependencies.
- [x] 3.2 Inicializar `Resend` com `process.env.RESEND_API_KEY` em `actions/leads.ts` (fora da função, nível de módulo).
- [x] 3.3 Após `db.lead.create(...)`, buscar `SiteConfig.contactEmail` e, se disponível, enviar e-mail via Resend.
- [x] 3.4 Adicionar `RESEND_API_KEY` ao `.env.example` como variável documentada (sem valor real).
- [x] 3.5 Verificar que o comportamento de `submitLead` é idêntico ao atual quando `RESEND_API_KEY` está ausente.

## Implementation Details

Ver seção "Integration Points — Resend" do TechSpec para o padrão de chamada e tratamento de erro.

O corpo mínimo do e-mail de texto plano deve conter: tipo do lead (varejo/atacado/geral), nome, e-mail e telefone. Para leads atacado, incluir empresa e CNPJ se disponíveis.

Referência do padrão atual de `submitLead` em `actions/leads.ts`: a função já retorna `{ success: boolean; error?: string }` — esse contrato não deve mudar.

### Relevant Files

- `actions/leads.ts` — arquivo a estender com envio de e-mail pós-criação do lead
- `prisma/schema.prisma` — model `SiteConfig` com campo `contactEmail`
- `.env` — variável `RESEND_API_KEY` a adicionar

### Dependent Files

- `components/catalog/LeadFormInline.tsx` (task_05) — chama `submitLead`; não é afetado funcionalmente, apenas recebe o mesmo retorno
- `__tests__/actions/` — testes existentes de `submitLead` que precisam ser atualizados para mockar Resend

### Related ADRs

- [ADR-002: Resend como provedor de e-mail](adrs/adr-002.md) — Justifica a escolha do Resend e o padrão de falha silenciosa

## Deliverables

- `actions/leads.ts` estendida com envio de e-mail via Resend após criação do lead
- `RESEND_API_KEY` documentada em `.env.example`
- Testes unitários com mock do SDK Resend **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `submitLead` com `RESEND_API_KEY` definida e `contactEmail` válido — deve criar lead E chamar `resend.emails.send` uma vez.
  - [x] `submitLead` com `RESEND_API_KEY` ausente — deve criar lead E não chamar `resend.emails.send`; deve retornar `{ success: true }`.
  - [x] `submitLead` quando `resend.emails.send` lança exceção — deve retornar `{ success: true }` (falha silenciosa); lead deve estar no banco.
  - [x] `submitLead` com `contactEmail` vazio em `SiteConfig` — não deve chamar `resend.emails.send`.
  - [x] Verificar que o corpo do e-mail contém o nome e tipo do lead.
- Testes de integração:
  - [x] Fluxo completo com mock do Resend: lead criado no banco + e-mail enviado (verificar chamada ao mock).
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `submitLead` não quebra quando Resend falha ou está desconfigurado
- E-mail chega ao `contactEmail` configurado em ambiente de teste com Resend real (smoke test manual)
