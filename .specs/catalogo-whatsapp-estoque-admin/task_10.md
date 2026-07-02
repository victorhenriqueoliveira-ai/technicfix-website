---
status: completed
title: Alerta visual de estoque baixo na listagem de produtos admin
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 10: Alerta visual de estoque baixo na listagem de produtos admin

## Overview

Adiciona destaque visual à célula de estoque na tabela de produtos admin (`app/(admin)/admin/produtos/page.tsx`) quando `product.stock <= 5`, sinalizando ao operador que o produto precisa de reposição antes de zerar. A implementação é uma mudança pontual de estilo condicional na célula já existente — sem nova tela, sem nova query.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE aplicar destaque visual (badge vermelho ou texto em cor de alerta) na célula de estoque quando `product.stock <= 5`.
- DEVE exibir o valor numérico do estoque em todos os casos (com ou sem alerta).
- DEVE usar as classes Tailwind e tokens de cor já existentes no projeto para o alerta — não introduzir novas cores.
- NÃO DEVE criar nova rota, nova query ou novo componente dedicado — a mudança é restrita à célula de estoque na tabela existente.
- O limiar de alerta é `stock <= 5` (inclusivo), conforme definido no PRD F7.
- Produto com `stock = 0` DEVE ter destaque visual ainda mais claro (ex.: badge "Esgotado" ou estilo diferente de `stock = 3`).
</requirements>

## Subtasks

- [x] 10.1 Localizar a célula de estoque na tabela de produtos em `app/(admin)/admin/produtos/page.tsx`.
- [x] 10.2 Aplicar classe condicional Tailwind: estoque normal → texto padrão; `stock <= 5 && stock > 0` → badge amarelo/laranja; `stock === 0` → badge vermelho "Esgotado".
- [x] 10.3 Verificar renderização visual em desenvolvimento com produtos de diferentes níveis de estoque.

## Implementation Details

Ver seção "Impact Analysis" do TechSpec (linha de `app/(admin)/admin/produtos/page.tsx`) e a nota na seção "Component Overview" sobre estilo condicional.

A tabela de produtos já exibe a coluna "Estoque" com `product.stock` — a mudança é apenas no JSX dessa célula, adicionando lógica condicional de classe.

Padrão sugerido:
- `stock > 5`: sem destaque especial
- `stock > 0 && stock <= 5`: badge com fundo amarelo/laranja e texto do número
- `stock === 0`: badge com fundo vermelho e texto "Esgotado"

### Relevant Files

- `app/(admin)/admin/produtos/page.tsx` — único arquivo a modificar nesta task
- `components/ui/` — verificar se há componente de Badge já disponível no projeto

### Dependent Files

Nenhum arquivo downstream depende desta task.

### Related ADRs

Nenhum ADR específico para esta task.

## Deliverables

- `app/(admin)/admin/produtos/page.tsx` com destaque visual de estoque baixo na tabela
- Testes unitários cobrindo os três estados de estoque **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Produto com `stock=10` — célula de estoque renderiza sem badge de alerta.
  - [x] Produto com `stock=5` — célula renderiza com badge de alerta amarelo/laranja com o valor "5".
  - [x] Produto com `stock=1` — célula renderiza com badge de alerta com o valor "1".
  - [x] Produto com `stock=0` — célula renderiza com badge vermelho com texto "Esgotado".
  - [x] Produto com `stock=6` — célula renderiza sem badge (limiar exclusivo acima de 5).
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Alerta visível e distinguível em desenvolvimento com produtos de diferentes níveis de estoque
- Nenhuma regressão visual na tabela de produtos (outros campos intactos)
- Cores do alerta coerentes com a identidade visual do projeto
