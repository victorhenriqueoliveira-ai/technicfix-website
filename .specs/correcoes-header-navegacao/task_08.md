---
status: completed
title: Varredura e correção de outros imports de UI libs
type: bugfix
complexity: low
dependencies: []
---

# Task 8: Varredura e correção de outros imports de UI libs

## Overview

Varre todos os componentes do projeto em busca do mesmo padrão incorreto de import corrigido na task_03 (`import * as X from 'lib'` onde `X` é um namespace em vez de um named export), especificamente para bibliotecas de UI como `@base-ui/react` e similares. Componentes com este padrão falham silenciosamente em runtime com `X.Component = undefined`.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE varrer todos os arquivos `.tsx` e `.ts` em `components/` e `app/` por ocorrências de `import * as` de bibliotecas de UI de terceiros (`@base-ui/react`, `@radix-ui`, `lucide-react`, e similares)
- DEVE verificar para cada ocorrência encontrada se o padrão `namespace.SubComponent` resulta em `undefined` (comparando com os exports reais do pacote)
- DEVE corrigir cada import problemático para o padrão correto (named export ou namespace, conforme o que o pacote exporta)
- NÃO DEVE alterar imports que estejam corretos — apenas imports com risco confirmado de `undefined` em runtime
- DEVE documentar os resultados da varredura: quais imports foram encontrados, quais eram problemáticos e quais correções foram aplicadas
</requirements>

## Subtasks

- [x] 8.1 Executar grep por `import \* as` em `components/` e `app/` filtrando imports de pacotes de UI (não de arquivos locais)
- [x] 8.2 Para cada ocorrência, verificar o export real do pacote em `node_modules/` e confirmar se é namespace ou named
- [x] 8.3 Corrigir os imports problemáticos confirmados
- [x] 8.4 Executar `tsc --noEmit` para verificar que não há erros de tipo após as correções
- [x] 8.5 Executar os testes dos componentes corrigidos para confirmar que não regridem

## Implementation Details

Usar `grep -r "import \* as" components/ app/ --include="*.tsx" --include="*.ts"` como ponto de partida.

Para cada resultado, verificar o export do pacote:
- `@base-ui/react/*` — subpaths tipicamente exportam named exports (ex.: `{ Slider }`, `{ Dialog }`)
- `lucide-react` — exporta named exports diretamente; `import * as Icons` pode ser legítimo mas `Icons.X` deve ser verificado
- `@radix-ui/react-*` — tipicamente namespaced (ex.: `import * as Dialog from '@radix-ui/react-dialog'` é o padrão oficial)

Priorizar correções onde o arquivo em questão usa `X.SubComponent` que pode ser `undefined`.

### Relevant Files

- Todos os arquivos `.tsx` e `.ts` em `components/` e `app/` — a determinar pela varredura
- `node_modules/@base-ui/react/` — verificar exports dos subpaths usados

### Dependent Files

- Componentes corrigidos podem ter testes correspondentes em `__tests__/` — executar após correção

### Related ADRs

Nenhum ADR associado — varredura e correção preventiva.

## Deliverables

- Lista documentada (em comentário de commit ou PR) dos imports encontrados, problemáticos e corrigidos
- Correções aplicadas nos arquivos identificados
- Testes unitários dos componentes corrigidos com 80%+ de cobertura **(OBRIGATÓRIO)**
- `tsc --noEmit` limpo **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] Cada componente corrigido renderiza sem lançar `Element type is invalid` ou `X is not a function`
  - [ ] Sub-componentes usados (`X.Root`, `X.Trigger`, etc.) não são `undefined` após a correção — verificar via snapshot ou `expect(Component).toBeDefined()`
- Testes de integração:
  - [ ] `tsc --noEmit` retorna exit code 0 em todo o projeto após todas as correções
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Nenhum `import * as X` de bibliotecas de UI resulta em `X.SubComponent = undefined` em runtime
- `tsc --noEmit` retorna exit code 0
- Nenhum comportamento funcional foi alterado — apenas os imports foram corrigidos
