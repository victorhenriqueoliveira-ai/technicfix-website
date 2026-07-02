---
status: completed
title: Suporte aos campos showPrice, productType e relatedProductIds no admin de produtos
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 04: Suporte aos campos showPrice, productType e relatedProductIds no admin de produtos

## Overview

Estende `actions/products.ts` para incluir `showPrice`, `productType` e `relatedProductIds` nas operações de criação e edição de produto, e adiciona os controles visuais correspondentes em `ProductForm.tsx`: toggle para "Sob consulta", select para tipo de público e campo de seleção múltipla de produtos relacionados. Permite que o admin controle o comportamento de exibição de preço e os relacionados manuais sem intervenção técnica.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE incluir `showPrice` (Boolean), `productType` (enum ProductType) e `relatedProductIds` (String[]) no `FormData` processado por `actions/products.ts` nas operações `createProduct` e `updateProduct`.
- DEVE adicionar em `ProductForm.tsx` um toggle/checkbox "Exibir preço" mapeado ao campo `showPrice` (marcado por padrão).
- DEVE adicionar em `ProductForm.tsx` um select "Tipo de público" com opções Varejo, Atacado, Ambos — mapeado ao campo `productType` (padrão: Ambos).
- DEVE adicionar em `ProductForm.tsx` um campo de busca/seleção múltipla de produtos relacionados, armazenando apenas os IDs no campo `relatedProductIds`.
- O campo `relatedProductIds` NÃO DEVE permitir selecionar o próprio produto como relacionado.
- DEVE preservar todos os campos e comportamentos existentes do `ProductForm` sem regressão.
- DEVE garantir que produtos salvos antes desta task continuem editáveis sem erro (valores padrão aplicados pela migration da task_01).
</requirements>

## Subtasks

- [x] 4.1 Estender `actions/products.ts`: incluir `showPrice`, `productType` e `relatedProductIds` no parse do `FormData` e no `db.product.create/update`.
- [x] 4.2 Adicionar toggle "Exibir preço" ao `ProductForm.tsx` com estado inicial `showPrice=true`.
- [x] 4.3 Adicionar select "Tipo de público" ao `ProductForm.tsx` com as três opções do enum `ProductType`.
- [x] 4.4 Adicionar busca e seleção múltipla de produtos relacionados ao `ProductForm.tsx` (excluindo o produto atual na edição).
- [x] 4.5 Verificar que a submissão do formulário existente (sem os novos campos preenchidos) continua funcionando com os defaults.

## Implementation Details

Ver seção "Impact Analysis" do TechSpec (linhas de `actions/products.ts` e `ProductForm.tsx`) para os pontos específicos de extensão.

O `ProductForm.tsx` recebe `action: (formData: FormData) => Promise<ProductActionResult>` — os novos campos devem ser incluídos no `FormData` antes do submit, seja via `<input type="hidden">` ou fields visíveis.

Para o campo `relatedProductIds`, uma abordagem simples é um `<select multiple>` ou checkboxes com os produtos da mesma instância — os IDs devem ser serializados como múltiplos valores `relatedProductIds[]` no FormData ou como JSON string, conforme o padrão já adotado em outros campos do projeto.

### Relevant Files

- `actions/products.ts` — Server Actions de produto a estender
- `components/admin/products/ProductForm.tsx` — formulário de produto a estender com novos campos
- `prisma/schema.prisma` — campos `showPrice`, `productType`, `relatedProductIds` (criados na task_01)
- `lib/validations/` — verificar se há schemas Zod de validação de produto a atualizar

### Dependent Files

- `components/catalog/ProductCTAs.tsx` (task_05) — lê `productType` via props passadas pela page
- `components/catalog/RelatedProducts.tsx` (task_06) — lê `relatedProductIds` do produto via query
- `app/(public)/produtos/[slug]/page.tsx` (task_07) — passa `showPrice` e `productType` como props

### Related ADRs

Nenhum ADR específico para esta task.

## Deliverables

- `actions/products.ts` atualizada com suporte aos novos campos
- `components/admin/products/ProductForm.tsx` com toggle, select e seleção de relacionados
- Testes unitários dos novos campos no formulário **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] `ProductForm` renderiza com `showPrice=true` marcado por padrão.
  - [x] `ProductForm` renderiza select de tipo de público com opção "Ambos" selecionada por padrão.
  - [x] Desmarcar "Exibir preço" e submeter o formulário — `showPrice=false` deve estar no FormData.
  - [x] Selecionar tipo "Atacado" e submeter — `productType='atacado'` deve estar no FormData.
  - [x] Selecionar dois produtos relacionados — ambos os IDs devem estar em `relatedProductIds`.
  - [x] Campo `relatedProductIds` não exibe o produto atual como opção (em modo edição).
- Testes de integração:
  - [x] `createProduct` com `showPrice=false` e `productType='varejo'` — produto criado no banco com os valores corretos.
  - [x] `updateProduct` de produto existente adicionando `relatedProductIds` — IDs salvos corretamente.
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Produto criado/editado com os novos campos reflete os valores corretos no banco
- Produtos existentes continuam editáveis sem erro nos novos campos
