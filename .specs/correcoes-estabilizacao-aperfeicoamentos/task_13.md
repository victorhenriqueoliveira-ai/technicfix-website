---
status: completed
title: Criar DashboardLeadsCharts.tsx e estender admin/page.tsx com dados de leads
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 13: Criar `DashboardLeadsCharts.tsx` e estender `admin/page.tsx` com dados de leads

## Overview

Cria o Client Component `DashboardLeadsCharts` com 3 gráficos Recharts (volume diário, composição por tipo, funil de conversão) com seletor de período (7d/30d/90d), e adiciona as 3 queries de leads agregadas ao Server Component `admin/page.tsx`.

<critical>
- SEMPRE LEIA o PRD (F12) e o TechSpec (seções "Data Models", "Core Interfaces") antes de começar
- REFERENCIE O TECHSPEC para as queries `db.lead.groupBy()` e para os tipos `LeadsByDay`, `LeadsByType`, `LeadFunnel`
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- `DashboardLeadsCharts.tsx` DEVE ser um Client Component (`'use client'`) usando Recharts (já instalado)
- O componente DEVE ter um seletor de período (7d / 30d / 90d) que altera os dados exibidos — o período selecionado filtra os dados passados via props
- O seletor de período DEVE ter o mesmo estilo dos botões de período no `DashboardCharts.tsx` existente
- Os 3 gráficos DEVEM ser: (1) Linha — volume de leads por dia; (2) Barras empilhadas — leads varejo vs. atacado vs. geral por dia; (3) Barras horizontais — funil por status (novo / em_atendimento / convertido / perdido)
- Os tipos `LeadsByDay`, `LeadsByType` e `LeadFunnel` (de `lib/types.ts`, task_06) DEVEM ser usados para tipar as props
- `admin/page.tsx` DEVE adicionar as 3 queries de leads ao `Promise.all` existente para não introduzir latência extra
- As queries DEVEM usar `db.lead.groupBy()` conforme TechSpec seção "Data Models"
- O período padrão dos dados passados como props DEVE cobrir os últimos 90 dias (o seletor de período no componente filtra client-side dentro desse conjunto)
</requirements>

## Subtasks

- [x] 13.1 Verificar a API do `DashboardCharts.tsx` existente para reutilizar o padrão de seletor de período e layout de cards
- [x] 13.2 Criar `components/admin/DashboardLeadsCharts.tsx` com as 3 seções de gráficos e seletor 7d/30d/90d
- [x] 13.3 Adicionar as 3 queries de leads ao `Promise.all` em `app/(admin)/admin/page.tsx`
- [x] 13.4 Processar os resultados do `groupBy` para os formatos `LeadsByDay[]`, `LeadsByType[]` e `LeadFunnel[]`
- [x] 13.5 Passar as props processadas para `DashboardLeadsCharts` abaixo de `DashboardCharts` no layout
- [x] 13.6 Garantir que a seção de leads tem título "Análise de Leads" e descrição de período

## Implementation Details

`admin/page.tsx` já usa `Promise.all` com 6 queries. Adicionar 3 queries ao mesmo `Promise.all` sem latência extra (o pool de conexões do Neon serverless executa todas em paralelo).

O `db.lead.groupBy()` retorna arrays com `_count.id` — processar para os tipos do TechSpec antes de passar como props.

O seletor de período em `DashboardLeadsCharts` filtra client-side (os dados já foram carregados server-side com 90 dias): `leadsByDay.filter(d => new Date(d.date) >= subDays(today, period))`.

Ver TechSpec seção "Data Models" para as queries exatas de `groupBy` de volume diário, composição por tipo e funil.

`DashboardCharts.tsx` (existente) pode ser referenciado para o padrão visual de botões de período e cards de gráfico.

### Relevant Files

- `components/admin/DashboardLeadsCharts.tsx` — arquivo novo a criar
- `app/(admin)/admin/page.tsx` — adicionar queries e renderizar `DashboardLeadsCharts`
- `lib/types.ts` — `LeadsByDay`, `LeadsByType`, `LeadFunnel` (disponíveis após task_06)
- `components/admin/DashboardCharts.tsx` — referência de padrão visual

### Dependent Files

Nenhum arquivo depende de `DashboardLeadsCharts` além de `admin/page.tsx`.

### Related ADRs

Nenhum ADR específico para esta task. Ver TechSpec seção "Data Models" para decisões sobre queries.

## Deliverables

- `components/admin/DashboardLeadsCharts.tsx` criado com 3 gráficos e seletor de período
- `app/(admin)/admin/page.tsx` com 3 queries de leads adicionadas e `DashboardLeadsCharts` renderizado
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `DashboardLeadsCharts` com `leadsByDay` vazio renderiza gráfico de linha sem crash
  - [ ] Seletor "7d" filtra `leadsByDay` para exibir apenas os últimos 7 dias dos dados fornecidos
  - [ ] Seletor "30d" filtra `leadsByDay` para exibir apenas os últimos 30 dias
  - [ ] Seletor "90d" exibe todos os dados passados como prop
  - [ ] `DashboardLeadsCharts` com `leadFunnel = [{ status: 'novo', count: 5 }, ...]` renderiza barras com os valores corretos
  - [ ] `DashboardLeadsCharts` com `leadsByType` com entradas `varejo`, `atacado`, `geral` renderiza as 3 séries no gráfico de barras empilhadas
- Testes de integração:
  - [ ] GET `/admin` retorna HTML com a seção "Análise de Leads"
  - [ ] A seção de leads aparece abaixo dos gráficos de vendas existentes
  - [ ] Os 3 gráficos são visíveis no dashboard com dados reais (não todos zeros)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Dashboard admin exibe "Análise de Leads" com 3 gráficos abaixo dos gráficos de vendas
- Seletor de período (7d/30d/90d) altera os dados exibidos em todos os 3 gráficos simultaneamente
- Latência da página `/admin` não aumenta (queries de leads paralelas ao `Promise.all` existente)
