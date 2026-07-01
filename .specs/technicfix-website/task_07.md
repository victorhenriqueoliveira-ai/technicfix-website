---
status: completed
title: Server Actions de lead + modais de Lead Varejo e Lead Atacado
type: backend
complexity: medium
dependencies:
  - task_02
  - task_06
---

# Task 07: Server Actions de lead e modais de formulário

## Overview

Implementa a Server Action `submitLead` com validação Zod, e os dois modais de formulário de lead: Lead Varejo (interesse simples) e Lead Atacado (com CNPJ e volume). Os modais são abertos pelos CTAs do `ProductCard` e pré-populam o nome do produto. Esta task entrega o principal mecanismo de conversão do site.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `actions/leads.ts` com a função `submitLead(payload: LeadPayload)` marcada como `'use server'`
- DEVE validar o payload com Zod antes de persistir: campos obrigatórios por tipo (`varejo`: nome, e-mail, telefone; `atacado`: adiciona razão social, CNPJ; `geral`: nome, telefone, e-mail)
- DEVE validar o formato do CNPJ (14 dígitos numéricos após remover máscara) no schema Zod do tipo `atacado`
- DEVE criar `lib/validations/lead.ts` com os schemas Zod separados por tipo de lead
- DEVE criar `components/leads/LeadVarejoModal.tsx` com Dialog do shadcn/ui, campos: nome, e-mail, telefone, produto de interesse (pré-populado), mensagem opcional
- DEVE criar `components/leads/LeadAtacadoModal.tsx` com campos adicionais: razão social, CNPJ (com máscara), volume estimado, prazo desejado
- Ambos os modais DEVEM exibir estado de loading durante o envio e mensagem de sucesso/erro após
- `ProductCard` (task 06) DEVE ser atualizado para abrir os modais corretos ao clicar nos CTAs
- O formulário de lead geral da Homepage (task 05) DEVE ser integrado com a mesma `submitLead`
</requirements>

## Subtasks

- [x] 7.1 Criar `lib/validations/lead.ts` com schemas Zod para cada tipo de lead
- [x] 7.2 Criar `actions/leads.ts` com `submitLead` validando com Zod e persistindo no banco
- [x] 7.3 Criar `components/leads/LeadVarejoModal.tsx` com Dialog do shadcn/ui
- [x] 7.4 Criar `components/leads/LeadAtacadoModal.tsx` com campos B2B e máscara de CNPJ
- [x] 7.5 Integrar modais ao `ProductCard` da task 06 (passar `productId` e `productName` como props)
- [x] 7.6 Integrar `submitLead` ao `LeadGeneralForm` da task 05

## Implementation Details

Referencie a seção "API Endpoints — Server Actions" e "Core Interfaces — LeadPayload" do TechSpec.

`submitLead` retorna `{ success: boolean; error?: string }` para que o modal possa exibir feedback adequado sem refresh de página.

A máscara de CNPJ no modal de atacado é aplicada no input (cliente) mas a validação real (14 dígitos, dígitos verificadores) ocorre no schema Zod em `lib/validations/lead.ts`.

Leads criados com `productId` são associados ao produto via relação Prisma — útil para o admin filtrar leads por produto.

### Relevant Files

- `actions/leads.ts` — Server Action principal
- `lib/validations/lead.ts` — schemas Zod
- `components/leads/LeadVarejoModal.tsx`
- `components/leads/LeadAtacadoModal.tsx`
- `components/catalog/ProductCard.tsx` — atualizado para abrir modais
- `components/home/LeadGeneralForm.tsx` — integrado à action
- `lib/types.ts` — tipo `LeadPayload`
- `lib/prisma.ts` — persistência

### Dependent Files

- `task_13` (admin de leads) lê os leads criados por esta action

### Related ADRs

Nenhum ADR específico — validação e Server Actions são padrão Next.js App Router.

## Deliverables

- `actions/leads.ts` com `submitLead` validado e persistente
- `lib/validations/lead.ts` com schemas Zod por tipo
- `components/leads/LeadVarejoModal.tsx` funcional
- `components/leads/LeadAtacadoModal.tsx` funcional com validação de CNPJ
- `ProductCard` atualizado com modais integrados
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração da Server Action **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Schema Zod `varejo` rejeita payload sem e-mail
  - [x] Schema Zod `atacado` rejeita CNPJ com menos de 14 dígitos numéricos
  - [x] Schema Zod `atacado` rejeita CNPJ com dígitos verificadores inválidos
  - [x] Schema Zod `varejo` aceita payload com nome, e-mail e telefone válidos
  - [x] `LeadVarejoModal` exibe mensagem "Entraremos em contato em breve" após envio bem-sucedido
  - [x] `LeadVarejoModal` exibe mensagem de erro quando `submitLead` retorna `success: false`
- Testes de integração:
  - [x] `submitLead({ type: 'geral', ... })` retorna `{ success: true }` com payload válido
  - [x] `submitLead` com payload inválido retorna `{ success: false, error: '...' }` sem criar registro no banco
  - [x] Lead atacado aceita CNPJ com máscara e normaliza para persistência
  - [x] Schema rejeita CNPJ com dígitos verificadores inválidos
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Formulários de lead varejo e atacado enviam e confirmam na página de produto
- Formulário geral da homepage envia e confirma
- Leads aparecem no banco com tipo e status corretos
