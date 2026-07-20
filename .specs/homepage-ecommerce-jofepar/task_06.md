---
status: completed
title: HomepageProductCard — card de produto para homepage
type: frontend
complexity: low
dependencies:
  - task_01
---

# Task 06: HomepageProductCard — card de produto para homepage

## Overview

Cria o componente Server Component `components/home/HomepageProductCard.tsx` — o card de produto exibido nas seções da homepage. Inclui imagem quadrada 1:1, badge opcional, preço amber condicional (`showPrice`), botão "Falar pelo WhatsApp" com mensagem pré-preenchida e link "Ver detalhes". Depende apenas da task_01 pelo tipo `ProductSummary` com `showPrice`.

<critical>
- SEMPRE LEIA o PRD e o TechSpec antes de começar
- REFERENCIE O TECHSPEC para detalhes de implementação — não duplique aqui
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- MINIMIZE CÓDIGO — mostre código apenas para ilustrar a estrutura atual ou áreas problemáticas
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- DEVE ser um Server Component (sem `'use client'`) em `components/home/HomepageProductCard.tsx`
- DEVE aceitar `product: ProductSummary` e `whatsappNumber: string` como props
- DEVE renderizar imagem quadrada 1:1 com `loading="lazy"`, `object-contain` e fundo `bg-gray-50`
- DEVE exibir badge no canto superior esquerdo APENAS se `product.badge` não for null
- DEVE exibir preço em amber bold APENAS se `product.showPrice === true` E `product.price !== null`
- DEVE formatar o preço em BRL: `new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- O link do WhatsApp DEVE abrir `https://wa.me/55<whatsappNumber>?text=<mensagem pré-preenchida com nome do produto>` em nova aba (`target="_blank" rel="noopener"`)
- O link "Ver detalhes" DEVE apontar para `/produtos/<product.slug>`
- DEVE aplicar as classes Tailwind exatas da seção "HomepageProductCard.tsx" do TechSpec: hover shadow, border, rounded-xl
- Imagem vazia (`product.images[0]` ausente): usar string vazia como src sem quebrar
</requirements>

## Subtasks

- [x] 6.1 Criar `components/home/HomepageProductCard.tsx` como Server Component
- [x] 6.2 Implementar área de imagem com aspect-square, loading lazy e badge condicional
- [x] 6.3 Implementar área de info com nome, preço condicional e CTAs
- [x] 6.4 Montar URL do WhatsApp com mensagem pré-preenchida e número do prop
- [x] 6.5 Escrever testes unitários cobrindo os cenários condicionais

## Implementation Details

Veja a seção "HomepageProductCard.tsx (NOVO)" do TechSpec para a estrutura JSX exata e as classes Tailwind.

O campo `showPrice` em `ProductSummary` é adicionado pela task_01. Se implementada em paralelo, alinhar com o tipo antes de compilar.

A mensagem pré-preenchida do WhatsApp deve seguir o padrão existente no projeto: `"Olá, tenho interesse no produto [nome]"` encodada em `encodeURIComponent`.

Verificar se existe um `WhatsAppIcon` SVG no projeto (o TechSpec menciona `<WhatsAppIcon className="w-4 h-4" />`). Se não existir, usar o ícone do Lucide ou criar um SVG inline simples.

### Relevant Files

- `components/home/HomepageProductCard.tsx` — arquivo a ser criado
- `lib/types.ts` — `ProductSummary` com `showPrice` (task_01)
- `components/layout/WhatsAppButton.tsx` — verificar se tem o ícone WhatsApp reutilizável

### Dependent Files

- `components/home/CategoryProductSection.tsx` (task_09) — importa `HomepageProductCard`

### Related ADRs

Nenhum ADR específico se aplica a esta tarefa.

## Deliverables

- `components/home/HomepageProductCard.tsx` implementado e compilando
- Testes unitários cobrindo badge, showPrice e link WhatsApp **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Produto com `badge: "Mais Vendido"`: badge visível no canto superior esquerdo
  - [x] Produto com `badge: null`: nenhum badge renderizado
  - [x] Produto com `showPrice: true` e `price: 49.90`: exibe "R$ 49,90" em amber
  - [x] Produto com `showPrice: false`: preço NÃO renderizado
  - [x] Produto com `showPrice: true` e `price: null`: preço NÃO renderizado
  - [x] Link WhatsApp: href contém `wa.me/55<número>` e o nome do produto encodado
  - [x] Link WhatsApp: `target="_blank"` e `rel="noopener"`
  - [x] Link "Ver detalhes": href é `/produtos/<product.slug>`
  - [x] Produto sem imagens (`images: []`): componente renderiza sem crash (src="")
- Testes de integração:
  - [ ] `HomepageProductCard` renderiza em uma `CategoryProductSection` sem erros (CategoryProductSection é task_09, fora do escopo desta task)

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- Badge, preço e links condicionais funcionando corretamente
- Nenhum erro de TypeScript
- Imagem com `loading="lazy"` em todos os casos
