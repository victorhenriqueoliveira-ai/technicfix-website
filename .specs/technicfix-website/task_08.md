---
status: pending
title: "Páginas institucionais: Sobre, Contato e Technocalhas"
type: frontend
complexity: medium
dependencies:
  - task_04
---

# Task 08: Páginas institucionais

## Overview

Implementa as três páginas institucionais do storefront: Sobre Nós (história e missão da Technicfix), Contato (endereço, telefone, mapa e formulário de contato) e Technocalhas (detalhamento da empresa irmã com serviços e CTA). São páginas majoritariamente estáticas com conteúdo que o admin pode atualizar via configurações (task 14).

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/(public)/sobre/page.tsx` com seções: história da Technicfix, missão/valores e localização
- DEVE criar `app/(public)/contato/page.tsx` com: endereço, telefone, e-mail, embed do Google Maps (iframe) e formulário de contato usando `submitLead` com `type: 'geral'`
- DEVE criar `app/(public)/technocalhas/page.tsx` com: logo da Technocalhas (imagem estática), descrição dos serviços e CTA de contato
- O conteúdo das páginas DEVE ser estático no MVP (texto hardcoded), com a URL e descrição da Technocalhas lidas do `SiteConfig` do banco
- O formulário de contato em `/contato` DEVE reusar `LeadGeneralForm` da task 05 ou a Server Action `submitLead` diretamente
- O embed do Google Maps DEVE aceitar a URL do mapa como variável configurável (hardcoded no MVP, mas estruturado para tornar-se editável)
- Todas as páginas DEVEM ter breadcrumb de navegação
</requirements>

## Subtasks

- [ ] 8.1 Criar `app/(public)/sobre/page.tsx` com layout de duas colunas (texto + imagem de localização)
- [ ] 8.2 Criar `app/(public)/contato/page.tsx` com dados de contato, iframe do Maps e formulário reutilizando `submitLead`
- [ ] 8.3 Criar `app/(public)/technocalhas/page.tsx` lendo `technocalhasUrl` e `technocalhasDescription` do `SiteConfig`
- [ ] 8.4 Adicionar breadcrumb simples (`Início > Sobre`) em todas as três páginas

## Implementation Details

Referencie a seção "Features Principais — Páginas Institucionais" do PRD.

`/technocalhas/page.tsx` faz uma query ao `SiteConfig` singleton para ler `technocalhasDescription` e `technocalhasUrl`. Os demais textos são estáticos no MVP.

O iframe do Google Maps em `/contato` usa uma URL de embed configurável — no MVP, hardcoded no componente. Um placeholder de mapa é exibido se a URL não estiver configurada.

### Relevant Files

- `app/(public)/sobre/page.tsx`
- `app/(public)/contato/page.tsx`
- `app/(public)/technocalhas/page.tsx`
- `actions/leads.ts` — reutilizado no formulário de contato
- `lib/prisma.ts` — query ao SiteConfig para a página Technocalhas

### Dependent Files

- `task_14` (admin de configurações) atualiza `SiteConfig` que estas páginas consomem
- `task_15` (SEO) adiciona `generateMetadata` a estas páginas

### Related ADRs

Nenhum ADR específico para estas páginas estáticas.

## Deliverables

- `app/(public)/sobre/page.tsx`
- `app/(public)/contato/page.tsx` com formulário funcional
- `app/(public)/technocalhas/page.tsx` lendo dados do banco
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**
- Testes de integração das rotas **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `/technocalhas` renderiza a descrição retornada pelo `SiteConfig`
  - [ ] `/technocalhas` renderiza texto de fallback quando `technocalhasDescription` está vazio
  - [ ] `/contato` não renderiza iframe quando a URL do Maps não está configurada
- Testes de integração:
  - [ ] GET `/sobre` retorna 200
  - [ ] GET `/contato` retorna 200 e HTML contém `<form>`
  - [ ] GET `/technocalhas` retorna 200
  - [ ] POST de formulário de contato em `/contato` com dados válidos cria lead do tipo `geral` no banco
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Três páginas acessíveis e responsivas
- Formulário de contato envia e confirma corretamente
- Página Technocalhas exibe dados do banco
