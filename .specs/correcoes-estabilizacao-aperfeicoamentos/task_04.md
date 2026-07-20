---
status: completed
title: Criar ADR de risco NextAuth beta
type: docs
complexity: low
dependencies: []
---

# Task 04: Criar ADR de risco NextAuth beta

## Overview

Cria o arquivo `docs/adr/001-nextauth-beta.md` documentando o risco de uso da versão `next-auth@5.0.0-beta.31` em produção, com critérios objetivos para decidir quando executar o upgrade para a versão estável.

<critical>
- SEMPRE LEIA o PRD (F3) antes de começar
- REFERENCIE O TECHSPEC para a estrutura esperada do documento
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- O arquivo DEVE ser criado em `docs/adr/001-nextauth-beta.md` (criar diretório `docs/adr/` se não existir)
- O documento DEVE conter: versão atual em uso (`5.0.0-beta.31`), riscos identificados de uso em produção de versão beta, e critérios objetivos para executar o upgrade quando a versão estável for publicada
- O documento DEVE usar o formato ADR padrão já estabelecido no projeto (ver `.specs/correcoes-estabilizacao-aperfeicoamentos/adrs/adr-001.md` como referência de formato)
- Os critérios de upgrade DEVEM ser verificáveis objetivamente (ex.: "versão estável publicada no npm sem beta tag", "changelog não contém breaking changes na área de autenticação")
</requirements>

## Subtasks

- [x] 4.1 Criar diretório `docs/adr/` na raiz do repositório se não existir
- [x] 4.2 Verificar a versão exata do `next-auth` no `package.json` para confirmar `5.0.0-beta.31`
- [x] 4.3 Pesquisar o changelog público do NextAuth v5 para identificar breaking changes conhecidos entre beta e stable
- [x] 4.4 Escrever `docs/adr/001-nextauth-beta.md` com: contexto, decisão, riscos, critérios de upgrade e referências
- [x] 4.5 Verificar que o arquivo está acessível e bem formatado em Markdown

## Implementation Details

O repositório já possui ADRs em `.specs/correcoes-estabilizacao-aperfeicoamentos/adrs/` — usar o mesmo formato (Status, Data, Contexto, Decisão, Alternativas Consideradas, Consequências). O novo arquivo fica em `docs/adr/` (raiz do repo), que é o local canônico de ADRs de projeto (distinto dos ADRs de spec).

`package.json` confirmado com `next-auth@5.0.0-beta.31` (NextAuth v5 beta em uso em produção).

Conteúdo sugerido para os critérios de upgrade:
1. `next-auth` publicado no npm sem sufixo `beta` ou `rc`
2. Changelog da versão stable não lista breaking changes na API de `auth()`, `signIn()`, `signOut()`, ou no schema de sessão
3. Nenhuma issue aberta crítica no repositório `nextauthjs/next-auth` marcada como `bug` nos últimos 30 dias antes do upgrade

### Relevant Files

- `docs/adr/001-nextauth-beta.md` — arquivo novo a criar
- `package.json` — referência para a versão exata do next-auth
- `.specs/correcoes-estabilizacao-aperfeicoamentos/adrs/adr-001.md` — referência de formato ADR

### Dependent Files

- Nenhum arquivo de código depende deste documento

### Related ADRs

Nenhum ADR de spec se aplica diretamente a esta task de documentação.

## Deliverables

- `docs/adr/001-nextauth-beta.md` criado com conteúdo completo
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Arquivo `docs/adr/001-nextauth-beta.md` existe no repositório
  - [x] Arquivo contém as seções: "Status", "Contexto", "Riscos", "Critérios de Upgrade"
  - [x] Versão `5.0.0-beta.31` está mencionada no documento
  - [x] Documento é Markdown válido (sem syntax errors)
- Testes de integração:
  - [ ] N/A — documento estático sem integração com sistema
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- `docs/adr/001-nextauth-beta.md` existe e está acessível no repositório
- Documento contém pelo menos 3 critérios objetivos e verificáveis para disparar o upgrade
- Qualquer desenvolvedor novo consegue entender o risco e quando agir lendo apenas este arquivo
