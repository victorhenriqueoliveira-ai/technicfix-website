---
status: completed
title: Reescrita de ProductCTAs + novo LeadFormInline
type: frontend
complexity: high
dependencies:
  - task_01
  - task_04
---

# Task 05: Reescrita de ProductCTAs + novo LeadFormInline

## Overview

Reescreve `components/catalog/ProductCTAs.tsx` substituindo os modais de lead por uma seção unificada com: seletor de perfil (varejista/atacadista), botões primários de WhatsApp com mensagem pré-preenchida e formulário de lead inline colapsável como alternativa secundária. Cria o componente `components/catalog/LeadFormInline.tsx` que reusa a Server Action `submitLead` existente sem alterações. Esta task é o coração da experiência de conversão pública.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE marcar `ProductCTAs` como `'use client'` e aceitar as props: `productId`, `productName`, `productType`, `whatsappNumber`, `showPrice`, `stock`.
- DEVE exibir seletor de perfil (varejista/atacadista) quando `productType === 'ambos'`; ocultar seletor e exibir apenas o CTA correspondente quando `productType === 'varejo'` ou `productType === 'atacado'`.
- DEVE gerar link WhatsApp varejo com mensagem `"Olá, tenho interesse no produto: {productName}"`.
- DEVE gerar link WhatsApp atacado com mensagem `"Olá, gostaria de solicitar um orçamento para: {productName}"`.
- O link WhatsApp DEVE usar `whatsappNumber` recebido via props — NUNCA hardcodado.
- DEVE desabilitar os botões WhatsApp quando `stock === 0`, exibindo badge "Indisponível".
- DEVE renderizar `LeadFormInline` colapsado por padrão; expansível via clique.
- `LeadFormInline` DEVE chamar `submitLead` (de `actions/leads.ts`) sem modificar a Server Action.
- `LeadFormInline` DEVE exibir campos progressivos: campos básicos sempre visíveis; campos de atacado (empresa, CNPJ, volume, prazo) aparecem ao selecionar tipo "atacado".
- `LeadFormInline` DEVE exibir feedback de sucesso ou erro após envio, sem recarregar a página.
- NÃO DEVE manter nenhum código de modal (`LeadVarejoModal`, `LeadAtacadoModal`) em `ProductCTAs`.
- DEVE preservar os `data-testid` existentes ou documentar os novos para atualização dos testes.
</requirements>

## Subtasks

- [x] 5.1 Reescrever `ProductCTAs.tsx`: remover imports de modais, adicionar props novas, implementar seletor de perfil com `useState`.
- [x] 5.2 Implementar geração de URL WhatsApp (`wa.me`) com `encodeURIComponent` para a mensagem.
- [x] 5.3 Implementar lógica de exibição condicional de botões por `productType` e desabilitação por `stock=0`.
- [x] 5.4 Criar `components/catalog/LeadFormInline.tsx` com campos progressivos e chamada a `submitLead`.
- [x] 5.5 Integrar `LeadFormInline` em `ProductCTAs` como seção colapsável abaixo dos botões WhatsApp.
- [x] 5.6 Atualizar ou criar testes para o novo comportamento de `ProductCTAs`.

## Implementation Details

Ver seção "Component Overview" e "Core Interfaces — ProductCTAsProps" do TechSpec para a interface completa de props e o fluxo de dados.

O estado do seletor de perfil é local (`useState`) — sem persistência em cookie ou localStorage no MVP.

O `LeadFormInline` deve reutilizar o schema de validação Zod existente em `lib/validations/` para os campos de lead, mantendo paridade com o comportamento dos modais removidos.

Para o fluxo de atacado multi-etapa: uma abordagem simples é `useState` com `step: 1 | 2` dentro de `LeadFormInline`, avançando ao clicar "Próximo" após preencher os campos obrigatórios do passo 1.

### Relevant Files

- `components/catalog/ProductCTAs.tsx` — arquivo a reescrever
- `actions/leads.ts` — Server Action `submitLead` a ser chamada por `LeadFormInline` sem alteração
- `lib/validations/` — schemas Zod de lead para validação no cliente
- `components/layout/WhatsAppButton.tsx` — referência de como o link `wa.me` é montado atualmente
- `__tests__/components/catalog/` — testes existentes de `ProductCTAs` a atualizar

### Dependent Files

- `app/(public)/produtos/[slug]/page.tsx` (task_07) — passa `whatsappNumber`, `productType`, `stock`, `showPrice` como props para `ProductCTAs`

### Related ADRs

- [ADR-001: Redesign dos CTAs com Admin Integrado](adrs/adr-001.md) — Decisão de substituir modais por CTA inline
- [ADR-005: SiteConfig como fonte do número WhatsApp nos CTAs](adrs/adr-005.md) — O número vem de props (lido pelo Server Component pai)

## Deliverables

- `components/catalog/ProductCTAs.tsx` reescrito (sem modais)
- `components/catalog/LeadFormInline.tsx` novo
- Testes unitários para `ProductCTAs` e `LeadFormInline` **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductCTAs` com `productType='ambos'` — deve exibir o seletor de perfil.
  - [x] `ProductCTAs` com `productType='varejo'` — deve ocultar seletor e exibir apenas botão varejo.
  - [x] `ProductCTAs` com `productType='atacado'` — deve ocultar seletor e exibir apenas botão atacado.
  - [x] `ProductCTAs` com `stock=0` — botões WhatsApp devem estar desabilitados; badge "Indisponível" visível; `LeadFormInline` ainda renderizado.
  - [x] Clicar em "Sou atacadista" no seletor — href do botão WhatsApp muda para mensagem de orçamento.
  - [x] Link WhatsApp gerado contém `wa.me/55{whatsappNumber}` e `encodeURIComponent(productName)`.
  - [x] `LeadFormInline` começa colapsado; expandir ao clicar no trigger.
  - [x] `LeadFormInline` com tipo "atacado" selecionado — campos de empresa aparecem.
  - [x] `LeadFormInline` submit com sucesso — exibe mensagem de confirmação sem recarregar.
  - [x] `LeadFormInline` submit com erro da Server Action — exibe mensagem de erro.
- Testes de integração:
  - [ ] Fluxo completo: selecionar perfil atacadista → expandir form → preencher campos → submit → lead criado no banco. (escopo de integração com banco real — fora do escopo de testes unitários desta task)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Nenhum modal de lead permanece em `ProductCTAs`
- Link WhatsApp nunca contém número hardcodado
- Formulário inline funciona em mobile (layout responsivo verificado manualmente)
