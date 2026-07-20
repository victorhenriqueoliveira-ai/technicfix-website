---
status: completed
title: Remover blocos de código morto em Header.tsx e BenefitsBar.tsx
type: refactor
complexity: low
dependencies: []
---

# Task 05: Remover blocos de código morto em `Header.tsx` e `BenefitsBar.tsx`

## Overview

Remove dois blocos de código comentado que não serão mais utilizados: o `CategoryNav`/`CategoryAccordion` no menu mobile de `Header.tsx` e o item "Frete para Todo o Brasil" em `BenefitsBar.tsx`. Nenhuma funcionalidade é alterada.

<critical>
- SEMPRE LEIA o PRD (F4) e o TechSpec (seção "Impact Analysis") antes de começar
- REFERENCIE O TECHSPEC para localizar exatamente os blocos a remover
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- O bloco `<nav>` com `CategoryAccordion` comentado em `Header.tsx` (linhas 78–83 aproximadamente) DEVE ser removido completamente
- O bloco de Camada 3 com `CategoryNav` comentado (desktop, linhas ~103–104) DEVE ser removido completamente
- Os imports não utilizados após a remoção (`CategoryNav`, `CategoryAccordion`) DEVEM ser removidos de `Header.tsx`
- O item "Frete para Todo o Brasil" (com ícone `Truck`) comentado em `BenefitsBar.tsx` DEVE ser removido
- O import `Truck` de lucide-react em `BenefitsBar.tsx` DEVE ser removido após a remoção do item
- O comportamento visual e funcional do `Header` e do `BenefitsBar` DEVE permanecer idêntico após a remoção
- `components/layout/CategoryNav.tsx` em si NÃO deve ser excluído (pode ser reutilizado no futuro)
</requirements>

## Subtasks

- [x] 5.1 Remover o bloco `<nav>` com `CategoryAccordion` comentado em `Header.tsx`
- [x] 5.2 Remover o bloco de `CategoryNav` (desktop) comentado em `Header.tsx`
- [x] 5.3 Remover imports de `CategoryNav` e `CategoryAccordion` em `Header.tsx` se não forem mais usados
- [x] 5.4 Verificar se o prop `categories` ainda é necessário em `Header.tsx` após as remoções (removido da assinatura e do caller em layout.tsx)
- [x] 5.5 Remover o item "Frete" comentado em `BenefitsBar.tsx` e o import `Truck`
- [x] 5.6 Verificar visualmente que o header e a barra de benefícios renderizam corretamente (TypeScript build limpo sem erros)

## Implementation Details

Exploração confirmou:

**`Header.tsx`**: Comentários em duas localizações:
1. Dentro do mobile Sheet drawer: bloco `<nav>` com `CategoryAccordion`
2. Desktop (linhas ~103-104): bloco com `CategoryNav`

Ambos `CategoryNav` e `CategoryAccordion` são importados mas não renderizados após as remoções — os imports devem ser removidos. O prop `categories` é recebido pelo Header mas não é usado no JSX após a remoção; verificar se pode ser removido da assinatura do componente sem quebrar o caller.

**`BenefitsBar.tsx`**: Item "Frete para Todo o Brasil" comentado com `Truck` de lucide-react. Atualmente há 3 benefícios ativos em grid `grid-cols-2 md:grid-cols-3`; remover o 4º comentado não altera o grid.

### Relevant Files

- `components/layout/Header.tsx` — remover 2 blocos comentados + imports não utilizados
- `components/home/BenefitsBar.tsx` — remover item comentado + import `Truck`

### Dependent Files

- Qualquer arquivo que chame `Header` passando `categories` — verificar se o prop pode ser removido
- `components/layout/CategoryNav.tsx` — NÃO modificar; apenas remover o import em `Header.tsx`

### Related ADRs

Nenhum ADR se aplica a esta task.

## Deliverables

- `components/layout/Header.tsx` sem blocos comentados e sem imports não utilizados
- `components/home/BenefitsBar.tsx` sem item comentado e sem import `Truck`
- Build TypeScript sem erros (`tsc --noEmit`)
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `Header` renderiza sem erros com e sem o prop `categories` (ou com o prop removido)
  - [ ] `BenefitsBar` renderiza exatamente 3 items (não 4)
  - [ ] Nenhuma referência a `CategoryNav`, `CategoryAccordion` ou `Truck` permanece nos arquivos modificados (verificado por grep)
- Testes de integração:
  - [ ] Header aparece corretamente em viewport mobile (375px) e desktop (1280px) sem elementos comentados visíveis
  - [ ] BenefitsBar aparece com 3 itens no grid sem erros no console
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- `grep -n "CategoryNav\|CategoryAccordion\|Truck" components/layout/Header.tsx components/home/BenefitsBar.tsx` retorna zero resultados
- Build sem erros TypeScript
