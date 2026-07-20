---
status: completed
title: BenefitsBar — barra de 4 benefícios estática
type: frontend
complexity: low
dependencies: []
---

# Task 07: BenefitsBar — barra de 4 benefícios estática

## Overview

Cria o componente Server Component `components/home/BenefitsBar.tsx` — uma faixa horizontal com 4 colunas exibindo os diferenciais da TechnicFix logo abaixo do banner: ícone Lucide outline, título bold uppercase e descrição small. Conteúdo fixo no código (não configurável via BD nesta fase). Sem dependências de outras tasks — pode ser desenvolvida em paralelo com qualquer outra.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Server Component (sem hooks) em `components/home/BenefitsBar.tsx`
- DEVE renderizar exatamente os 4 benefícios definidos no PRD (F3): Frete para Todo o Brasil, Atendimento via WhatsApp, Qualidade Garantida, Variedade de Fixadores
- DEVE usar os ícones Lucide outline exatos da seção "BenefitsBar.tsx" do TechSpec: `Truck`, `MessageCircle`, `ShieldCheck`, `Package`
- DEVE usar um array `BENEFITS` constante definido no arquivo (sem fetch, sem BD)
- DEVE aplicar o grid `grid-cols-2 md:grid-cols-4` para responsividade mobile/desktop
- DEVE aplicar as classes Tailwind exatas do TechSpec: fundo `bg-white`, borda inferior `border-b border-gray-100`, ícones `text-brand-navy stroke-[1.5]`
- DEVE ser exportado como named export `BenefitsBar`
</requirements>

## Subtasks

- [x] 7.1 Criar `components/home/BenefitsBar.tsx` com o array `BENEFITS` constante
- [x] 7.2 Implementar o grid de 4 colunas com ícone, título e descrição
- [x] 7.3 Aplicar estilos Tailwind conforme o TechSpec
- [x] 7.4 Escrever testes unitários

## Implementation Details

Veja a seção "BenefitsBar.tsx (NOVO)" do TechSpec para a estrutura JSX exata, as classes Tailwind e os 4 benefícios padrão.

Os ícones `Truck`, `MessageCircle`, `ShieldCheck` e `Package` são do pacote `lucide-react` já instalado no projeto.

O array `BENEFITS` deve ter formato `{ Icon, title, description }[]` — não exportar, manter como constante interna do módulo.

### Relevant Files

- `components/home/BenefitsBar.tsx` — arquivo a ser criado

### Dependent Files

- `app/(public)/page.tsx` (task_10) — importa `BenefitsBar`

### Related ADRs

Nenhum ADR específico se aplica a esta tarefa.

## Deliverables

- `components/home/BenefitsBar.tsx` implementado e compilando
- Testes unitários verificando os 4 benefícios **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Renderiza exatamente 4 itens de benefício
  - [x] Cada item contém título e descrição corretos (verificar os 4 textos do PRD)
  - [x] Ícone `Truck` renderizado para o benefício de frete
  - [x] Ícone `MessageCircle` renderizado para o benefício de WhatsApp
  - [x] Ícone `ShieldCheck` renderizado para o benefício de qualidade
  - [x] Ícone `Package` renderizado para o benefício de variedade
  - [x] Wrapper tem classe `bg-white` e `border-b`
- Testes de integração:
  - [ ] `BenefitsBar` renderiza na homepage entre o Hero e as seções de categoria sem erros

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- 4 benefícios exibidos com ícones corretos
- Grid responsivo: 2 colunas mobile, 4 colunas desktop
- Nenhum erro de TypeScript
