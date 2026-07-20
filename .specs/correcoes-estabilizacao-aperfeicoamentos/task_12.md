---
status: completed
title: Auditar e corrigir app/sitemap.ts
type: backend
complexity: low
dependencies:
  - task_02
---

# Task 12: Auditar e corrigir `app/sitemap.ts`

## Overview

Corrige o campo `lastModified` em `app/sitemap.ts` para usar `updatedAt` real de cada produto e categoria do banco de dados, e verifica que apenas produtos com `status=ativo` são incluídos. O sitemap já existe e tem a estrutura correta — apenas dois pontos precisam de correção.

<critical>
- SEMPRE LEIA o PRD (F11) e o TechSpec (seção "Impact Analysis") antes de começar
- FOQUE NO "QUÊ" — descreva o que precisa ser realizado, não como
- TESTES OBRIGATÓRIOS — toda tarefa DEVE incluir testes nos deliverables
</critical>

<requirements>
- O campo `lastModified` de cada produto DEVE usar o valor de `product.updatedAt` (campo do tipo `Date` do Prisma)
- O campo `lastModified` de cada categoria DEVE usar o valor de `category.updatedAt` (campo do tipo `Date` do Prisma)
- A query de produtos DEVE incluir `where: { status: 'ativo' }` — verificar se já existe e manter/adicionar se necessário
- O acesso a `process.env.NEXT_PUBLIC_SITE_URL` DEVE usar `env.NEXT_PUBLIC_SITE_URL` (após task_02)
- O fallback hardcoded para `https://technicfix.com.br` DEVE ser removido (env validation em task_01 garante o valor)
- O intervalo `revalidate = 3600` DEVE ser mantido (adequado ao ritmo de atualização)
- As URLs estáticas (`/`, `/produtos`, `/sobre`, `/contato`, `/technocalhas`) DEVEM ser mantidas
</requirements>

## Subtasks

- [x] 12.1 Ler `app/sitemap.ts` atual para identificar exatamente o que `lastModified` usa agora (data estática, `new Date()`, ou `updatedAt`)
- [x] 12.2 Confirmar que a query de produtos tem `where: { status: 'ativo' }` — adicionar se ausente
- [x] 12.3 Confirmar que `updatedAt` está no select da query de produtos e categorias — adicionar se ausente
- [x] 12.4 Substituir o valor de `lastModified` por `product.updatedAt` / `category.updatedAt` no map
- [x] 12.5 Substituir `process.env.NEXT_PUBLIC_SITE_URL` por `env.NEXT_PUBLIC_SITE_URL` (task_02 pode já ter feito isso)
- [x] 12.6 Verificar `/sitemap.xml` em browser após deploy para confirmar que os dados dinâmicos aparecem corretamente

## Implementation Details

Exploração confirmou que `app/sitemap.ts` já tem `revalidate = 3600` e a estrutura correta com produtos e categorias. O ponto de atenção é que `/categorias/[slug]` está no sitemap mas atualmente redireciona — após task_11, estas URLs retornam 200, tornando a entrada no sitemap válida.

A query de produtos usa `status: 'ativo'` (confirmado pela exploração) — verificar na implementação atual antes de alterar. Se `updatedAt` não estiver no select Prisma, adicionar ao campo `select` da query.

### Relevant Files

- `app/sitemap.ts` — único arquivo a modificar

### Dependent Files

- Nenhum arquivo depende de `sitemap.ts`

### Related ADRs

Nenhum ADR se aplica diretamente a esta task.

## Deliverables

- `app/sitemap.ts` com `lastModified` usando `updatedAt` real para produtos e categorias
- `app/sitemap.ts` com filtro `status: 'ativo'` confirmado ou adicionado
- Testes unitários com 80%+ de cobertura **(OBRIGATÓRIO)**

## Tests

- Testes unitários:
  - [x] Produto com `updatedAt = new Date('2026-06-01')` aparece no sitemap com `lastModified = '2026-06-01T...'`
  - [x] Produto com `status = 'inativo'` NÃO aparece no sitemap
  - [x] Categoria aparece no sitemap com `lastModified` igual ao seu `updatedAt`
  - [x] URL base usa `env.NEXT_PUBLIC_SITE_URL` (não string hardcoded)
- Testes de integração:
  - [x] GET `/sitemap.xml` retorna XML válido com ao menos um produto e uma categoria
  - [x] Todos os `<lastmod>` no sitemap são datas ISO válidas (não `undefined` ou `null`)
  - [x] Nenhum produto com `status = 'inativo'` aparece no XML
- Meta de cobertura de testes: >=80%
- Todos os testes devem passar

## Success Criteria

- Todos os testes passando
- Cobertura de testes >=80%
- GET `/sitemap.xml` retorna 200 com XML bem formado
- `<lastmod>` de cada entrada corresponde à data real de `updatedAt` do banco (verificável comparando com o painel admin)
- Nenhum produto inativo ou com `status` diferente de `'ativo'` aparece no sitemap
