---
status: pending
title: "Admin: configurações do site (WhatsApp, e-mail, links Technocalhas)"
type: frontend
complexity: low
dependencies:
  - task_09
---

# Task 14: Admin — configurações do site

## Overview

Implementa a página de configurações do painel admin que permite ao dono atualizar as configurações globais do site: número do WhatsApp, e-mail de contato, URL e descrição da Technocalhas, e nome da loja. Essas configurações alimentam o botão flutuante de WhatsApp, o footer e a seção Technocalhas da homepage.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/admin/configuracoes/page.tsx` com formulário de configurações globais
- DEVE criar `actions/config.ts` com `updateSiteConfig(data: Partial<SiteConfig>)` Server Action
- O formulário DEVE ter os campos: nome da loja, número do WhatsApp (apenas dígitos, com validação), e-mail de contato, URL da Technocalhas, descrição da Technocalhas
- `updateSiteConfig` DEVE usar `upsert` com `where: { id: 'singleton' }` para garantir único registro
- DEVE fazer `revalidatePath('/')`, `revalidatePath('/technocalhas')` e `revalidatePath('/contato')` após atualização
- A página DEVE carregar os valores atuais do `SiteConfig` ao abrir
</requirements>

## Subtasks

- [ ] 14.1 Criar `actions/config.ts` com `updateSiteConfig` usando upsert no `SiteConfig` singleton
- [ ] 14.2 Criar `app/admin/configuracoes/page.tsx` como Server Component que carrega o `SiteConfig` atual e passa para o form
- [ ] 14.3 Criar `components/admin/config/SiteConfigForm.tsx` com os campos e validação Zod (WhatsApp: 10–11 dígitos numéricos)

## Implementation Details

Referencie o modelo `SiteConfig` na seção "Data Models" do TechSpec — o `id` sempre é `"singleton"`.

`updateSiteConfig` usa `prisma.siteConfig.upsert({ where: { id: 'singleton' }, update: data, create: { id: 'singleton', ...data } })` para funcionar mesmo antes do seed ser executado.

O número do WhatsApp DEVE ser validado para conter apenas 10 ou 11 dígitos numéricos (sem máscara) — o link `https://wa.me/55{número}` é construído no `WhatsAppButton` da task 04.

### Relevant Files

- `app/admin/configuracoes/page.tsx`
- `actions/config.ts`
- `components/admin/config/SiteConfigForm.tsx`
- `lib/types.ts` — tipo `SiteConfig`
- `lib/prisma.ts`

### Dependent Files

- `components/layout/WhatsAppButton.tsx` (task 04) usa `NEXT_PUBLIC_WHATSAPP_NUMBER` — em uma evolução futura pode usar o banco
- `components/home/TechnocalhasSection.tsx` (task 05) lê `technocalhasDescription` do banco
- `app/(public)/technocalhas/page.tsx` (task 08) lê `technocalhasUrl` e `technocalhasDescription` do banco

### Related ADRs

Nenhum ADR específico para configurações.

## Deliverables

- `app/admin/configuracoes/page.tsx`
- `actions/config.ts`
- `components/admin/config/SiteConfigForm.tsx`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Schema Zod aceita número de WhatsApp com 10 dígitos (`1134567890`)
  - [ ] Schema Zod aceita número de WhatsApp com 11 dígitos (`11934567890`)
  - [ ] Schema Zod rejeita número de WhatsApp com 9 dígitos
  - [ ] Schema Zod rejeita número de WhatsApp com caracteres não numéricos
- Testes de integração:
  - [ ] `updateSiteConfig({ whatsappNumber: '11987654321' })` salva no banco e é lido corretamente na próxima query
  - [ ] `updateSiteConfig` executado sem `SiteConfig` existente cria o registro singleton
  - [ ] `updateSiteConfig` executado com `SiteConfig` existente atualiza sem duplicar
  - [ ] GET `/admin/configuracoes` retorna 200 e exibe os valores atuais do banco
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Atualizar o número do WhatsApp reflete no botão flutuante após revalidação
- Atualizar a descrição da Technocalhas reflete na homepage e na página `/technocalhas`
- Formulário carrega os valores atuais do banco ao abrir
