---
status: completed
title: Módulo de Vendas no admin (página + SalesList + RegisterSaleDrawer + sidebar)
type: frontend
complexity: high
dependencies:
  - task_02
---

# Task 08: Módulo de Vendas no admin (página + SalesList + RegisterSaleDrawer + sidebar)

## Overview

Cria o módulo completo de vendas no admin: página `app/(admin)/admin/vendas/page.tsx` com listagem filtrada de vendas, componente `SalesList` com tabela e filtro de período, componente `RegisterSaleDrawer` com drawer lateral para registro manual de venda, e adição do item "Vendas" no menu lateral `AdminSidebar`. O registro de venda chama `registerSale` (task_02) e desconta o estoque automaticamente.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/(admin)/admin/vendas/page.tsx` como Server Component protegido pelo layout admin existente.
- DEVE criar `components/admin/SalesList.tsx` como Client Component com: tabela de vendas (colunas: produto, qtd, tipo, data, notas), filtro de período (últimos 7 dias / 30 dias / mês atual) e estado vazio "Nenhuma venda registrada ainda".
- DEVE criar `components/admin/RegisterSaleDrawer.tsx` como Client Component com: campo de busca de produto por nome, campo de quantidade (numérico, mín 1), select de tipo de comprador (varejo/atacado), campo de notas opcional, botão de confirmação.
- DEVE chamar `registerSale` de `actions/sales.ts` ao confirmar o registro de venda.
- DEVE exibir toast de sucesso com novo saldo de estoque após registro bem-sucedido.
- DEVE exibir mensagem de erro quando `registerSale` retorna `{ success: false }` (ex.: estoque insuficiente) sem fechar o drawer.
- DEVE adicionar item `{ href: '/admin/vendas', label: 'Vendas', icon: ShoppingCart }` ao array `navLinks` em `AdminSidebar.tsx`.
- DEVE fechar o drawer e atualizar a listagem após registro bem-sucedido (via `router.refresh()` ou `revalidatePath`).
- A busca de produto no drawer DEVE filtrar apenas produtos com `status='ativo'` e `stock > 0`.
</requirements>

## Subtasks

- [x] 8.1 Adicionar item "Vendas" com ícone `ShoppingCart` de `lucide-react` ao `navLinks` em `AdminSidebar.tsx`.
- [x] 8.2 Criar `app/(admin)/admin/vendas/page.tsx` com query de vendas e passagem de dados para `SalesList`.
- [x] 8.3 Criar `components/admin/SalesList.tsx` com tabela, filtro de período e estado vazio.
- [x] 8.4 Criar `components/admin/RegisterSaleDrawer.tsx` com formulário de registro de venda.
- [x] 8.5 Integrar `registerSale` no drawer com feedback de sucesso/erro.
- [x] 8.6 Verificar que a navegação "Vendas" no sidebar redireciona corretamente e que o item fica ativo na rota.

## Implementation Details

Ver seção "Component Overview" do TechSpec (bloco `[AdminVendasPage]`) e "API Endpoints — registerSale" para a interface da Server Action.

O padrão de sidebar existente em `AdminSidebar.tsx` usa um array `navLinks` com `href`, `label` e `icon` — adicionar o item seguindo exatamente esse padrão.

Para o drawer, o projeto já tem `shadcn` e `@base-ui/react` disponíveis — verificar se há componente de Drawer/Sheet já em uso em outros módulos admin antes de implementar do zero.

O filtro de período em `SalesList` pode funcionar como Client Component com `useState` para o período selecionado, fazendo `fetch` ou chamando a Server Action `getSalesSummary` — ou pode usar `searchParams` no Server Component pai para manter o estado na URL (mais robusto).

### Relevant Files

- `components/admin/AdminSidebar.tsx` — adicionar item "Vendas" ao navLinks
- `actions/sales.ts` (task_02) — `registerSale` e `getSalesSummary` a chamar
- `app/(admin)/admin/leads/page.tsx` — referência de padrão para listagem admin com filtros
- `components/admin/MetricCard.tsx` — referência de padrão de card admin
- `app/(admin)/layout.tsx` — layout protegido que envolve a nova página

### Dependent Files

- `app/(admin)/admin/page.tsx` (task_09) — não depende desta task, mas fica no mesmo layout

### Related ADRs

- [ADR-004: Nova model Sale separada](adrs/adr-004.md) — Justifica que vendas têm sua própria tabela e listagem

## Deliverables

- `components/admin/AdminSidebar.tsx` com item "Vendas" adicionado
- `app/(admin)/admin/vendas/page.tsx` criada e funcional
- `components/admin/SalesList.tsx` com tabela e filtro de período
- `components/admin/RegisterSaleDrawer.tsx` com formulário e integração com `registerSale`
- Testes unitários para `RegisterSaleDrawer` e `SalesList` **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `RegisterSaleDrawer` fecha após registro bem-sucedido.
  - [ ] `RegisterSaleDrawer` exibe "Estoque insuficiente" quando `registerSale` retorna `{ success: false, error: 'Estoque insuficiente' }` e permanece aberto.
  - [ ] `RegisterSaleDrawer` campo quantidade com valor `0` — botão de confirmação deve estar desabilitado.
  - [ ] `SalesList` com array vazio de vendas — deve exibir "Nenhuma venda registrada ainda".
  - [ ] `SalesList` com filtro "7d" — deve exibir apenas vendas dos últimos 7 dias.
  - [ ] Item "Vendas" no sidebar está ativo quando pathname começa com `/admin/vendas`.
- Testes de integração:
  - [ ] Fluxo completo: abrir drawer → buscar produto → informar qty=2 → confirmar → `Sale` criada no banco + `Product.stock` decrementado em 2.
  - [ ] Registro de venda com qty > stock → erro exibido no drawer → nenhum `Sale` criado no banco.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Item "Vendas" visível e ativo no sidebar ao navegar para `/admin/vendas`
- Registro de venda atualiza `Product.stock` imediatamente (tabela de produtos reflete o novo estoque)
- Drawer exibe feedback claro de sucesso ou erro
