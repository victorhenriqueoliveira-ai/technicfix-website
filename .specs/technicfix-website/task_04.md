---
status: pending
title: "Layout público: Header, Footer e botão WhatsApp flutuante"
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 04: Layout público — Header, Footer e WhatsApp flutuante

## Overview

Implementa o layout compartilhado de todas as páginas públicas do storefront: header com logo e navegação, footer com informações da loja, e o botão flutuante de WhatsApp fixo em todas as telas. Este layout envolve todas as rotas do grupo `(public)` e é a base visual para as tasks 05, 06 e 08.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE criar `app/(public)/layout.tsx` com Header e Footer envolvendo o conteúdo das páginas filhas
- DEVE criar `components/layout/Header.tsx` com logo da Technicfix, links de navegação principais (Início, Produtos, Sobre, Contato, Technocalhas) e responsividade mobile (menu hambúrguer)
- DEVE criar `components/layout/Footer.tsx` com nome da loja, links rápidos e informações de contato
- DEVE criar `components/layout/WhatsAppButton.tsx` como botão fixo (`position: fixed`) no canto inferior direito, visível em todas as páginas públicas
- O número de WhatsApp DEVE ser lido da variável de ambiente `NEXT_PUBLIC_WHATSAPP_NUMBER`
- DEVE ser mobile-first: o layout deve funcionar corretamente em 320px, 768px e 1280px
- O header DEVE ter um estado "sticky" ao rolar a página
- DEVE usar componentes shadcn/ui onde aplicável (Sheet para menu mobile)
</requirements>

## Subtasks

- [ ] 4.1 Criar `app/(public)/layout.tsx` importando Header, Footer e WhatsAppButton
- [ ] 4.2 Criar `components/layout/Header.tsx` com logo, navegação desktop e menu mobile (Sheet do shadcn/ui)
- [ ] 4.3 Criar `components/layout/Footer.tsx` com links, contato e copyright
- [ ] 4.4 Criar `components/layout/WhatsAppButton.tsx` com link `https://wa.me/{número}` e ícone do WhatsApp
- [ ] 4.5 Validar layout em viewport mobile (320px) e desktop (1280px) sem overflow horizontal

## Implementation Details

Referencie a seção "Estrutura de Rotas" do TechSpec para o grupo `(public)` e o layout raiz.

O `WhatsAppButton` lê `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` e formata o link como `https://wa.me/55{número}` (sem formatação, apenas dígitos). Se a variável não estiver definida, o botão não é renderizado.

O Header usa `usePathname` para destacar o link ativo na navegação.

### Relevant Files

- `app/(public)/layout.tsx` — layout do grupo público
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/WhatsAppButton.tsx`
- `app/layout.tsx` — root layout (fontes, providers globais)

### Dependent Files

- `task_05` (Homepage) usa este layout
- `task_06` (Catálogo) usa este layout
- `task_08` (Páginas institucionais) usa este layout

### Related ADRs

Nenhum ADR específico — decisões de layout derivam dos requisitos de UX do PRD.

## Deliverables

- `app/(public)/layout.tsx`
- `components/layout/Header.tsx` com menu mobile funcional
- `components/layout/Footer.tsx`
- `components/layout/WhatsAppButton.tsx`
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [ ] `WhatsAppButton` não renderiza quando `NEXT_PUBLIC_WHATSAPP_NUMBER` não está definido
  - [ ] `WhatsAppButton` renderiza link `https://wa.me/55{número}` quando variável está definida
  - [ ] `Header` renderiza link ativo com classe de destaque correspondente ao pathname atual
  - [ ] Menu mobile (Sheet) abre ao clicar no ícone hambúrguer e fecha ao clicar em um link
- Testes de integração:
  - [ ] GET `/` retorna HTML com elementos `<header>` e `<footer>` presentes
  - [ ] Layout não causa overflow horizontal em viewport de 320px
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Header sticky funciona ao rolar a página
- Menu mobile abre e fecha corretamente
- Botão WhatsApp visível e clicável em mobile e desktop
- Nenhum erro de TypeScript
