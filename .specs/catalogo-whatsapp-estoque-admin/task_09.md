---
status: completed
title: Dashboard enriquecido com Recharts (gráficos + métricas de venda)
type: frontend
complexity: high
dependencies:
  - task_02
---

# Task 09: Dashboard enriquecido com Recharts (gráficos + métricas de venda)

## Overview

Instala Recharts e enriquece `app/(admin)/admin/page.tsx` com: quarta métrica "Vendas este mês", gráfico de linha/barras de vendas por dia (últimos 30 dias) e lista visual de top 5 produtos mais vendidos com barra de progresso relativa. Os dados de vendas vêm das Server Actions `getSalesSummary` e `getTopProducts` criadas na task_02. Toda a renderização de gráficos fica em Client Components wrapper para compatibilidade com Server Components.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE instalar `recharts` verificando compatibilidade com React 19 antes de instalar.
- DEVE criar `components/admin/DashboardCharts.tsx` como Client Component (`'use client'`) recebendo dados via props.
- DEVE adicionar quarta métrica "Vendas este mês" ao dashboard usando `MetricCard` existente.
- DEVE exibir gráfico de vendas por dia (BarChart ou LineChart do Recharts) com seletor de período (7d / 30d / mês atual).
- DEVE exibir lista "Top 5 produtos mais vendidos" com nome e barra de progresso relativa ao maior valor.
- DEVE exibir estado vazio "Nenhuma venda registrada ainda" quando `getSalesSummary` retorna array vazio.
- O seletor de período DEVE alterar os dados do gráfico sem recarregar a página (estado local no Client Component ou `searchParams`).
- DEVE usar as cores da paleta já definida no projeto (variáveis CSS Tailwind existentes) — não introduzir novas cores.
- NÃO DEVE bloquear a renderização do dashboard se a query de vendas retornar vazio (estado vazio gracioso).
</requirements>

## Subtasks

- [x] 9.1 Instalar `recharts` e verificar que `npm install recharts` conclui sem erros de peer dependency com React 19.
- [x] 9.2 Adicionar query de vendas do mês ao `app/(admin)/admin/page.tsx` (count de Sales do mês corrente).
- [x] 9.3 Buscar dados de `getSalesSummary({ period: '30d' })` e `getTopProducts({ period: '30d', limit: 5 })` no Server Component.
- [x] 9.4 Criar `components/admin/DashboardCharts.tsx` com `BarChart` de vendas por dia e lista de top produtos.
- [x] 9.5 Adicionar `MetricCard` de "Vendas este mês" ao grid existente.
- [x] 9.6 Implementar seletor de período no `DashboardCharts` que atualiza os dados exibidos.

## Implementation Details

Ver seção "Component Overview" do TechSpec (bloco `[AdminDashboard]`) e "Integration Points — Recharts" para o padrão de Client Component wrapper.

O Server Component do dashboard deve passar `salesByDay: SalesByDay[]` e `topProducts: TopProduct[]` como props serializáveis (arrays de objetos simples) para o `DashboardCharts`.

Para o seletor de período com Recharts: o Client Component recebe os dados de todos os períodos disponíveis via props (ou faz fetch client-side ao mudar o período). A abordagem mais simples para o MVP é receber apenas os dados do período padrão (30d) e filtrar no cliente para 7d.

O `BarChart` do Recharts requer um contêiner com altura definida — usar `height={300}` como valor fixo no MVP.

Para a barra de progresso do top produtos: calcular `(totalSold / maxTotalSold) * 100` como porcentagem e usar uma `<div>` com `width` inline.

### Relevant Files

- `app/(admin)/admin/page.tsx` — arquivo a estender com novas queries e `DashboardCharts`
- `components/admin/MetricCard.tsx` — componente existente a reutilizar para métrica de vendas
- `actions/sales.ts` (task_02) — `getSalesSummary` e `getTopProducts` a chamar
- `package.json` — verificar versão do React antes de instalar recharts

### Dependent Files

Nenhum arquivo downstream depende desta task.

### Related ADRs

- [ADR-003: Recharts como biblioteca de gráficos](adrs/adr-003.md) — Justifica a escolha do Recharts e o padrão de Client Component wrapper

## Deliverables

- `recharts` instalado e funcional
- `components/admin/DashboardCharts.tsx` com gráfico de barras e lista de top produtos
- `app/(admin)/admin/page.tsx` atualizado com nova métrica e `DashboardCharts`
- Testes unitários para `DashboardCharts` **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `DashboardCharts` com `salesByDay=[]` — deve exibir mensagem "Nenhuma venda registrada ainda" em vez do gráfico.
  - [ ] `DashboardCharts` com 7 dias de dados — deve renderizar `BarChart` sem erro (snapshot ou verificação de presença do elemento).
  - [ ] `DashboardCharts` com `topProducts=[{ productName: 'Produto A', totalSold: 10 }, { productName: 'Produto B', totalSold: 5 }]` — "Produto A" deve ter barra de progresso 100% e "Produto B" 50%.
  - [ ] Seletor de período: mudar de "30d" para "7d" — gráfico exibe apenas os últimos 7 dias de dados.
  - [ ] `MetricCard` de "Vendas este mês" exibe o valor numérico correto passado via prop.
- Testes de integração:
  - [ ] Dashboard renderiza com 4 MetricCards (Produtos, Categorias, Leads, Vendas este mês) quando há dados no banco.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `recharts` instalado sem erros de peer dependency
- Gráfico renderiza sem erro de hidratação (Client Component corretamente isolado)
- Dashboard exibe estado vazio gracioso quando não há vendas
- Cores do gráfico usam a paleta existente do projeto
