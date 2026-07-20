---
status: completed
title: Corrigir import do Slider em PriceFilter.tsx
type: bugfix
complexity: low
dependencies: []
---

# Task 3: Corrigir import do Slider em PriceFilter.tsx

## Overview

O `PriceFilter.tsx` usa `import * as Slider from '@base-ui/react/Slider'`, o que resulta em `Slider.Root = undefined` em runtime — a página `/produtos` trava com tela branca. A correção é usar o named export correto: `import { Slider } from '@base-ui/react/Slider'`, alinhando-se com a API real da versão `^1.6.0` instalada.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE alterar a linha de import em `components/catalog/PriceFilter.tsx` de `import * as Slider` para `import { Slider }` de `'@base-ui/react/Slider'`
- DEVE verificar que todos os sub-componentes usados no JSX (`Slider.Root`, `Slider.Control`, `Slider.Track`, `Slider.Indicator`, `Slider.Thumb`) existem como propriedades do named export `Slider`
- NÃO DEVE alterar nenhuma outra lógica do componente além da linha de import
- DEVE verificar que a página `/produtos` renderiza sem erro de runtime após a correção
</requirements>

## Subtasks

- [x] 3.1 Ler `components/catalog/PriceFilter.tsx` e identificar a linha de import incorreta e os sub-componentes em uso
- [x] 3.2 Verificar a API exportada por `@base-ui/react/Slider` na versão instalada (`node_modules/@base-ui/react/dist/` ou documentação embutida)
- [x] 3.3 Corrigir o import para `import { Slider } from '@base-ui/react/Slider'`
- [x] 3.4 Confirmar que nenhum `Slider.X` usado no JSX ficou `undefined` com o novo import
- [x] 3.5 Executar testes do componente

## Implementation Details

Apenas `components/catalog/PriceFilter.tsx` precisa ser modificado. A mudança é cirúrgica: uma linha de import.

Para confirmar o export correto: `node_modules/@base-ui/react/Slider` deve exportar um objeto `Slider` com `Root`, `Control`, `Track`, `Indicator`, `Thumb` como propriedades. Verificar em `node_modules/@base-ui/react/dist/` ou via `console.log` em um arquivo de teste temporário.

### Relevant Files

- `components/catalog/PriceFilter.tsx` — único arquivo a ser alterado
- `node_modules/@base-ui/react/` — fonte de verdade para o export correto do Slider

### Dependent Files

- `app/(public)/produtos/page.tsx` — renderiza `PriceFilter`; confirmar que o erro de runtime desaparece

### Related ADRs

Nenhum ADR associado a esta tarefa (correção pontual de import).

## Deliverables

- `components/catalog/PriceFilter.tsx` com import corrigido
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Confirmação de que a página `/produtos` renderiza sem erro de runtime **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `PriceFilter` renderiza sem lançar `Element type is invalid` ou similar com `min=0` e `max=1000`
  - [ ] Slider exibe os dois thumbs na DOM após render
  - [ ] Alterar o valor do slider dispara o callback `onChange` (ou prop equivalente) com o novo valor
  - [ ] `PriceFilter` com `min=100` e `max=500` não renderiza valores fora do intervalo
- Testes de integração:
  - [ ] GET `/produtos` com `PriceFilter` montado não lança erro de runtime (test com `render` do página ou snapshot)
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Página `/produtos` renderiza sem erro `Element type is invalid: undefined`
- Nenhuma lógica de negócio do `PriceFilter` foi alterada — apenas o import
